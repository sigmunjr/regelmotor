(function () {
    'use strict';
    var rg = ruleGenerator;
    var Value = rg.Value;
    var Rule = rg.Rule;
    var Sum = rg.Sum;
    var Multiply = rg.Multiply;
    var If = rg.If;
    var Else = rg.Else;
    var Token = rg.Token;
    var LessThan = rg.LessThan;
    var MoreThan = rg.MoreThan;
    var Equal = rg.Equal;
    var RuleGenerator = new rg.RuleGenerator();

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

    describe('RuleGenerator', function () {
        var test1 = [];
        var test2 = [];

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
                var result = RuleGenerator.parse(test1);
                var result2 = RuleGenerator.parse(test2);
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
                var result1 = RuleGenerator.parse(test1);
                var result2 = RuleGenerator.parse(test2);
                expect(result1.value).toBe(2);
                expect(result2.value).toBe(24);
            });
        });

        it('should multiply before sum', function () {
            var test1 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3)];
            var result = RuleGenerator.parse(test1);
            expect(result.value).toBe(7);
        });

        describe('boolean operators', function () {
           it('should implement "less than" correctly', function () {
               var test1 = [new Value(2), new LessThan(), new Value(2)];
               var test2 = [new Value(2), new LessThan(), new Value(1)];
               var test3 = [new Value(1), new LessThan(), new Value(2)];

               expect(RuleGenerator.parse(test1).value).toBeFalsy();
               expect(RuleGenerator.parse(test2).value).toBeFalsy();
               expect(RuleGenerator.parse(test3).value).toBeTruthy();

           });
            it('should implement "more than" correctly', function () {
                var test1 = [new Value(2), new MoreThan(), new Value(2)];
                var test2 = [new Value(2), new MoreThan(), new Value(1)];
                var test3 = [new Value(1), new MoreThan(), new Value(2)];

                expect(RuleGenerator.parse(test1).value).toBeFalsy();
                expect(RuleGenerator.parse(test2).value).toBeTruthy();
                expect(RuleGenerator.parse(test3).value).toBeFalsy();

            });
            it('should implement "equal" correctly', function () {
                var test1 = [new Value(2), new Equal(), new Value(2)];
                var test2 = [new Value(2), new Equal(), new Value(1)];
                var test3 = [new Value(1), new Equal(), new Value(2)];

                expect(RuleGenerator.parse(test1).value).toBeTruthy();
                expect(RuleGenerator.parse(test2).value).toBeFalsy();
                expect(RuleGenerator.parse(test3).value).toBeFalsy();
            });
        });

        describe('If operator', function () {
            it('should give null if false', function () {
                var test1 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Rule(false)];
                var test2 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Value(2), new LessThan(), new Value(1)];

                expect(RuleGenerator.parse(test1)).toBe(null);
                expect(RuleGenerator.parse(test2)).toBe(null);
            });

            it('should give prior token if true', function () {
                var test1 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Rule(true)];
                var test2 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Value(2), new MoreThan(), new Value(1)];

                expect(RuleGenerator.parse(test1).value).toBe(7);
                expect(RuleGenerator.parse(test2).value).toBe(7);
            });
        });

        describe('Else operator', function () {
            it('should pass on left value if not null', function () {
                var test1 = [new Value(22), new Else(), new Value(11)];
                var test2 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Value(2), new MoreThan(), new Value(1), new Else(), new Value(4)];

                expect(RuleGenerator.parse(test1).value).toBe(22);
                expect(RuleGenerator.parse(test2).value).toBe(7);
            });

            it('should give new value if left token is null', function () {
                var test1 = [new Else(), new Value(11)];
                var test2 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Value(1), new MoreThan(), new Value(2), new Else(), new Value(4)];

                expect(RuleGenerator.parse(test1).value).toBe(11);
                expect(RuleGenerator.parse(test2).value).toBe(4);
            });
        });
    });
})();