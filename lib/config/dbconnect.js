"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectdb = async () => {
    try {
        const dbconect = await mongoose_1.default.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        console.log(`MongoDB Connected: ${dbconect.connection.host}`);
    }
    catch (error) {
        console.error(error);
        throw Error;
    }
};
exports.default = connectdb;
//# sourceMappingURL=dbconnect.js.map