"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dbconnect_1 = __importDefault(require("./config/dbconnect"));
const express_session_1 = __importDefault(require("express-session"));
const user_todos_1 = __importDefault(require("./routes/user-todos"));
const login_1 = __importDefault(require("./routes/login"));
const app = express_1.default();
/* connect database */
dbconnect_1.default();
app.use(cors_1.default());
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
/* create session and cookie */
app.use(express_session_1.default({
    key: 'user_sid',
    secret: 'sghjglknslgksg',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 1000,
    },
}));
app.use('/', login_1.default);
app.use('/user-todos', user_todos_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(http_errors_1.default(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
//# sourceMappingURL=app.js.map