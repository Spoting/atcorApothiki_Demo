const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const http = require('http');
const cors = require("cors");
const app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(fileUpload());

//Images
app.use('/static', express.static(__dirname + '/imgs'));

//Database
const models = require("./models");
models.sequelize.sync({ force: false })
    .then(() => {
        console.log('GG DATABASE');
        // Item.create({atcorId:1},{name:'test1'})
        // Item.create({atcorId:2},{name:'test2'}).then( (t) => console.log(t.atcorId))
        //Tests Inserts
    }).catch((err) => console.log(err, "Apotixia megali"))

require('./routes')(app);


// app.get('*', (req, res) => res.status(200).send({
//     message : 'Manes mono sta 5'
// }));

const port = parseInt(process.env.PORT, 10) || 8000;

app.set('port', port);

const server = http.createServer(app);
server.listen(port);

module.exports = app;