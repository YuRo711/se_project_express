const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');


const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(requestLogger);
app.use('/', router);


app.use(errorLogger);

app.listen(PORT);
