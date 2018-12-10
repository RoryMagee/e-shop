const dotenv = require('dotenv').config();

module.exports = {
    database: 'mongodb://' + process.env.mongo_username + ':' + process.env.mongo_password + '@ds239029.mlab.com:39029/e-shop',
    port: '8081',
    secret: process.env.mongo_secret
}

