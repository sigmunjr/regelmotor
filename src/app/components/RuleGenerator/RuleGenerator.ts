module ruleGenerator {
    'use strict';

    export class TokenIterator {
        current:Token;

        constructor(token:Token) {
            this.current = token;
        }

        hasNext():boolean {
            return this.current != null;
        }

        next():Token {
            var returnVal = this.current;
            this.current = this.current.next;
            return returnVal;
        }
    }

    export class Token {
        next:Token;
        prev:Token;

        constructor(prev?:Token, next?:Token) {
            this.next = next;
            this.prev = prev;
            if (prev) {
                prev.next = this;
            }
            if (next) {
                next.prev = this;
            }
        }

        static arrayToLinkedList(array:Token[]):Token {
            var root:Token = array[0];
            var cur = root;
            for (var i = 1; i < array.length; i++) {
                cur.next = array[i];
                array[i].prev = cur;
                cur = array[i];
            }
            return root;
        }

        findFirst():Token {
            var first:Token = this;
            while (first.prev != null) {
                first = first.prev;
            }
            return first;
        }

        findLast():Token {
            var last:Token = this;
            while (last.next != null) {
                last = last.next;
            }
            return last;
        }

        chain():TokenIterator {
            return new TokenIterator(this);
        }
    }

    export class Value extends Token {
        value:number;

        constructor(value:number, prev?:Token, next?:Token) {
            this.value = value;
            super(prev, next);
        }
    }

    export class Rule extends Token {
        value:boolean;

        constructor(value:boolean, prev?:Token, next?:Token) {
            this.value = value;
            super(prev, next);
        }
    }

    export class Operator extends Token {
        private priority:number = 0;

        operate():Token {
            return null;
        }

        getPriority():number {
            return this.priority;
        }

        setPriority(pri:number) {
            this.priority = pri;
        }

        delete() {
            this.prev = null;
            this.next = null;
        }
    }

    export class Sum extends Operator {
        constructor(prev:Token, next:Token) {
            super(prev, next);
            this.setPriority(100);
        }

        operate():Value {
            if (this.prev instanceof Value && this.next instanceof Value) {
                var sum:number = (<Value> this.prev).value + (<Value> this.next).value;
                return new Value(sum, this.prev.prev, this.next.next);
            }
            return null;
        }
    }

    export class Multiply extends Operator {
        constructor(prev:Token, next:Token) {
            super(prev, next);
            this.setPriority(200);
        }

        operate():Value {
            if (this.prev instanceof Value && this.next instanceof Value) {
                var prod:number = (<Value> this.prev).value * (<Value> this.next).value;
                return new Value(prod, this.prev.prev, this.next.next);
            }
            return null;
        }
    }

    export class LessThan extends Operator {
        constructor(prev:Token, next:Token) {
            super(prev, next);
            this.setPriority(20);
        }

        operate():Rule {
            if (this.prev instanceof Value && this.next instanceof Value) {
                var bool:boolean = (<Value> this.prev).value < (<Value> this.next).value;
                return new Rule(bool, this.prev.prev, this.next.next);
            }
            return null;
        }
    }

    export class MoreThan extends Operator {
        constructor(prev:Token, next:Token) {
            super(prev, next);
            this.setPriority(20);
        }

        operate():Rule {
            if (this.prev instanceof Value && this.next instanceof Value) {
                var bool:boolean = (<Value> this.prev).value > (<Value> this.next).value;
                return new Rule(bool, this.prev.prev, this.next.next);
            }
            return null;
        }
    }

    export class Equal extends Operator {
        constructor(prev:Token, next:Token) {
            super(prev, next);
            this.setPriority(20);
        }

        operate():Rule {
            if (this.prev instanceof Value && this.next instanceof Value) {
                var bool:boolean = (<Value> this.prev).value == (<Value> this.next).value;
                return new Rule(bool, this.prev.prev, this.next.next);
            }
            return null;
        }
    }

    export class If extends Operator {
        operate():Token {
            if (this.prev && this.next && this.next instanceof Rule) {
                var boolExpr = (<Rule> this.next).value;
                if (boolExpr) {
                    this.prev.next = null;
                    return this.prev;
                } else {
                    var remaining = this.next.next;
                    if (remaining) {
                        remaining.prev = null;
                        return remaining;
                    }
                    return null;
                }
            }
        }
    }

    export class Else extends Operator {
        operate():Token {
            if (this.prev) {
                this.prev.next = null;
                return this.prev;
            } else {
                var next = this.next;
                next.prev = null;
                this.next = null;
                return next;
            }
        }
    }

    export class RuleGenerator {
        public parse(firstToken:Token):Token {
            if (firstToken == null || firstToken.next == null) {
                return firstToken;
            }

            var highestPriorityOperator:Operator;
            var highestPriority = -1;
            var it = firstToken.chain();
            while (it.hasNext()) {
                var token = it.next();
                if (token instanceof Operator) {
                    var op = <Operator> token;
                    if (op.getPriority() > highestPriority) {
                        highestPriority = op.getPriority();
                        highestPriorityOperator = op;
                    }
                }
            }

            if (highestPriorityOperator) {
                var expr = highestPriorityOperator.operate();
                if (!expr || !expr.prev) {
                    firstToken = expr;
                }
            } else {
                throw new Error('No operator in token stream');
            }

            return this.parse(firstToken);
        }
    }

    export class StringRuleParser {

    }
}
