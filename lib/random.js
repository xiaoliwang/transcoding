"use strict";

/**
 * Get a random floating number between `min` and `max`.
 * 
 * @param {number} min min number
 * @param {number} max max number
 * 
 * @returns {number} a random floating number
 */
function getRandomFloat(min, max) {
    if (min > max) throw new Error("min cannot be greater than max");
    return min + Math.random() * (max - min);
}

/**
 * Get a random integer between `min` and `max`.
 * 
 * @param {number} min  min number
 * @param {number} max max number
 * 
 * @returns {number} a random integer
 */
function getRandomInt(min, max) {
    if (min > max) throw new Error("min cannot be greater than max");
    return Math.floor(min + Math.random() * (max - min + 1));
}

/**
 * Get a random boolean value.
 * 
 * @returns {boolean} a random true/false
 */
function getRandomBool() {
    return Math.random() >= 0.5;
}

exports.getRandomFloat = getRandomFloat;
exports.getRandomInt = getRandomInt;
exports.getRandomBool = getRandomBool;