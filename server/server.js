const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const path = require('path');
const http = require('http');

const app = express();

mongoose.connect(config.database, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Connected to DB");
    }
});

app.use(express.static('dist/AngularEShop'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(cors());

app.set('port', config.port);

const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const sellerRoutes = require('./routes/seller');
const productSearchRoutes = require('./routes/search');
app.use('/api/accounts', userRoutes);
app.use('/api', mainRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/search', productSearchRoutes);

var server = http.createServer(app);

app.listen(config.port, (err) => {
    console.log("Server listening on port 3030");
})