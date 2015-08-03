/// <reference path="Token.ts" />

module ruleCompiler {
    //interface stringToOperatorMap {
    //    [name: RegExp]: Operator;
    //}

    //var operatorMap = [
    //    {
    //        key: /\d+/,
    //        token: Value
    //    },
    //    {
    //        key: /</,
    //        token: LessThan
    //    },
    //    {
    //        key: />/,
    //        token: MoreThan
    //    },
    //    {
    //        key: /=/,
    //        token: Equal
    //    },
    //    {
    //        key: /hvis/,
    //        token: If
    //    },
    //    {
    //        key: /ellers/,
    //        token: Else
    //    },
    //];

    export class StringRuleParser {
        private _wordMap: {[key: string]: string};

        operatorMap = {
            '+': Sum,
            '<': LessThan,
            '>': MoreThan,
            '=': Equal,
            'hvis': If,
            'ellers': Else
        };

        set wordMap(map: {[key: string]: string}) {
            this._wordMap = map;
        }

        get wordMap() {
            return this._wordMap
        }

        parse(ruleStr:string):Token[] {
            var parsed: Token[] = [];
            var strTokens = ruleStr.split(' ');

            for (var i=0; i<strTokens.length; i++) {
                var word = strTokens[i];
                if(this.operatorMap[word]) {
                    parsed.push(new this.operatorMap[word])
                } else if (!isNaN(<any>word)) {
                    parsed.push(new Value(parseFloat(<any>word)));
                } else if (this.wordMap[word]) {
                    var val =  (this.wordMap[word] === 'value') ? new Value() : new Rule();
                    val.key = word;
                    parsed.push(val);
                }
            }
            return parsed;
        }
    }

}