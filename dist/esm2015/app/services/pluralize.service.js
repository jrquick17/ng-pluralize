import { Injectable } from '@angular/core';
import { NgPluralizeUncountable } from '../vars/ng-pluralize-uncountable.var';
import { NgPluralizeSingularizationRules } from '../vars/ng-pluralize-singularization-rules.var';
import { NgPluralizePluralizationRules } from '../vars/ng-pluralize-pluralization-rules.var';
import { NgPluralizeIrregularRules } from "../vars/ng-pluralize-irregular-rules.var";
export class PluralizeService {
    constructor() {
        this.pluralRules = [];
        this.singularRules = [];
        this.uncountables = {};
        this.irregularPlurals = {};
        this.irregularSingles = {};
        this.restoreCaseExceptions = [];
        /**
         * Pluralize a word.
         *
         * @type {Function}
         */
        this.plural = this.replaceWord(this.irregularSingles, this.irregularPlurals, this.pluralRules);
        /**
         * Check if a word is pluralize.
         *
         * @type {Function}
         */
        this.isPlural = this.checkWord(this.irregularSingles, this.irregularPlurals, this.pluralRules);
        /**
         * Singularize a word.
         *
         * @type {Function}
         */
        this.singular = this.replaceWord(this.irregularPlurals, this.irregularSingles, this.singularRules);
        /**
         * Check if a word is singularize.
         *
         * @type {Function}
         */
        this.isSingular = this.checkWord(this.irregularPlurals, this.irregularSingles, this.singularRules);
        this._loadRules();
    }
    /**
     * Sanitize a pluralization rule to a usable regular expression.
     *
     * @param  {(RegExp|string)} rule
     * @return {RegExp}
     */
    sanitizeRule(rule) {
        if (typeof rule === 'string') {
            return new RegExp('^' + rule + '$', 'i');
        }
        return rule;
    }
    /**
     * Pass in a word token to produce a function that can replicate the case on
     * another word.
     *
     * @param  {string}   word
     * @param  {string}   token
     * @return {Function}
     */
    restoreCase(word, token) {
        // Do not restore the case of specified tokens
        if (this.restoreCaseExceptions.indexOf(token) !== -1) {
            return token;
        }
        // Tokens are an exact match.
        if (word === token)
            return token;
        // Lower cased words. E.g. "hello".
        if (word === word.toLowerCase())
            return token.toLowerCase();
        // Upper cased words. E.g. "WHISKY".
        if (word === word.toUpperCase())
            return token.toUpperCase();
        // Title cased words. E.g. "Title".
        if (word[0] === word[0].toUpperCase()) {
            return token.charAt(0).toUpperCase() + token.substr(1).toLowerCase();
        }
        // Lower cased words. E.g. "test".
        return token.toLowerCase();
    }
    /**
     * Interpolate a regexp string.
     *
     * @param  {string} str
     * @param  {Array}  args
     * @return {string}
     */
    interpolate(str, args) {
        return str.replace(/\$(\d{1,2})/g, (match, index) => {
            return args[index] || '';
        });
    }
    /**
     * Replace a word using a rule.
     *
     * @param  {string} word
     * @param  {Array}  rule
     * @return {string}
     */
    replace(word, rule) {
        return word.replace(rule[0], function (match, index) {
            var result = this.interpolate(rule[1], arguments);
            if (match === '') {
                return this.restoreCase(word[index - 1], result);
            }
            return this.restoreCase(match, result);
        }.bind(this));
    }
    /**
     * Sanitize a word by passing in the word and sanitization rules.
     *
     * @param  {string}   token
     * @param  {string}   word
     * @param  {Array}    rules
     * @return {string}
     */
    sanitizeWord(token, word, rules) {
        // Empty string or doesn't need fixing.
        if (!token.length || this.uncountables.hasOwnProperty(token)) {
            return word;
        }
        var len = rules.length;
        // Iterate over the sanitization rules and use the first one to match.
        while (len--) {
            var rule = rules[len];
            if (rule[0].test(word))
                return this.replace(word, rule);
        }
        return word;
    }
    /**
     * Replace a word with the updated word.
     *
     * @param  {Object}   replaceMap
     * @param  {Object}   keepMap
     * @param  {Array}    rules
     * @return {Function}
     */
    replaceWord(replaceMap, keepMap, rules) {
        return (word) => {
            // Get the correct token and case restoration functions.
            const token = word.toLowerCase();
            // Check against the keep object map.
            if (keepMap.hasOwnProperty(token)) {
                return this.restoreCase(word, token);
            }
            // Check against the replacement map for a direct word replacement.
            if (replaceMap.hasOwnProperty(token)) {
                return this.restoreCase(word, replaceMap[token]);
            }
            // Run all the rules against the word.
            return this.sanitizeWord(token, word, rules);
        };
    }
    /**
     * Check if a word is part of the map.
     */
    checkWord(replaceMap, keepMap, rules) {
        return (word) => {
            const token = word.toLowerCase();
            if (keepMap.hasOwnProperty(token)) {
                return true;
            }
            if (replaceMap.hasOwnProperty(token)) {
                return false;
            }
            return this.sanitizeWord(token, token, rules) === token;
        };
    }
    /**
     * Pluralize or singularize a word based on the passed in count.
     *
     * @param  {string}  word      The word to fromCount
     * @param  {number}  count     How many of the word exist
     * @param  {boolean} inclusive Whether to prefix with the number (e.g. 3 ducks)
     * @return {string}
     */
    pluralize(word, count, inclusive) {
        var pluralized = count === 1
            ? this.singularize(word) : this.pluralize(word);
        return (inclusive ? count + ' ' : '') + pluralized;
    }
    /**
     * Add a pluralization rule to the collection.
     *
     * @param {(string|RegExp)} rule
     * @param {string}          replacement
     */
    addPluralRule(rule, replacement) {
        this.pluralRules.push([this.sanitizeRule(rule), replacement]);
    }
    ;
    /**
     * Add an exception to restoreCase.
     *
     * @param {string} exception
     */
    addRestoreCaseException(exception) {
        this.restoreCaseExceptions.push(exception);
    }
    ;
    /**
     * Add a singularization rule to the collection.
     *
     * @param {(string|RegExp)} rule
     * @param {string}          replacement
     */
    addSingularRule(rule, replacement) {
        this.singularRules.push([this.sanitizeRule(rule), replacement]);
    }
    ;
    /**
     * Add an uncountable word rule.
     *
     * @param {(string|RegExp)} word
     */
    addUncountableRule(word) {
        if (typeof word === 'string') {
            this.uncountables[word.toLowerCase()] = true;
            return;
        }
        // Set singularize and pluralize references for the word.
        this.addPluralRule(word, '$0');
        this.addSingularRule(word, '$0');
    }
    ;
    /**
     * Add an irregular word definition.
     *
     * @param {string} single
     * @param {string} plural
     */
    addIrregularRule(single, plural) {
        plural = plural.toLowerCase();
        single = single.toLowerCase();
        this.irregularSingles[single] = plural;
        this.irregularPlurals[plural] = single;
    }
    ;
    _loadRules() {
        NgPluralizeIrregularRules.forEach((rule) => {
            return this.addIrregularRule(rule[0], rule[1]);
        });
        NgPluralizeSingularizationRules.forEach((rule) => {
            return this.addSingularRule(rule[0], rule[1]);
        });
        NgPluralizePluralizationRules.forEach((rule) => {
            return this.addPluralRule(rule[0], rule[1]);
        });
        /**
         * Uncountable rules.
         */
        NgPluralizeUncountable.forEach((rule) => {
            this.addUncountableRule(rule);
        });
    }
}
PluralizeService.decorators = [
    { type: Injectable }
];
PluralizeService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1cmFsaXplLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2pycXVpY2svZGV2ZWxvcG1lbnQvZW5jb3VudGluZy9uZy1wbHVyYWxpemUvc3JjLyIsInNvdXJjZXMiOlsiYXBwL3NlcnZpY2VzL3BsdXJhbGl6ZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDNUUsT0FBTyxFQUFDLCtCQUErQixFQUFDLE1BQU0sZ0RBQWdELENBQUM7QUFDL0YsT0FBTyxFQUFDLDZCQUE2QixFQUFDLE1BQU0sOENBQThDLENBQUM7QUFDM0YsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFHbkYsTUFBTSxPQUFPLGdCQUFnQjtJQVEzQjtRQVBRLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLGtCQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ25CLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLHFCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUN0QixxQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDdEIsMEJBQXFCLEdBQUcsRUFBRSxDQUFDO1FBa0xuQzs7OztXQUlHO1FBQ0ksV0FBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFakc7Ozs7V0FJRztRQUNJLGFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRWpHOzs7O1dBSUc7UUFDSSxhQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVyRzs7OztXQUlHO1FBQ0ksZUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUF6TW5HLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxZQUFZLENBQUMsSUFBa0I7UUFDN0IsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDNUIsT0FBTyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUMxQztRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxXQUFXLENBQUMsSUFBVyxFQUFFLEtBQVk7UUFDbkMsOENBQThDO1FBQzlDLElBQUksSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNwRCxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsNkJBQTZCO1FBQzdCLElBQUksSUFBSSxLQUFLLEtBQUs7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUVqQyxtQ0FBbUM7UUFDbkMsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUFFLE9BQU8sS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRTVELG9DQUFvQztRQUNwQyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQUUsT0FBTyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFNUQsbUNBQW1DO1FBQ25DLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUNyQyxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUN0RTtRQUVELGtDQUFrQztRQUNsQyxPQUFPLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsV0FBVyxDQUFDLEdBQVUsRUFBRSxJQUFRO1FBQzlCLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FDaEIsY0FBYyxFQUNkLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ2YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILE9BQU8sQ0FBQyxJQUFXLEVBQUUsSUFBUTtRQUMzQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQ2pCLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDUCxVQUFTLEtBQUssRUFBRSxLQUFLO1lBQ25CLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRWxELElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtnQkFDaEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDbEQ7WUFFRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ2IsQ0FBQztJQUNKLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsWUFBWSxDQUFDLEtBQVksRUFBRSxJQUFXLEVBQUUsS0FBUztRQUMvQyx1Q0FBdUM7UUFDdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDNUQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFFdkIsc0VBQXNFO1FBQ3RFLE9BQU8sR0FBRyxFQUFFLEVBQUU7WUFDWixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFdEIsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pEO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILFdBQVcsQ0FBQyxVQUFjLEVBQUUsT0FBVyxFQUFFLEtBQVM7UUFDaEQsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ2Qsd0RBQXdEO1lBQ3hELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUVqQyxxQ0FBcUM7WUFDckMsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNqQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3RDO1lBRUQsbUVBQW1FO1lBQ25FLElBQUksVUFBVSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDcEMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUNsRDtZQUVELHNDQUFzQztZQUN0QyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLENBQUMsVUFBYyxFQUFFLE9BQVcsRUFBRSxLQUFTO1FBQzlDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNkLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUVqQyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2pDLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxJQUFJLFVBQVUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3BDLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7WUFFRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxLQUFLLENBQUM7UUFDMUQsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxTQUFTLENBQUMsSUFBVyxFQUFFLEtBQVksRUFBRSxTQUFpQjtRQUNwRCxJQUFJLFVBQVUsR0FBRyxLQUFLLEtBQUssQ0FBQztZQUMxQixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUM7SUFDckQsQ0FBQztJQThCRDs7Ozs7T0FLRztJQUNJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsV0FBVztRQUNwQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBQUEsQ0FBQztJQUVGOzs7O09BSUc7SUFFSCx1QkFBdUIsQ0FBQyxTQUFTO1FBQy9CLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUFBLENBQUM7SUFFRjs7Ozs7T0FLRztJQUNILGVBQWUsQ0FBQyxJQUFJLEVBQUUsV0FBVztRQUMvQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBQUEsQ0FBQztJQUVGOzs7O09BSUc7SUFDSCxrQkFBa0IsQ0FBQyxJQUFJO1FBQ3JCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1lBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzdDLE9BQU87U0FDUjtRQUVELG1EQUFtRDtRQUNuRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBQUEsQ0FBQztJQUVGOzs7OztPQUtHO0lBQ0gsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU07UUFDN0IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM5QixNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRTlCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDdkMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUN6QyxDQUFDO0lBQUEsQ0FBQztJQUVNLFVBQVU7UUFDaEIseUJBQXlCLENBQUMsT0FBTyxDQUMvQixDQUFDLElBQUksRUFBRSxFQUFFO1lBQ1AsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FDRixDQUFDO1FBRUYsK0JBQStCLENBQUMsT0FBTyxDQUNyQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ1AsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQ0YsQ0FBQztRQUVGLDZCQUE2QixDQUFDLE9BQU8sQ0FDbkMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNQLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUNGLENBQUM7UUFFRjs7V0FFRztRQUNILHNCQUFzQixDQUFDLE9BQU8sQ0FDNUIsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNQLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7OztZQTVTRixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtOZ1BsdXJhbGl6ZVVuY291bnRhYmxlfSBmcm9tICcuLi92YXJzL25nLXBsdXJhbGl6ZS11bmNvdW50YWJsZS52YXInO1xuaW1wb3J0IHtOZ1BsdXJhbGl6ZVNpbmd1bGFyaXphdGlvblJ1bGVzfSBmcm9tICcuLi92YXJzL25nLXBsdXJhbGl6ZS1zaW5ndWxhcml6YXRpb24tcnVsZXMudmFyJztcbmltcG9ydCB7TmdQbHVyYWxpemVQbHVyYWxpemF0aW9uUnVsZXN9IGZyb20gJy4uL3ZhcnMvbmctcGx1cmFsaXplLXBsdXJhbGl6YXRpb24tcnVsZXMudmFyJztcbmltcG9ydCB7TmdQbHVyYWxpemVJcnJlZ3VsYXJSdWxlc30gZnJvbSBcIi4uL3ZhcnMvbmctcGx1cmFsaXplLWlycmVndWxhci1ydWxlcy52YXJcIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBsdXJhbGl6ZVNlcnZpY2Uge1xuICBwcml2YXRlIHBsdXJhbFJ1bGVzID0gW107XG4gIHByaXZhdGUgc2luZ3VsYXJSdWxlcyA9IFtdO1xuICBwcml2YXRlIHVuY291bnRhYmxlcyA9IHt9O1xuICBwcml2YXRlIGlycmVndWxhclBsdXJhbHMgPSB7fTtcbiAgcHJpdmF0ZSBpcnJlZ3VsYXJTaW5nbGVzID0ge307XG4gIHByaXZhdGUgcmVzdG9yZUNhc2VFeGNlcHRpb25zID0gW107XG4gIFxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9sb2FkUnVsZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYW5pdGl6ZSBhIHBsdXJhbGl6YXRpb24gcnVsZSB0byBhIHVzYWJsZSByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAqXG4gICAqIEBwYXJhbSAgeyhSZWdFeHB8c3RyaW5nKX0gcnVsZVxuICAgKiBAcmV0dXJuIHtSZWdFeHB9XG4gICAqL1xuICBzYW5pdGl6ZVJ1bGUocnVsZTpzdHJpbmd8UmVnRXhwKTpSZWdFeHAge1xuICAgIGlmICh0eXBlb2YgcnVsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKCdeJyArIHJ1bGUgKyAnJCcsICdpJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICAvKipcbiAgICogUGFzcyBpbiBhIHdvcmQgdG9rZW4gdG8gcHJvZHVjZSBhIGZ1bmN0aW9uIHRoYXQgY2FuIHJlcGxpY2F0ZSB0aGUgY2FzZSBvblxuICAgKiBhbm90aGVyIHdvcmQuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICB3b3JkXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICB0b2tlblxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICovXG4gIHJlc3RvcmVDYXNlKHdvcmQ6c3RyaW5nLCB0b2tlbjpzdHJpbmcpOnN0cmluZyB7XG4gICAgLy8gRG8gbm90IHJlc3RvcmUgdGhlIGNhc2Ugb2Ygc3BlY2lmaWVkIHRva2Vuc1xuICAgIGlmICh0aGlzLnJlc3RvcmVDYXNlRXhjZXB0aW9ucy5pbmRleE9mKHRva2VuKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9XG5cbiAgICAvLyBUb2tlbnMgYXJlIGFuIGV4YWN0IG1hdGNoLlxuICAgIGlmICh3b3JkID09PSB0b2tlbikgcmV0dXJuIHRva2VuO1xuXG4gICAgLy8gTG93ZXIgY2FzZWQgd29yZHMuIEUuZy4gXCJoZWxsb1wiLlxuICAgIGlmICh3b3JkID09PSB3b3JkLnRvTG93ZXJDYXNlKCkpIHJldHVybiB0b2tlbi50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gVXBwZXIgY2FzZWQgd29yZHMuIEUuZy4gXCJXSElTS1lcIi5cbiAgICBpZiAod29yZCA9PT0gd29yZC50b1VwcGVyQ2FzZSgpKSByZXR1cm4gdG9rZW4udG9VcHBlckNhc2UoKTtcblxuICAgIC8vIFRpdGxlIGNhc2VkIHdvcmRzLiBFLmcuIFwiVGl0bGVcIi5cbiAgICBpZiAod29yZFswXSA9PT0gd29yZFswXS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICByZXR1cm4gdG9rZW4uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0b2tlbi5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICAvLyBMb3dlciBjYXNlZCB3b3Jkcy4gRS5nLiBcInRlc3RcIi5cbiAgICByZXR1cm4gdG9rZW4udG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcnBvbGF0ZSBhIHJlZ2V4cCBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gc3RyXG4gICAqIEBwYXJhbSAge0FycmF5fSAgYXJnc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBpbnRlcnBvbGF0ZShzdHI6c3RyaW5nLCBhcmdzOmFueSkge1xuICAgIHJldHVybiBzdHIucmVwbGFjZShcbiAgICAgIC9cXCQoXFxkezEsMn0pL2csXG4gICAgICAobWF0Y2gsIGluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiBhcmdzW2luZGV4XSB8fCAnJztcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYSB3b3JkIHVzaW5nIGEgcnVsZS5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSB3b3JkXG4gICAqIEBwYXJhbSAge0FycmF5fSAgcnVsZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICByZXBsYWNlKHdvcmQ6c3RyaW5nLCBydWxlOmFueSk6c3RyaW5nIHtcbiAgICByZXR1cm4gd29yZC5yZXBsYWNlKFxuICAgICAgcnVsZVswXSxcbiAgICAgIGZ1bmN0aW9uKG1hdGNoLCBpbmRleCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5pbnRlcnBvbGF0ZShydWxlWzFdLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIGlmIChtYXRjaCA9PT0gJycpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXN0b3JlQ2FzZSh3b3JkW2luZGV4IC0gMV0sIHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5yZXN0b3JlQ2FzZShtYXRjaCwgcmVzdWx0KTtcbiAgICAgIH0uYmluZCh0aGlzKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogU2FuaXRpemUgYSB3b3JkIGJ5IHBhc3NpbmcgaW4gdGhlIHdvcmQgYW5kIHNhbml0aXphdGlvbiBydWxlcy5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgIHRva2VuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICB3b3JkXG4gICAqIEBwYXJhbSAge0FycmF5fSAgICBydWxlc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzYW5pdGl6ZVdvcmQodG9rZW46c3RyaW5nLCB3b3JkOnN0cmluZywgcnVsZXM6YW55KTpzdHJpbmcge1xuICAgIC8vIEVtcHR5IHN0cmluZyBvciBkb2Vzbid0IG5lZWQgZml4aW5nLlxuICAgIGlmICghdG9rZW4ubGVuZ3RoIHx8IHRoaXMudW5jb3VudGFibGVzLmhhc093blByb3BlcnR5KHRva2VuKSkge1xuICAgICAgcmV0dXJuIHdvcmQ7XG4gICAgfVxuXG4gICAgdmFyIGxlbiA9IHJ1bGVzLmxlbmd0aDtcblxuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUgc2FuaXRpemF0aW9uIHJ1bGVzIGFuZCB1c2UgdGhlIGZpcnN0IG9uZSB0byBtYXRjaC5cbiAgICB3aGlsZSAobGVuLS0pIHtcbiAgICAgIHZhciBydWxlID0gcnVsZXNbbGVuXTtcblxuICAgICAgaWYgKHJ1bGVbMF0udGVzdCh3b3JkKSkgcmV0dXJuIHRoaXMucmVwbGFjZSh3b3JkLCBydWxlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gd29yZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGEgd29yZCB3aXRoIHRoZSB1cGRhdGVkIHdvcmQuXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gICByZXBsYWNlTWFwXG4gICAqIEBwYXJhbSAge09iamVjdH0gICBrZWVwTWFwXG4gICAqIEBwYXJhbSAge0FycmF5fSAgICBydWxlc1xuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICovXG4gIHJlcGxhY2VXb3JkKHJlcGxhY2VNYXA6YW55LCBrZWVwTWFwOmFueSwgcnVsZXM6YW55KSB7XG4gICAgcmV0dXJuICh3b3JkKSA9PiB7XG4gICAgICAvLyBHZXQgdGhlIGNvcnJlY3QgdG9rZW4gYW5kIGNhc2UgcmVzdG9yYXRpb24gZnVuY3Rpb25zLlxuICAgICAgY29uc3QgdG9rZW4gPSB3b3JkLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIC8vIENoZWNrIGFnYWluc3QgdGhlIGtlZXAgb2JqZWN0IG1hcC5cbiAgICAgIGlmIChrZWVwTWFwLmhhc093blByb3BlcnR5KHRva2VuKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXN0b3JlQ2FzZSh3b3JkLCB0b2tlbik7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGFnYWluc3QgdGhlIHJlcGxhY2VtZW50IG1hcCBmb3IgYSBkaXJlY3Qgd29yZCByZXBsYWNlbWVudC5cbiAgICAgIGlmIChyZXBsYWNlTWFwLmhhc093blByb3BlcnR5KHRva2VuKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXN0b3JlQ2FzZSh3b3JkLCByZXBsYWNlTWFwW3Rva2VuXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJ1biBhbGwgdGhlIHJ1bGVzIGFnYWluc3QgdGhlIHdvcmQuXG4gICAgICByZXR1cm4gdGhpcy5zYW5pdGl6ZVdvcmQodG9rZW4sIHdvcmQsIHJ1bGVzKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgd29yZCBpcyBwYXJ0IG9mIHRoZSBtYXAuXG4gICAqL1xuICBjaGVja1dvcmQocmVwbGFjZU1hcDphbnksIGtlZXBNYXA6YW55LCBydWxlczphbnkpOkZ1bmN0aW9uIHtcbiAgICByZXR1cm4gKHdvcmQpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gd29yZC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAoa2VlcE1hcC5oYXNPd25Qcm9wZXJ0eSh0b2tlbikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXBsYWNlTWFwLmhhc093blByb3BlcnR5KHRva2VuKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnNhbml0aXplV29yZCh0b2tlbiwgdG9rZW4sIHJ1bGVzKSA9PT0gdG9rZW47XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbHVyYWxpemUgb3Igc2luZ3VsYXJpemUgYSB3b3JkIGJhc2VkIG9uIHRoZSBwYXNzZWQgaW4gY291bnQuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gIHdvcmQgICAgICBUaGUgd29yZCB0byBwbHVyYWxpemVcbiAgICogQHBhcmFtICB7bnVtYmVyfSAgY291bnQgICAgIEhvdyBtYW55IG9mIHRoZSB3b3JkIGV4aXN0XG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1c2l2ZSBXaGV0aGVyIHRvIHByZWZpeCB3aXRoIHRoZSBudW1iZXIgKGUuZy4gMyBkdWNrcylcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgcGx1cmFsaXplKHdvcmQ6c3RyaW5nLCBjb3VudDpudW1iZXIsIGluY2x1c2l2ZTpib29sZWFuKSB7XG4gICAgdmFyIHBsdXJhbGl6ZWQgPSBjb3VudCA9PT0gMVxuICAgICAgPyB0aGlzLnNpbmd1bGFyKHdvcmQpIDogdGhpcy5wbHVyYWwod29yZCk7XG5cbiAgICByZXR1cm4gKGluY2x1c2l2ZSA/IGNvdW50ICsgJyAnIDogJycpICsgcGx1cmFsaXplZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbHVyYWxpemUgYSB3b3JkLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBwdWJsaWMgcGx1cmFsID0gdGhpcy5yZXBsYWNlV29yZCh0aGlzLmlycmVndWxhclNpbmdsZXMsIHRoaXMuaXJyZWd1bGFyUGx1cmFscywgdGhpcy5wbHVyYWxSdWxlcyk7XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgd29yZCBpcyBwbHVyYWwuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIHB1YmxpYyBpc1BsdXJhbCA9IHRoaXMuY2hlY2tXb3JkKHRoaXMuaXJyZWd1bGFyU2luZ2xlcywgdGhpcy5pcnJlZ3VsYXJQbHVyYWxzLCB0aGlzLnBsdXJhbFJ1bGVzKTtcblxuICAvKipcbiAgICogU2luZ3VsYXJpemUgYSB3b3JkLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBwdWJsaWMgc2luZ3VsYXIgPSB0aGlzLnJlcGxhY2VXb3JkKHRoaXMuaXJyZWd1bGFyUGx1cmFscywgdGhpcy5pcnJlZ3VsYXJTaW5nbGVzLCB0aGlzLnNpbmd1bGFyUnVsZXMpO1xuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIHdvcmQgaXMgc2luZ3VsYXIuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIHB1YmxpYyBpc1Npbmd1bGFyID0gdGhpcy5jaGVja1dvcmQodGhpcy5pcnJlZ3VsYXJQbHVyYWxzLCB0aGlzLmlycmVndWxhclNpbmdsZXMsIHRoaXMuc2luZ3VsYXJSdWxlcyk7XG5cbiAgLyoqXG4gICAqIEFkZCBhIHBsdXJhbGl6YXRpb24gcnVsZSB0byB0aGUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cCl9IHJ1bGVcbiAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgIHJlcGxhY2VtZW50XG4gICAqL1xuICBwdWJsaWMgYWRkUGx1cmFsUnVsZShydWxlLCByZXBsYWNlbWVudCkge1xuICAgIHRoaXMucGx1cmFsUnVsZXMucHVzaChbdGhpcy5zYW5pdGl6ZVJ1bGUocnVsZSksIHJlcGxhY2VtZW50XSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBleGNlcHRpb24gdG8gcmVzdG9yZUNhc2UuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBleGNlcHRpb25cbiAgICovXG5cbiAgYWRkUmVzdG9yZUNhc2VFeGNlcHRpb24oZXhjZXB0aW9uKSB7XG4gICAgdGhpcy5yZXN0b3JlQ2FzZUV4Y2VwdGlvbnMucHVzaChleGNlcHRpb24pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgYSBzaW5ndWxhcml6YXRpb24gcnVsZSB0byB0aGUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cCl9IHJ1bGVcbiAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgIHJlcGxhY2VtZW50XG4gICAqL1xuICBhZGRTaW5ndWxhclJ1bGUocnVsZSwgcmVwbGFjZW1lbnQpIHtcbiAgICB0aGlzLnNpbmd1bGFyUnVsZXMucHVzaChbdGhpcy5zYW5pdGl6ZVJ1bGUocnVsZSksIHJlcGxhY2VtZW50XSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZCBhbiB1bmNvdW50YWJsZSB3b3JkIHJ1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHApfSB3b3JkXG4gICAqL1xuICBhZGRVbmNvdW50YWJsZVJ1bGUod29yZCkge1xuICAgIGlmICh0eXBlb2Ygd29yZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMudW5jb3VudGFibGVzW3dvcmQudG9Mb3dlckNhc2UoKV0gPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFNldCBzaW5ndWxhciBhbmQgcGx1cmFsIHJlZmVyZW5jZXMgZm9yIHRoZSB3b3JkLlxuICAgIHRoaXMuYWRkUGx1cmFsUnVsZSh3b3JkLCAnJDAnKTtcbiAgICB0aGlzLmFkZFNpbmd1bGFyUnVsZSh3b3JkLCAnJDAnKTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIGFuIGlycmVndWxhciB3b3JkIGRlZmluaXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzaW5nbGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBsdXJhbFxuICAgKi9cbiAgYWRkSXJyZWd1bGFyUnVsZShzaW5nbGUsIHBsdXJhbCkge1xuICAgIHBsdXJhbCA9IHBsdXJhbC50b0xvd2VyQ2FzZSgpO1xuICAgIHNpbmdsZSA9IHNpbmdsZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgdGhpcy5pcnJlZ3VsYXJTaW5nbGVzW3NpbmdsZV0gPSBwbHVyYWw7XG4gICAgdGhpcy5pcnJlZ3VsYXJQbHVyYWxzW3BsdXJhbF0gPSBzaW5nbGU7XG4gIH07XG5cbiAgcHJpdmF0ZSBfbG9hZFJ1bGVzKCkge1xuICAgIE5nUGx1cmFsaXplSXJyZWd1bGFyUnVsZXMuZm9yRWFjaChcbiAgICAgIChydWxlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZElycmVndWxhclJ1bGUocnVsZVswXSwgcnVsZVsxXSk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIE5nUGx1cmFsaXplU2luZ3VsYXJpemF0aW9uUnVsZXMuZm9yRWFjaChcbiAgICAgIChydWxlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNpbmd1bGFyUnVsZShydWxlWzBdLCBydWxlWzFdKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgTmdQbHVyYWxpemVQbHVyYWxpemF0aW9uUnVsZXMuZm9yRWFjaChcbiAgICAgIChydWxlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZFBsdXJhbFJ1bGUocnVsZVswXSwgcnVsZVsxXSk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIC8qKlxuICAgICAqIFVuY291bnRhYmxlIHJ1bGVzLlxuICAgICAqL1xuICAgIE5nUGx1cmFsaXplVW5jb3VudGFibGUuZm9yRWFjaChcbiAgICAgIChydWxlKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkVW5jb3VudGFibGVSdWxlKHJ1bGUpO1xuICAgICAgfVxuICAgICk7XG4gIH1cbn1cbiJdfQ==
