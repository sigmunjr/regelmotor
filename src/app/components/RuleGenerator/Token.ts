module ruleCompiler {
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

    export class Operator extends Token {
        private priority:number = 0;

        getPriority():number {
            return this.priority;
        }

        setPriority(pri:number) {
            this.priority = pri;
        }
    }

    export class Primitive extends Token {
        private _value:any;
        private _isField:boolean;
        private _key:string;

        constructor(name?:string) {
            super();
            if (name) this.key = name;
        }

        get value():any {
            return this._value;
        }

        set value(value:any) {
            if (!!value) {
                this._isField = false;
            }
            this._value = value;
        }

        get isField():boolean {
            return this._isField;
        }

        set key(key:string) {
            this._isField = true;
            this._key = key
        }

        get key() {
            return this._key
        }
    }

    export class Value extends Primitive {
        value:number;

        constructor(value?:number, name?:string) {
            super(name);
            this.value = value;
        }
    }

    export class Rule extends Primitive {
        value:boolean;

        constructor(value?:boolean, name?:string) {
            super(name);
            this.value = value;
        }
    }
}