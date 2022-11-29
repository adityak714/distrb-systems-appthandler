"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToLocalTime = void 0;
function convertToLocalTime(date, timeZone) {
    return new Date(date.toLocaleTimeString(timeZone));
}
exports.convertToLocalTime = convertToLocalTime;
