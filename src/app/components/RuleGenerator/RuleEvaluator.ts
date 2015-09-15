/// <reference path="Token.ts" />

module ruleCompiler {
    'use strict';

    export class Sum extends Operator {
        constructor() {
            super();
            this.setPriority(100);
        }

        operate():Value {
            super.operate();
            var sum:number = 0;
            this.children.forEach(v => {
                if ((v instanceof Value)) {
                    sum += (<Value> v).value;
                } else {
                    throw new Error('Pluss kan kun ha verdier som parametere.');
                }
            });
            return new Value(sum);
        }
    }

    export class Multiply extends Operator {
        constructor() {
            super();
            this.setPriority(200);
        }

        operate():Value {
            super.operate();
            var product:number = 1;
            this.children.forEach(v => {
                if ((v instanceof Value)) {
                    product *= (<Value> v).value;
                } else {
                    throw new Error('Gange kan kun ha verdier som parametere.');
                }
            });
            return new Value(product);
        }
    }

    export class LessThan extends Operator {
        constructor() {
            super();
            this.setPriority(30);
        }

        operate():Rule {
            super.operate();
            if (!this.children[0] || !this.children[1]) {
                throw new Error('"Less than" operator should have parameters on each side');
            }
            if (this.children[0] instanceof Value && this.children[1] instanceof Value) {
                var bool:boolean = (<Value> this.children[0]).value < (<Value> this.children[1]).value;
                return new Rule(bool);
            }
            return null;
        }
    }

    export class MoreThan extends Operator {
        constructor() {
            super();
            this.setPriority(30);
        }

        operate():Rule {
            super.operate();
            if (!this.children[0] || !this.children[1]) {
                throw new Error('"More than" operator should have parameters on each side');
            }
            if (this.children[0] instanceof Value && this.children[1] instanceof Value) {
                var bool:boolean = (<Value> this.children[0]).value > (<Value> this.children[1]).value;
                return new Rule(bool);
            }
            return null;
        }
    }

    export class Equal extends Operator {
        constructor() {
            super();
            this.setPriority(30);
        }

        operate():Rule {
            super.operate();
            if (!this.children[0] || !this.children[1]) {
                throw new Error('"Equal" operator should have parameters on each side');
            }
            if (this.children[0] instanceof Value && this.children[1] instanceof Value) {
                var bool:boolean = (<Value> this.children[0]).value === (<Value> this.children[1]).value;
                return new Rule(bool);
            }
            return null;
        }
    }

    export class And extends Operator {
        constructor() {
            super();
            this.setPriority(20);
        }

        operate():Rule {
            super.operate();
            if (!this.children[0] || !this.children[1]) {
                throw new Error('"Equal" operator should have parameters on each side');
            }
            if (this.children[0] instanceof Rule && this.children[1] instanceof Rule) {
                var bool:boolean = (<Rule> this.children[0]).value && (<Rule> this.children[1]).value;
                return new Rule(bool);
            }
            return null;
        }
    }

    export class If extends Operator {
        constructor() {
            super();
            this.setPriority(10);
        }
        operate():Token {
            super.operate();
            if (!this.children[0] || !this.children[1]) {
                throw new Error('"If" operator should have parameters on each side');
            }
            if (this.children[1] instanceof Rule) {
                var boolExpr = (<Rule> this.children[1]).value;
                if (boolExpr) {
                    return this.children[0];
                }
                return null;
            }
        }
    }

    export class Else extends Operator {
        operate():Token {
            super.operate();
            if (this.children.length > 1 && !this.children[0] && this.children[1]) {
                return this.children[1];
            }
            return this.children[0];
        }
    }

    export class RuleEvaluator {
        public parse(tokens:Token[]):Primitive {
            var root:Token = Token.buildTreeAndGetRoot(tokens);
            return <Primitive> root.operate();
        }
    }
}
