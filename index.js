require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const router = require('./server/routes');

const app = express();
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../Lybica-Client/dist')));
app.use('/products', router.products);
app.use('/loaderio-db5eddc9c943bbf55107647244f05b67', (req, res) => {
  res.sendFile(path.join(__dirname, 'loaderio-db5eddc9c943bbf55107647244f05b67.txt'));
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`now listening at http://localhost:${port}`);
