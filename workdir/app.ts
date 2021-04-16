import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import logger from 'morgan';
import cors from 'cors';
import connectdb from './config/dbconnect';
import session from 'express-session';
import userTodoRouter from './routes/user-todos';
import loginRouter from './routes/login';

const app = express();

/* connect database */
connectdb();
app.use(cors());
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/* create session and cookie */
app.use(
  session({
    key: 'user_sid',
    secret: 'sghjglknslgksg',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 1000,
    },
  }),
);

app.use('/', loginRouter);
app.use('/user-todos', userTodoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
