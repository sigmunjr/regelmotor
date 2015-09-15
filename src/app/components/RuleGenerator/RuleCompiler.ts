/// <reference path="Token.ts" />
/// <reference path="RuleEvaluator.ts" />
/// <reference path="Expression.ts" />
/// <reference path="ValueResolver.ts" />

module ruleCompiler {
    'use strict';

    export class RuleEngine {
        resolveRuleStrings(strExpressions: {[key: string]: string}, valueMap:{[key: string]: Primitive}, wordMap: {[key: string]: string}): {[key: string]: Primitive} {
            var stringParser = new StringRuleParser();
            stringParser.wordMap = wordMap;

            var expressions:Expression[] = [];
            for (var key in strExpressions) {
                expressions.push(new Expression(key, stringParser.parse(strExpressions[key])));
            }
            return this.resolveExpressionsIterative(expressions, valueMap);
        }

        resolveExpressionsIterative(expressions:Expression[], valueMap:{[key: string]: Primitive}):{[key: string]: Primitive} {
            var valueResolver = new ValueResolver();
            var ruleEvaluator = new RuleEvaluator();
            var resolvableExpressions = [];
            do {
                resolvableExpressions = valueResolver.resolvableExpressions(expressions, valueMap);
                resolvableExpressions.forEach(exp => {
                   if (!valueMap[exp.name]) {
                       valueMap[exp.name] = ruleEvaluator.parse(exp.expression);
                       expressions = expressions.filter(function(e) {
                           return e !== exp;
                       });
                   }
                });
            } while (resolvableExpressions.length);

            return valueMap;
        }
    }


}