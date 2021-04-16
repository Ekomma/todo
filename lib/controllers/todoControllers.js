"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteData = exports.updateData = exports.postData = exports.getAllData = void 0;
const todoModel_1 = __importDefault(require("../model/todoModel"));
const uuid_1 = require("uuid");
async function getAllData(data, user) {
    let prev, next;
    let { limit = 5, page = 1 } = data;
    limit = Number(limit);
    page = Number(page);
    const count = await todoModel_1.default.countDocuments();
    const totalPages = Math.ceil(count / 5);
    if (page > 1) {
        prev = `/user-todos/api?page=${page - 1}`;
    }
    ;
    if (page * limit < count) {
        next = `/user-todos/api?page=${page + 1}`;
    }
    const allTodos = await todoModel_1.default.find().limit(limit).skip((page - 1) * limit);
    return { allTodos, prev, next, page, totalPages };
}
exports.getAllData = getAllData;
async function postData(data, email) {
    const id = uuid_1.v4();
    const newData = { ...data, id, userEmail: email.email };
    try {
        const result = await todoModel_1.default.create(newData);
        return result;
    }
    catch (error) {
        throw error;
    }
}
exports.postData = postData;
async function updateData(data, param) {
    const singleData = await todoModel_1.default.find({ id: param.id });
    if (!singleData) {
        throw Error(`todo not found`);
    }
    else {
        const newData = { ...singleData[0]._doc, ...data };
        await todoModel_1.default.updateOne({ id: param.id }, { text: data.text, created: data.created });
        return newData;
    }
}
exports.updateData = updateData;
async function deleteData(param) {
    const singleData = await todoModel_1.default.find({ id: param.id });
    console.log(singleData);
    if (!singleData) {
        throw Error(`todo not found`);
    }
    else {
        return await todoModel_1.default.deleteOne({ id: param.id });
    }
}
exports.deleteData = deleteData;
//# sourceMappingURL=todoControllers.js.map