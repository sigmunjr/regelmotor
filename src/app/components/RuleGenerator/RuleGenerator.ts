module ruleGenerator {
    'use strict';

    export class Token {
        children:Token[] = [];

        static buildTreeAndGetRoot(list:Token[]) {
            var rootNode:Token = Token.findLowestPriority(list);
            return rootNode.buildTree(list, list.indexOf(rootNode));
        }

        static findLowestPriority(list:Token[]):Operator {
            var lowest:Operator;
            for (var i = 0; i < list.length; i++) {
                var token = list[i];
                if ((token instanceof Operator) && (!lowest || lowest.getPriority() > (<Operator> token).getPriority())) {
                    lowest = <Operator> token;
                }

            }
            return lowest;
        }

        buildTree(list:Token[], index:number) {
            var firstList:Token[] = list.slice(0, index);
            var secondList:Token[] = list.slice(index + 1, list.length);

            this.pushToChildrenIfExist(firstList);
            this.pushToChildrenIfExist(secondList);
            return this;
        }

        pushToChildrenIfExist(list:Token[]) {
            if (list.length == 1) {
                this.children.push(list[0]);
            } else if (list.length) {
                this.children.push(this.listToChild(list));
            }
        }

        listToChild(list:Token[]):Token {
            var newNode:Operator = Token.findLowestPriority(list);
            if (!newNode) {
                throw new Error("No operator in list");
            }
            return newNode.buildTree(list, list.indexOf(newNode));
        }

        operate():Token {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i] = this.children[i].operate();
            }
            return this;
        }
    }

    export class Primitive extends Token {
        value:any;
    }

    export class Value extends Primitive {
        value:number;

        constructor(value:number) {
            this.value = value;
            super();
        }
    }

    export class Rule extends Primitive {
        value:boolean;

        constructor(value:boolean) {
            this.value = value;
            super();
        }
    }

    export class Operator extends Token {
        private priority:number = 0;

        getPriority():number {
            return this.priority;
        }

        setPriority(pri:number) {
            this.priority = pri;
        }
    }

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
            this.setPriority(20);
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
            this.setPriority(20);
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
            this.setPriority(20);
        }

        operate():Rule {
            super.operate();
            if (!this.children[0] || !this.children[1]) {
                throw new Error('"Equal" operator should have parameters on each side');
            }
            if (this.children[0] instanceof Value && this.children[1] instanceof Value) {
                var bool:boolean = (<Value> this.children[0]).value == (<Value> this.children[1]).value;
                return new Rule(bool);
            }
            return null;
        }
    }

    export class If extends Operator {
        constructor() {
            super();
            this.setPriority(20);
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

    export class RuleGenerator {
        public parse(tokens:Token[]):Primitive {
            var root:Token = Token.buildTreeAndGetRoot(tokens);
            return <Primitive> root.operate();
        }
    }

    export class StringRuleParser {

    }
}

