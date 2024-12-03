require('dotenv').config();
var express = require('express');
var cors = require('cors');

const database = require('./config/database');
const routes = require('./routes/Routes');
const authenticateToken = require('./middlewares/authenticateToken')

const port = process.env.PORT || 3001;
const hostname = process.env.HOST_NAME;

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/user/register')) {
        return next();  // Bỏ qua middleware cho các route login và register
    }
    if (req.originalUrl.startsWith('/user/login')) {
        return next();  // Bỏ qua middleware cho các route login và register
    }
    console.log("server", req.headers['Authorization']);
    authenticateToken(req, res, next);  // Áp dụng middleware authenticate cho tất cả các route còn lại
});

app.use('/', routes);

database.connect();


app.listen(port, hostname, () => {
    console.log(`Listening on port ${port}`);
});



module.exports = app;
