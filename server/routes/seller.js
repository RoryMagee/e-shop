const router = require('express').Router;
const Product = require('../Models/product');
const dotenv = require('dotenv').config();

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new aws.s3({ accessKeyId: process.env.aws_access_id_key, secretAccessKey: process.env.aws_secret_access_key});

module.exports = router;