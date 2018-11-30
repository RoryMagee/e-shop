const router = require('express').Router();
const Product = require('../Models/product');
const dotenv = require('dotenv').config();


const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const checkJWT = require('../Middleware/check-jwt');
const s3 = new aws.S3({ accessKeyId: process.env.aws_access_id_key, secretAccessKey: process.env.aws_secret_access_key});

const faker = require('faker');

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'eshopwebapplication',
        metadata: function(req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now().toString());
        }
    })
});

router.route('/products')
    .get(checkJWT, (req, res, next) => {
        Product.find({owner: req.decoded.user._id})
        .populate('owner')
        .populate('category')
        .exec((err, products) => {
            if(products) {
                res.json({
                    success: true,
                    message: "products",
                    products: products
                });
            }
        });
    })
    .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
        let product = new Product();
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image = req.file.location;
        product.save();
        res.json({
            success: true,
            message: 'sucecssfully added product'
        });
    });

router.get('/faker/test', (req, res, next)=> {
    for(i = 0; i < 20; i++) {
        let product = new Product();
        product.owner = '5bff0d5b8de04d1e9488fe29';
        product.image = faker.image.cats();
        product.title = faker.commerce.productName();
        product.description = faker.lorem.words();
        product.price = faker.commerce.price();
        product.category = '5c001e42c0115e04e48c71d5';
        product.save();
    }
    res.json({
        message: "success added 20 products"
    });
});


module.exports = router;