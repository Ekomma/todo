"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const usersModel_1 = __importDefault(require("../model/usersModel"));
const todoModel_1 = __importDefault(require("../model/todoModel"));
const uuid_1 = require("uuid");
beforeAll(async () => {
    await mongoose_1.default.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }, (err) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
    });
});
afterAll(async () => {
    await todoModel_1.default.deleteMany({});
    await usersModel_1.default.deleteMany({});
    await mongoose_1.default.disconnect();
});
describe('Test for Todo DB', () => {
    it('connect and create todo successfully', async () => {
        const mockdata = {
            id: uuid_1.v4(), created: "2021-03-05T17:17:39.264Z", text: "Motivatation", userEmail: "test.user@gmail.com"
        };
        const testTodo = new todoModel_1.default(mockdata);
        const persistTodo = await testTodo.save();
        expect(persistTodo.id).toBeDefined();
        expect(persistTodo.created).toBe(mockdata.created);
        expect(persistTodo.text).toBe(mockdata.text);
        expect(persistTodo.userEmail).toBe(mockdata.userEmail);
    });
});
describe('Test for User DB', () => {
    it('connect and create User successfully', async () => {
        const mockUserData = {
            firstname: "Ogheneovo", lastname: "Eko", email: "ovoeko@gmail.com", password: "myp455w0rd"
        };
        const testUser = new usersModel_1.default(mockUserData);
        const persistTodo = await testUser.save();
        expect(persistTodo._id).toBeDefined();
        expect(persistTodo.firstname).toBe(mockUserData.firstname);
        expect(persistTodo.lastname).toBe(mockUserData.lastname);
        expect(persistTodo.email).toBe(mockUserData.email);
        expect(persistTodo.password).toBe(mockUserData.password);
    });
});
//# sourceMappingURL=db.test.js.map