/// <reference path="Token.ts" />

module ruleCompiler {
    'use strict';
    export class Expression {
        name: string;
        expression: Token[];

        constructor(name:string, expression: Token[]) {
            this.name = name;
            this.expression = expression;
        }
    }
}