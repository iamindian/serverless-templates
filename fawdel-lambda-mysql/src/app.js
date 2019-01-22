/* eslint-disable no-console */
'use strict';
console.log('app.js start');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const app = express();
const router = express.Router();
const root = '/api';
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(awsServerlessExpressMiddleware.eventContext());
router.get(`${root}`,(req,res)=>{
	res.header();
	res.status(200).json({msg:'hello world for lambda api'});
});
app.use('/',router);

module.exports = app;
console.log('app.js end');