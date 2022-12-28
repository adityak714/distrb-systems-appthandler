"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDate = void 0;
//convert date
function convertDate(date) {
    const convertedDate = new Date(date);
    convertedDate.setHours(convertedDate.getHours() + 1);
    return convertedDate;
}
exports.convertDate = convertDate;
