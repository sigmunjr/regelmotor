(function () {
    'use strict';
    var rc = ruleCompiler;
    var Value = rc.Value;
    var Rule = rc.Rule;
    var Sum = rc.Sum;
    var And = rc.And;
    var Multiply = rc.Multiply;
    var If = rc.If;
    var Else = rc.Else;
    var Token = rc.Token;
    var LessThan = rc.LessThan;
    var MoreThan = rc.MoreThan;
    var Equal = rc.Equal;
    var RuleCompiler = new rc.RuleEvaluator();

    describe('Token', function () {
        var test1;

        beforeEach(function () {
            test1 = [new Value(2), new Sum, new Value(1)]
        });

        it('Tree is built correctly', function () {
            var root = Token.buildTreeAndGetRoot(test1);
            expect(root).toBe(test1[1]);
            expect(root.children[0]).toBe(test1[0]);
            expect(root.children[1]).toBe(test1[2]);
        })
    });

    describe('RuleEvaluator', function () {

        describe('Summation', function () {
            var test1 = [];
            var test2 = [];

            beforeEach(function () {
                test1 = [new Value(2), new Sum, new Value(1)];
                for (var i = 1; i < 5; i++) {
                    test2.push(new Value(i));
                    test2.push(new Sum);
                }
                test2.pop();
            });

            it('should sum correctly', function () {
                var result = RuleCompiler.parse(test1);
                var result2 = RuleCompiler.parse(test2);
                expect(result.value).toBe(3);
                expect(result2.value).toBe(10);
            });
        });

        describe('Multiplication', function () {
            var test1 = [];
            var test2 = [];

            beforeEach(function () {
                test1 = [new Value(2), new Multiply, new Value(1)];
                for (var i = 1; i < 5; i++) {
                    test2.push(new Value(i));
                    test2.push(new Multiply);
                }
                test2.pop();
            });

            it('should multiply correctly', function () {
                var result1 = RuleCompiler.parse(test1);
                var result2 = RuleCompiler.parse(test2);
                expect(result1.value).toBe(2);
                expect(result2.value).toBe(24);
            });
        });

        it('should multiply before sum', function () {
            var test1 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3)];
            var result = RuleCompiler.parse(test1);
            expect(result.value).toBe(7);
        });

        describe('boolean operators', function () {
           it('should implement "less than" correctly', function () {
               var test1 = [new Value(2), new LessThan(), new Value(2)];
               var test2 = [new Value(2), new LessThan(), new Value(1)];
               var test3 = [new Value(1), new LessThan(), new Value(2)];

               expect(RuleCompiler.parse(test1).value).toBeFalsy();
               expect(RuleCompiler.parse(test2).value).toBeFalsy();
               expect(RuleCompiler.parse(test3).value).toBeTruthy();

           });
            it('should implement "more than" correctly', function () {
                var test1 = [new Value(2), new MoreThan(), new Value(2)];
                var test2 = [new Value(2), new MoreThan(), new Value(1)];
                var test3 = [new Value(1), new MoreThan(), new Value(2)];

                expect(RuleCompiler.parse(test1).value).toBeFalsy();
                expect(RuleCompiler.parse(test2).value).toBeTruthy();
                expect(RuleCompiler.parse(test3).value).toBeFalsy();

            });
            it('should implement "equal" correctly', function () {
                var test1 = [new Value(2), new Equal(), new Value(2)];
                var test2 = [new Value(2), new Equal(), new Value(1)];
                var test3 = [new Value(1), new Equal(), new Value(2)];

                expect(RuleCompiler.parse(test1).value).toBeTruthy();
                expect(RuleCompiler.parse(test2).value).toBeFalsy();
                expect(RuleCompiler.parse(test3).value).toBeFalsy();
            });

            it('should implement "and" correctly', function () {
                var test1 = [new Value(2), new Equal, new Value(2), new And, new Value(2), new LessThan, new Value(1)];
                var test2 = [new Value(2), new LessThan, new Value(1), new And, new Value(2), new MoreThan, new Value(1)];

                var test3 = [new Value(2), new Equal, new Value(2), new And, new Value(2), new MoreThan, new Value(1)];
                var test4 = [new Value(5), new MoreThan, new Value(2), new And, new Value(2), new MoreThan, new Value(1)];

                expect(RuleCompiler.parse(test1).value).toBeFalsy();
                expect(RuleCompiler.parse(test2).value).toBeFalsy();

                expect(RuleCompiler.parse(test3).value).toBeTruthy();
                expect(RuleCompiler.parse(test4).value).toBeTruthy();
            });
        });

        describe('If operator', function () {
            it('should give null if false', function () {
                var test1 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Rule(false)];
                var test2 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Value(2), new LessThan(), new Value(1)];

                expect(RuleCompiler.parse(test1)).toBe(null);
                expect(RuleCompiler.parse(test2)).toBe(null);
            });

            it('should give prior token if true', function () {
                var test1 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Rule(true)];
                var test2 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Value(2), new MoreThan(), new Value(1)];

                expect(RuleCompiler.parse(test1).value).toBe(7);
                expect(RuleCompiler.parse(test2).value).toBe(7);
            });
        });

        describe('Else operator', function () {
            it('should pass on left value if not null', function () {
                var test1 = [new Value(22), new Else(), new Value(11)];
                var test2 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Value(2), new MoreThan(), new Value(1), new Else(), new Value(4)];

                expect(RuleCompiler.parse(test1).value).toBe(22);
                expect(RuleCompiler.parse(test2).value).toBe(7);
            });

            it('should give new value if left token is null', function () {
                var test1 = [new Else(), new Value(11)];
                var test2 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Value(1), new MoreThan(), new Value(2), new Else(), new Value(4)];

                expect(RuleCompiler.parse(test1).value).toBe(11);
                expect(RuleCompiler.parse(test2).value).toBe(4);
            });
        });
    });
})();