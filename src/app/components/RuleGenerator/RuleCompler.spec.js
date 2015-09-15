(function () {
    'use strict';
    var rc = ruleCompiler;
    var RuleEngine = ruleCompiler.RuleEngine;
    var Expression = rc.Expression;
    var Value = rc.Value;
    var Rule = rc.Rule;
    var Sum = rc.Sum;
    var Multiply = rc.Multiply;
    var If = rc.If;
    var Else = rc.Else;
    var Token = rc.Token;
    var LessThan = rc.LessThan;
    var MoreThan = rc.MoreThan;
    var Equal = rc.Equal;

    describe('RuleCompiler', function () {
        it('should resolve a simple value', function () {
            var ruleCompler = new RuleEngine();

            var expression = new Expression('test1', [new Value(5), new Sum(), new Value(null, 'testDep')]);

            var values = ruleCompler.resolveExpressionsIterative([expression], {'testDep': new Value(8)});

            expect(values['test1'].value).toBe(13);
        });

        it('should resolve a tree of dependencies', function () {
            var ruleCompler = new RuleEngine();

            var expression1 = new Expression('test1', [new Value(5), new Sum(), new Value(null, 'testDep')]);
            var expression2 = new Expression('test2', [new Value(2), new Sum(), new Value(null, 'test1')]);
            var expression3 = new Expression('test3', [new Value(null, 'test2'), new Sum(), new Value(null, 'test1')]);

            var values = ruleCompler.resolveExpressionsIterative([expression1, expression2, expression3], {'testDep': new Value(8)});

            expect(values['test1'].value).toBe(13);
            expect(values['test2'].value).toBe(15);
            expect(values['test3'].value).toBe(28);
        });

        it('should resolve a tree of rule strings of dependencies', function () {
            var ruleCompler = new RuleEngine();
            var wordMap = {
                'testDep': 'value',
                'test1': 'value',
                'test2': 'value',
                'test3': 'value'
            };

            var rules = {};
            rules['test1'] = '5 + testDep';
            rules['test2'] = '2 + test1';
            rules['test3'] = 'test2 + test1';

            var values = ruleCompler.resolveRuleStrings(rules, {'testDep': new Value(8)}, wordMap);

            expect(values['test1'].value).toBe(13);
            expect(values['test2'].value).toBe(15);
            expect(values['test3'].value).toBe(28);
        });

        it('should resolve a tree of rule strings of dependencies', function () {
            var ruleCompler = new RuleEngine();
            var wordMap = {
                'testDep': 'value',
                'test1': 'value',
                'test2': 'value',
                'test3': 'value'
            };

            var rules = {
                'test1': '5 + testDep',
                'test2': '2 + test1',
                'test3': 'test2 + test1'
            };

            var values = ruleCompler.resolveRuleStrings(rules, {'testDep': new Value(8)}, wordMap);

            expect(values['test1'].value).toBe(13);
            expect(values['test2'].value).toBe(15);
            expect(values['test3'].value).toBe(28);
        });

        it('should solve the PT rules', function () {
            var ruleCompler = new RuleEngine();
            var wordMap = {
                'berettiget_husdyrhold': 'rule',
                'har_p121_og_ikke_120': 'rule',
                'har_p120_og_p118': 'rule',
                'antall_dyr': 'value',
                'p118_tilskudd': 'value',
                'tilskudd_husdyrhold': 'value',
                'p121': 'value',
                'p120': 'value',
                'p118': 'value'
            };

            var valueMap = {
                'berettiget_husdyrhold': new Rule(true),
                'p121': new Value(5),
                'p120': new Value(0),
                'p118': new Value(2)
            };

            var rules = {
                'har_p121_og_ikke_120': 'p121 > 0 og p120 = 0',
                'bla': 'p213 + p123 + p118*3',
                'har_p120_og_118': 'p120 > 0 og p118 > 0',
                'antall_dyr': 'p118 + p120 + p121',
                'p118_tilskudd': 'p118 * 2874',
                'tilskudd_husdyrhold': '115000 hvis har_p121_og_ikke_120 ellers p118_tilskudd'
            };

            var values = ruleCompler.resolveRuleStrings(rules, valueMap, wordMap);

            expect(values['berettiget_husdyrhold'].value).toBeTruthy();
            expect(values['har_p121_og_ikke_120'].value).toBeTruthy();
            expect(values['har_p120_og_118'].value).toBeFalsy();
            expect(values['antall_dyr'].value).toBe(7);
            expect(values['p118_tilskudd'].value).toBe(5748);
            expect(values['tilskudd_husdyrhold'].value).toBe(115000);

        });
    });

})();
