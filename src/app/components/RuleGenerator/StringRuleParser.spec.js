(function () {
    'use strict';
    var rc = ruleCompiler;
    var Value = rc.Value;
    var Sum = rc.Sum;


    describe('StringRuleParser', function () {
        it('should parse 5 + 6', function () {
            var str = '5 + 6';
            var parser = new rc.StringRuleParser();
            var tokens = parser.parse(str);

            expect(tokens[0].value).toBe(5);
            expect(tokens[1] instanceof Sum).toBeTruthy();
            expect(tokens[2].value).toBe(6);
        });

        it('should parse 5 + 6 hvis 1 < 2', function () {
            var str = '5 + 6 hvis 1 < 2';
            var parser = new rc.StringRuleParser();
            var tokens = parser.parse(str);

            expect(tokens[0].value).toBe(5);
            expect(tokens[1] instanceof Sum).toBeTruthy();
            expect(tokens[2].value).toBe(6);
            expect(tokens[3] instanceof rc.If).toBeTruthy();
            expect(tokens[4].value).toBe(1);
            expect(tokens[5] instanceof rc.LessThan).toBeTruthy();
            expect(tokens[6].value).toBe(2);
        });

        it('should add field', function () {
            var str = '5 + 9 + p212';
            var parser = new rc.StringRuleParser();
            parser.wordMap = {'p212': 'value'};
            var tokens = parser.parse(str);

            expect(tokens[0].value).toBe(5);
            expect(tokens[1] instanceof Sum).toBeTruthy();
            expect(tokens[2].value).toBe(9);
            expect(tokens[3] instanceof Sum).toBeTruthy();
            expect(tokens[4] instanceof Value).toBeTruthy();
        })
    })
})();