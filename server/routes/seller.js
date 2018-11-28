const router = require('express').Router();
const Product = require('../Models/product');
const dotenv = require('dotenv').config();

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const checkJWT = require('../Middleware/check-jwt');
const s3 = new aws.S3({ accessKeyId: process.env.aws_access_id_key, secretAccessKey: process.env.aws_secret_access_key});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'eshopwebapplication',
        metadata: function(req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
});

router.route('/products')
    .get(checkJWT, (req, res, next) => {
        Product.find({owner: req.decoded.user._id})
        .populate('ownder')
        .populate('category')
        .exec((err, products) => {
            if(products) {
                res.json({
                    sucecss: true,
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


module.exports = router;