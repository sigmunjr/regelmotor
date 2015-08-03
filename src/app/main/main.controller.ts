/// <reference path="../components/RuleGenerator/RuleCompiler" />


module ruleCompiler {
    'use strict';

    export class MainController {
        public awesomeThings:ITecThing[];
        public webDevTec:WebDevTecService;
        public classAnimation:string;
        public searchText:string;
        public tokenList:any[];



        /* @ngInject */
        constructor($scope:any, $timeout:ng.ITimeoutService, webDevTec:WebDevTecService, toastr:Toastr) {
            this.awesomeThings = new Array();
            this.classAnimation = '';
            this.tokenList = [];

        }

        searchTextChange(txt) {
            console.log('Change ' + this.searchText);
            var result = ['hvis', '<', '>', '=', '+'];
        }

        validOperators(searchText:string) {
            var result = [
                {name: 'hvis'},
                {name: 'ellers'},
                {name: '<'},
                {name: '>'},
                {name: '='},
                {name: '+'},

            ];
            var values = [];
            if (!isNaN(<any> searchText)) {
                values = [
                    {name: '0'},
                    {name: '1'},
                    {name: '2'},
                    {name: '3'},
                    {name: '4'},
                    {name: '5'},
                    {name: '6'},
                    {name: '7'},
                    {name: '8'},
                    {name: '9'}
                ];
                if (searchText) {
                    values = values.map(v => {
                        return {name: searchText + v.name};
                    });
                    values.unshift({name: searchText})
                }
            }
            var filteredResult = result.filter(s => {
                return s.name.indexOf(searchText) != -1;
            });
            return filteredResult.concat(values);
        }

        onItemSelect(item):any {
            this.searchText = item.name;
            console.log('Selected ' +  item + ' : ' + this.searchText);
            return item
        }

        append(chip) {
            console.log(this.searchText);
            this.searchText = '';
            if (chip && chip.name) {
                var newChip = {title: chip.name, id: chip.name + this.tokenList.length};
                return newChip;
            }
        }
    }
}
