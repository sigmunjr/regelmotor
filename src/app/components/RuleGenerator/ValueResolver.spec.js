(function () {
    'use strict';
    var rc = ruleCompiler;
    var ValueResolver = rc.ValueResolver;
    var Expression = rc.Expression;
    var Value = rc.Value;
    var Sum = rc.Sum;

    describe('ValueResolver', function () {
        var valueResolver = new ValueResolver();
        it('should return expressions with no dependencies unchanged', function () {
            var rawExpr = [new Value(5), new Sum(), new Value(8)];
            var expression = new Expression('test1', rawExpr);
            var returnExpr = valueResolver.resolvableExpressions([expression], {});

            expect(expression).toBe(returnExpr[0]);
        });

        it('should resolve expressions with dependencies to values exstent in the supplied valueMap', function () {
            var dependency = new Value();
            dependency.key = 'testDep';
            var rawExpr = [new Value(5), new Sum(), dependency];
            var expression = new Expression('test1', rawExpr);

            var returnExpr = valueResolver.resolvableExpressions([expression], {'testDep': new Value(8)});
            expect(expression).toBe(returnExpr[0]);
            expect(!returnExpr[0].expression[2].isField && !!returnExpr[0].expression[2].value).toBeTruthy();
        });
    });

})();
