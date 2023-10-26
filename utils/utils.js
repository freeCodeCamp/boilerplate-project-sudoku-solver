/**
 * utils.js
 * 
 */
'use strict';

/**
 * Helper Utilities
 * @type {{isObject: (function(*): *), isNumber: (function(*): *), isPositiveNumber: (function(*): *), isArray: (function(*): arg is any[]), isStr: (function(*): *)}}
 */
module.exports = class Ut{
    /**
     * Fix decimals on float number
     * @param fNum {number} The number to fix decimals
     * @param fix {number} The number of decimals
     * @param defaultValue {*} The default value to be returned if any params is not valid
     * @return {number|*} Return float number with fixed decimals or value of defaultValue
     */
    static toFixedFloat (fNum, fix = 2, defaultValue = null) {
        return (Ut.isNumber(fNum) && Ut.isNumber(fix)) ? parseFloat(fNum.toFixed(fix)) : defaultValue;
    }
    /**
     * Test if value is a valid function
     * @param value {object} The value to test
     * @return {boolean} Return true if value is a valid function
     */
    static isFunction(value) {
        return typeof value === "function" 
    }
    /**
     * Test if value is a valid object
     * @param value {object} The value to test
     * @return {boolean} Return true if value is a valid object
     */
    static isObject (value) {
        return typeof value === 'object' && !Array.isArray(value) && value !== null
    }
    /**
     * Test if value is a valid array
     * @param value {array} The value to test
     * @return {boolean} Return true if value is a valid array
     */
    static isArray (value) {
        return Array.isArray(value)
    }
    /**
     * Test if value is a valid number
     * @param value {number} The value to test
     * @return {boolean} Return true if value is a valid number
     */
    static isNumber (value) {
        return !isNaN(value) && value != null
    }
    /**
     * Test if value is a valid positive number
     * @param value {number} The value to test
     * @return {boolean} Return true if value is a valid positive number
     */
    static isPositiveNumber (value) {
        return Ut.isNumber(value) && value > 0
    }
    /**
     * Test if value is a valid string
     * @param value {string} The value to test
     * @return {boolean} Return true if value is a valid string
     */
    static isStr (value){
        return (typeof value === 'string' || value instanceof String)
    }
    /**
     * Test if value is a valid string and his not empty
     * @param value {string} The value to test
     * @return {boolean} Return true if value is a valid string and his not empty
     */
    static isStrNotEmpty (value) {
        return (Ut.isStr(value) && value !== '')
    }
    static capitalize(value, defaultValue=null) {
        if(Ut.isStrNotEmpty(value)){
            const arr = value.split(" ")
            const capArr = arr.map(val => {
                return val.charAt(0).toUpperCase() + val.slice(1)
            })
            return capArr.join(" ")
        }
        return defaultValue
    }
    /**
     * Test if value is a valid key and his not empty.
     * A key must :
     *  - have a length between 1 and 30 chars
     *  - start and end with alphanumerical character
     *  - contain alphanumerical character and '_'
     * @param value {string} The value to test
     * @return {boolean} Return true if value is a valid key
     */
    static isKey (value) {
        return Ut.isStr(value) && /(?=\w{1,30}$)^([a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*)$/.test(value)
    }
    /**
     * Test if value is a valid Attribute key.
     * A key must :
     *  - have a length between 1 and 80 chars
     *  - start and end with alphanumerical character
     *  - contain alphanumerical character and '_' or '-'
     * @param value {string} The value to test
     * @return {boolean} Return true if value is a valid Attribute key
     */
    static isAttrKey (value) {
        return Ut.isStr(value) && /(?=[a-zA-Z0-9\-_]{1,80}$)^([a-zA-Z0-9]+(?:[_-][a-zA-Z0-9]+)*)$/.test(value)
    }
    /**
     * Test is regex is valid
     * @param regex {RegExp|string} The regex to test
     * @return {boolean} Return true if regex is valid or false else where.
     */
    static isValidRegex (regex) {
        try{
            new RegExp(regex);
            return true
        }catch (e){
            return false
        }

    }
    /**
     * Check a query selector
     * @param s {string} The query selector to check
     * @return {*}
     */
    static queryCheck (s) {
        return document.createDocumentFragment().querySelector(s)
    }
    /**
     * Test if value is valid query selector
     * @param selector {string} The query selector to test
     * @return {boolean} Return true if is valid query selector
     */
    static isSelector (selector) {
        try {
            Ut.isStr(selector) && Ut.queryCheck(selector)
        } catch {
            return false
        }
        return true;
    }
    /**
     * Test if element is valid html element
     * @param element {HTMLElement} The element to test
     * @return {boolean} Return true if element is valid HtmlElement
     */
    static isElement (element) {
        return element instanceof Element || element instanceof Document;
    }
}