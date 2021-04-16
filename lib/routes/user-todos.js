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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const todoModel_1 = __importDefault(require("../model/todoModel"));
const todoControllers_1 = require("../controllers/todoControllers");
const router = express.Router();
/* get all data */
router.get('/api', async (req, res, next) => {
    try {
        const response = await todoControllers_1.getAllData(req.query, req.session.user);
        res.json(response);
    }
    catch (error) {
        console.error(error);
    }
});
/* login or todos page */
router.get('/', async function (req, res) {
    if (!req.session.user) {
        res.redirect('/login');
        return;
    }
    res.render('user-todos');
});
/* get single data */
router.get('/api/:id', async function (req, res) {
    const singleData = await todoModel_1.default.find({ id: req.params.id });
    if (!singleData) {
        res.status(404).send(`data not found`);
    }
    else {
        res.send(singleData);
    }
});
/* post data */
router.post('/api', async function (req, res) {
    try {
        const response = await todoControllers_1.postData(req.body, req.session.user);
        res.status(201).send(response);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
/* update data */
router.put('/api/:id', async function (req, res) {
    try {
        const response = await todoControllers_1.updateData(req.body, req.params);
        res.send(response);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
/* delete data */
router.delete('/api/:id', async function (req, res) {
    try {
        const response = await todoControllers_1.deleteData(req.params);
        res.send({ message: `Data with id: ${req.params.id} has been removed` });
    }
    catch (error) {
        res.send(error);
    }
});
exports.default = router;
//# sourceMappingURL=user-todos.js.map