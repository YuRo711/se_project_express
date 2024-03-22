const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes/index');


const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
    .catch((err) => {
        console.log("error while connecting to database", err);
    });

app.use('/', router);

app.use((req, res, next) => {
    req.user = {
      _id: '65fcc4c0db8e5882bc0fe27d'
    };
    next();
  });

app.listen(PORT);
