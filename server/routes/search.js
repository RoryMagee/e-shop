const router = require('express').Router();
const dotenv = require('dotenv').config();
const algoliasearch = require('algoliasearch');
const client = algoliasearch(process.env.algolia_app_id, process.env.algolia_admin_api_key);
const index = client.initIndex('eshop');

router.get('/', (req, res, next) => {
    if(req.query.query) {
        index.search({
            query: req.query.query,
            page: req.query.page,
        }, (err, content) => {
            res.json({
                success: true,
                message: "Search Results",
                status: 200,
                content: content,
                search_result: req.query.query
            });
        });
    }
});

module.exports = router;