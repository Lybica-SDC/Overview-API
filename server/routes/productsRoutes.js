require('dotenv').config();
const router = require('express').Router();
const controller = require('../controllers/productsController');

router.get('/', controller.listProducts);

router.get('/:id', controller.getProductByID);

router.get('/:id/styles', controller.getStyles);

router.get('/:id/related', controller.getRelatedProducts);

module.exports = router;
