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

    function getResultValueForArray(test) {
        var first = Token.arrayToLinkedList(test);
        var result = RuleGenerator.parse(first);
        if (result) return result.value;
        return result;
    }

    describe('TokenIterator', function () {
        var first;

        beforeEach(function () {
            var prev = first = new Value(0, null, null);
            for (var i = 1; i < 10; i++) {
                var cur = new Value(i, prev, null);
                if (prev) {
                    prev.next = cur;
                }
                prev = cur;
            }
        });

        it('should iterate orderly', function () {
            var it = first.chain();
            var i = 0;
            while (it.hasNext()) {
                var token = it.next();
                expect(token.value).toBe(i);
                i++;
            }
        })
    });

    describe('RuleGenerator', function () {
        var first;

        describe('Summation', function () {
            beforeEach(function () {
                var prev = first = null;
                for (var i = 1; i < 5; i++) {
                    var cur = new Value(i, prev, null);
                    if (prev) {
                        prev.next = cur;
                    } else {
                        first = cur;
                    }
                    cur.next = new Sum(cur, null);
                    cur = cur.next;
                    prev = cur;
                }
                prev.prev.next = null;
            });

            it('should sum correctly', function () {
                var result = RuleGenerator.parse(first);
                expect(result.value).toBe(10);
            });
        });

        describe('Multiplication', function () {
            beforeEach(function () {
                var prev = first = null;
                for (var i = 1; i < 5; i++) {
                    var cur = new Value(i, prev, null);
                    if (prev) {
                        prev.next = cur;
                    } else {
                        first = cur;
                    }
                    cur.next = new Multiply(cur, null);
                    cur = cur.next;
                    prev = cur;
                }
                prev.prev.next = null;
            });

            it('should multiply correctly', function () {
                var result = RuleGenerator.parse(first);
                expect(result.value).toBe(24);
            });
        });

        it('should multiply before sum', function () {
            var test1 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3)];
            expect(getResultValueForArray(test1)).toBe(7);
        });

        describe('boolean operators', function () {
           it('should implement "less than" correctly', function () {
               var test1 = [new Value(2), new LessThan(), new Value(2)];
               var test2 = [new Value(2), new LessThan(), new Value(1)];
               var test3 = [new Value(1), new LessThan(), new Value(2)];

               expect(getResultValueForArray(test1)).toBeFalsy();
               expect(getResultValueForArray(test2)).toBeFalsy();
               expect(getResultValueForArray(test3)).toBeTruthy();

           });
            it('should implement "more than" correctly', function () {
                var test1 = [new Value(2), new MoreThan(), new Value(2)];
                var test2 = [new Value(2), new MoreThan(), new Value(1)];
                var test3 = [new Value(1), new MoreThan(), new Value(2)];

                expect(getResultValueForArray(test1)).toBeFalsy();
                expect(getResultValueForArray(test2)).toBeTruthy();
                expect(getResultValueForArray(test3)).toBeFalsy();

            });
            it('should implement "equal" correctly', function () {
                var test1 = [new Value(2), new Equal(), new Value(2)];
                var test2 = [new Value(2), new Equal(), new Value(1)];
                var test3 = [new Value(1), new Equal(), new Value(2)];

                expect(getResultValueForArray(test1)).toBeTruthy();
                expect(getResultValueForArray(test2)).toBeFalsy();
                expect(getResultValueForArray(test3)).toBeFalsy();
            });
        });

        describe('If operator', function () {
            it('should give null if false', function () {
                var test1 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Rule(false)];
                var test2 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Value(2), new LessThan(), new Value(1)];

                expect(getResultValueForArray(test1)).toBe(null);
                expect(getResultValueForArray(test2)).toBe(null);
            });

            it('should give prior token if true', function () {
                var test1 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Rule(true)];
                var test2 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Value(2), new MoreThan(), new Value(1)];

                expect(getResultValueForArray(test1)).toBe(7);
                expect(getResultValueForArray(test2)).toBe(7);
            });
        });

        describe('Else operator', function () {
            it('should pass on left value if not null', function () {
                var test1 = [new Value(22), new Else(), new Value(11)];
                var test2 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Value(2), new MoreThan(), new Value(1), new Else(), new Value(4)];

                expect(getResultValueForArray(test1)).toBe(22);
                expect(getResultValueForArray(test2)).toBe(7);
            });

            it('should give new value if left token is null', function () {
                var test1 = [new Else(), new Value(11)];
                var test2 = [new Value(1), new Sum(), new Value(2), new Multiply, new Value(3), new If(), new Value(1), new MoreThan(), new Value(2), new Else(), new Value(4)];

                expect(getResultValueForArray(test1)).toBe(11);
                expect(getResultValueForArray(test2)).toBe(4);
            });
        });
    });
})();