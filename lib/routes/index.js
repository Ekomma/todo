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
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const database_json_1 = __importDefault(require("../../workdir/database.json"));
const router = express.Router();
let data = database_json_1.default;
// /* Get homepage */
router.get('/', (req, res) => {
    res.render('index');
});
/* get all data */
router.get('/api', function (req, res) {
    res.send(data);
});
/* get single data */
router.get('/api/:id', function (req, res) {
    const singleData = data.find((item) => {
        return item.id === req.params.id;
    });
    if (!singleData) {
        res.status(404).send(`data not found`);
    }
    else {
        res.send(singleData);
    }
});
/* post data */
router.post('/api', function (req, res) {
    const id = uuid_1.v4();
    const newData = { ...req.body, id };
    console.log(id, newData);
    data.push(newData);
    fs_1.default.writeFileSync('./workdir/database.json', JSON.stringify(data, null, 2));
    res.status(201).send(newData);
});
/* update data */
router.put('/api/:id', function (req, res) {
    let singleData = {};
    let index = 0;
    data.forEach((item, ind) => {
        if (item.id === req.params.id) {
            singleData = item;
            index = ind;
        }
    });
    if (!singleData) {
        res.status(404).send(`data not found`);
    }
    else {
        const newData = { ...singleData, ...req.body };
        data[index] = newData;
        fs_1.default.writeFileSync('./workdir/database.json', JSON.stringify(data, null, 2));
        res.send(newData);
    }
});
/* delete data */
router.delete('/api/:id', function (req, res) {
    const singleData = data.find((item) => {
        return item.id === req.params.id;
    });
    if (!singleData) {
        res.status(404).send(`data not found`);
    }
    else {
        data = data.filter((item) => item.id !== req.params.id);
        fs_1.default.writeFileSync('./workdir/database.json', JSON.stringify(data, null, 2));
        res.send({ message: `Data with id: ${req.params.id} has been removed` });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map