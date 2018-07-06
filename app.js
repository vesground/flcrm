import path     from 'path';
import bluebird from 'bluebird';
global.Promise = bluebird;

import express     from 'express';
import logger      from 'bunyan-singletone-facade';
import middlewares from './lib/middlewares';
import router      from './lib/router';
import { appPort } from './etc/config.json';
import './lib/registerValidationRules';

// Init logger
logger.init({
    directory : path.join(__dirname, 'logs'),
    name      : 'be'
});

// Init app
const app = express();

app.use(middlewares.json);
app.use('/api/v1', router);

console.log(`APP STARTING AT PORT ${appPort}`);
app.listen(appPort);

export default app;
