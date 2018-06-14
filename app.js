// is Production or Dev
if (process.env.NODE_ENV == 'production') {
    require('dotenv').config();
}
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');
const app = express();
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.use(bodyParser.urlencoded({ extended: true }));
MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err)
    database = database.db("hentaimkapi");
    require('./app/routes')(app, database);
    // require('./app/routes/api_getter')(app);
    app.listen(port, ip, () => {
        console.log('We are live on ' + port);
    });
})