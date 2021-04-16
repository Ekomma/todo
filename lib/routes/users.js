"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/* GET users listing. */
// router.post('/register', async function registerRoute(req, res, next) {
//   const data = req.body;
//   try {
//     const record = await register(data);
//     res.status(201).redirect('/user-todos')
//   } catch (e) {
//     res.status(400).render('register', {error: e})
//   }
// });
// router.post('/login', async function loginRoute(req, res) {
//   const data = req.body;
//   try {
//     const record = await login(data);
//   } catch (e) {
//   }
// })
exports.default = router;
//# sourceMappingURL=users.js.map