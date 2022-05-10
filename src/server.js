/* eslint-disable import/no-cycle */
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import redis from 'redis';
import bluebird from 'bluebird';
import { ussdRouter } from 'ussd-router';
import { checkIfUserExists } from './core/usermanagement.js';
import { renderRegisterMenu } from './menus/rendermenu.js';
import checkFarmerSelection from './users/farmer/farmerselection.js';
import checkBuyerSelection from './users/buyer/buyerselection.js';
import selectLanguage from './menus/language.js';
import { languageChooser } from './helpers.js';

const port = process.env.PORT || 3032;

const app = express();

const client = redis.createClient({ host: 'redis-19100.c251.east-us-mz.azure.cloud.redislabs.com', port: 19100, password: 'T6SXoEq1tyztu6oLYGpSO2cbE2dE1gDH' });

bluebird.promisifyAll(redis.RedisClient.prototype);

client.on('connect', () => {});
client.on('error', (error) => {
  throw new Error(error);
});

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(session({
  resave: true, secret: '123456', path: '/', saveUninitialized: true,
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.post('/ussd', async (req, res) => {
  const rawtext = req.body.text;
  const text = ussdRouter(rawtext, '0', '00');
  const textValue = text.split('*').length;
  console.log('The text value', textValue);

  let message;
  if (text === '') {
    message = selectLanguage();
  } else {
    const userLanguage = languageChooser(text.split('*')[0]);
    const response = await checkIfUserExists(req.body.phoneNumber.substring(1));
    if (response.exists && response.role === 'BUYER') {
      client.set('user_Id', response.user_id);
      message = await checkBuyerSelection(textValue, text, userLanguage, req.body.phoneNumber);
    } else if (response.exists && response.role === 'FARMER') {
      client.set('user_id', response.user_id);
      message = await checkFarmerSelection(text, 0, userLanguage);
    } else if (!response.exists) {
      message = await renderRegisterMenu(textValue, text, req.body.phoneNumber, userLanguage);
    }
  }

  res.send(message);
});

app.listen(port, () => {});

export default client;
