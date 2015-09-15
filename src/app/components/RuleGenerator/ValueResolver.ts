/// <reference path="Token.ts" />
/// <reference path="Expression.ts" />

module ruleCompiler {
    'use strict';

    export class ValueResolver {
        resolvableExpressions(expressions:Expression[], valueMap:{[key: string]: Primitive}):Expression[] {
            var resolvableExpressions = [];
            expressions.forEach(exp => {
                var haveUnresolvedValue = false;
                exp.expression.forEach(token => {
                    if (token instanceof Primitive && (<Primitive> token).isField) {
                        var prim:Primitive = token;
                        if (valueMap[prim.key]) {
                            prim.value = valueMap[prim.key].value;
                        } else {
                            haveUnresolvedValue = true;
                        }
                    }
                });
                if (!haveUnresolvedValue) {
                    resolvableExpressions.push(exp);
                }
            });
            return resolvableExpressions;
        }
    }
}
