"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const usersModel_1 = __importDefault(require("../model/usersModel"));
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
/* validate user */
const registerSchema = joi_1.default.object({
    firstname: joi_1.default.string().alphanum().max(16).min(3).required(),
    lastname: joi_1.default.string().alphanum().max(16).min(3).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(3).max(16).required(),
});
async function login(data) {
    const errors = [];
    const user = await usersModel_1.default.findOne({ email: data.email });
    if (!user) {
        errors.push('Invalid Username or Password');
        throw errors;
    }
    /* comparing passwords for login */
    const match = await bcrypt_1.default.compare(data.password, user.password);
    if (!match) {
        errors.push('Invalid Username or Password');
        throw errors;
    }
    else {
        return user;
    }
}
exports.login = login;
async function register(data) {
    const { error, value } = registerSchema.validate(data, {
        stripUnknown: true,
    });
    const errors = [];
    if (error === null || error === void 0 ? void 0 : error.details)
        errors.push(error.details[0].message);
    if (errors.length) {
        throw errors;
    }
    const emailExist = await usersModel_1.default.findOne({ email: value.email });
    if (emailExist) {
        errors.push('Email already exist');
        throw errors;
    }
    const user = new usersModel_1.default(value);
    bcrypt_1.default.genSalt(10, (err, salt) => {
        bcrypt_1.default.hash(user.password, salt, (err, hash) => {
            if (err) {
                throw err;
            }
            else {
                user.password = hash;
                user.save().then().catch(console.error);
            }
        });
    });
    return user;
}
exports.register = register;
//# sourceMappingURL=usersControllers.js.map