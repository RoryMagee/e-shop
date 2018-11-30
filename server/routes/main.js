const router = require('express').Router();
const Category = require('../models/category');
const Product = require('../Models/product');
const async = require('async');

router.get('/test', (req, res, next)=>{
    async.waterfall([])
});

router.route('/categories')
    .get((req, res, next) => {
        Category.find({}, (err, categories) => {
            res.json({
                success: true,
                message: "success",
                categories: categories
            });
        });
    })
    .post((req, res, next) => {
        let category = new Category();
        category.name = req.body.category;
        category.save();
        res.json({
            success: true,
            message: 'successful'
        });
    });

router.get('/categories/:id', (req, res, next)=> {
    const perPage = 10;
    const page = req.query.page;
    async.parallel([
        function(callback) {
            Product.count({category: req.params.id}, (err, count)=> {
                var totalProducts = count;
                callback(err, totalProducts);
            });
        },
        function(callback) {
            Product.find({category: req.params.id})
            .skip(perPage * page)
            .limit(perPage)
            .populate('category')
            .populate('owner')
            .exec((err, products) => {
                if(err) return next(err);
                callback(err, products);
            });
        },
        function(callback) {
            Category.findOne({_id: req.params.id}, (err, category)=> {
                callback(err, category)
            });
        }
    ], function(err, results) {
        var totalProducts = results[0];
        var products = results[1];
        var category = results[2];
        res.json({
            success: true,
            message: 'categories',
            products: products,
            categoryName: category.name,
            totalProducts: totalProducts,
            pages: Math.ceil(totalProducts / perPage)
        });
    });
});

module.exports = router;