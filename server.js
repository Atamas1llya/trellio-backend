import express from 'express';
import session from 'express-session';
import chalk from 'chalk';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
const MongoStore = require('connect-mongo')(session);

import config from './config';

// routes
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import boardsRoutes from './routes/boards';
import tasksRoutes from './routes/tasks';

// error handler
import errorHandler from './middlewares/errorHandler';

mongoose.Promise = bluebird;
mongoose.connect(config.database, (err) => {
  if (err) throw err;
  console.log(chalk.cyan('Connected to database...'));
})

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: config.secret,
    store: new MongoStore({
      url: config.database,
    }),
  }),
);
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('tiny'));
}

app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', boardsRoutes);
app.use('/api', tasksRoutes);

const server = app.listen(config.port, () => {
  console.log(chalk.green(`Listening at ${config.port}...\n`));
});

app.use(errorHandler);

export default server; // For tests (mocha, chai, etc.)
