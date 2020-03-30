var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var log_in= require('./router/loginroutes');
var Web3 = require('web3');
const TX = require('ethereumjs-tx');
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/a0a975e16b6846af9c7af6b28767f23d"));
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.set('views',__dirname+'/views');
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);
app.use(express.static('public'));
var _router = require('./router/main.js')(app);




var router = express.Router();

var server= app.listen(5000);