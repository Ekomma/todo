"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const usersControllers_1 = require("../controllers/usersControllers");
const router = express.Router();
/* Get login page */
router.get('/', (req, res) => {
    res.render('login');
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', async function loginRoute(req, res) {
    const data = req.body;
    try {
        const record = await usersControllers_1.login(data);
        req.session.user = { email: record.email };
        res.redirect('/user-todos');
    }
    catch (e) {
        res.status(400).render('login', { error: e });
    }
});
/* Get register page */
router.get('/register', function resterPage(req, res) {
    res.render('register');
});
router.post('/register', async function registerRoute(req, res, next) {
    const data = req.body;
    try {
        const record = await usersControllers_1.register(data);
        req.session.user = {
            Username: record.email,
        };
        res.status(201).redirect('/user-todos');
    }
    catch (e) {
        res.status(400).render('register', { error: e });
    }
});
/* Logging out */
router.get('/logout', function logout(req, res) {
    req.session.destroy(console.log);
    res.redirect("/");
});
exports.default = router;
//# sourceMappingURL=login.js.map