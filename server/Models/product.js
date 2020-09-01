const mongoose = require('mongoose');
const mongooseAlgolia = require('mongoose-algolia');
const env = require('dotenv').config();
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    image: String,
    title: String,
    description: String,
    price: Number,
    created: {type: Date, default: Date.now}
});

ProductSchema.plugin(mongooseAlgolia, {
    appId: process.env.algolia_app_id,
    apiKey: process.env.algolia_admin_api_key,
    indexName: 'eshop',
    selector: '_id title image description price owner created',
    populate: {
        path: 'owner',
        select: 'name'
    },
    defaults: {
        author: 'unknown'
    },
    mappings: {
        title: function(value) {
            return `${value}`
        }
    },
    virtuals: {
        
    },
    debug: true
});

let Model = mongoose.model('Product', ProductSchema);
Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
    searchableAttributes: ['title']
});

module.exports = Model;
