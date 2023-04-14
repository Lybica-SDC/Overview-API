require('dotenv').config();
const express = require('express');
const path = require('path');
// const morgan = require('morgan');
const router = require('./server/routes');

const app = express();
// app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../Lybica-Client/dist')));
app.use('/products', router.products);
app.use(`/${process.env.LOADER_IO_KEY}`, (req, res) => {
  res.send(process.env.LOADER_IO_KEY);
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`now listening at http://localhost:${port}`);
