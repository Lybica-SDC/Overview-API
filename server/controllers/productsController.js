const db = require('../models/productsModel');

const tryCatch = async (req, res, dbFunc, errMsg, params, sucStatus = 200, failStatus = 500) => {
  try {
    const result = await dbFunc(params);
    res.status(sucStatus);
    res.send(result);
  } catch (err) {
    res.status(failStatus);
    res.send(`${errMsg}: ${err}`);
  }
};

exports.listProducts = async (req, res) => {
  const params = {
    page: req.query.page,
    count: req.query.count,
  };
  tryCatch(req, res, db.listProducts, 'Error getting list of products', params);
};

exports.getProductByID = (req, res) => {
  const params = { id: req.params.id };
  tryCatch(req, res, db.getProductByID, `Error getting details for product ${params.id}`, params);
};

exports.getStyles = (req, res) => {
  const params = { id: req.params.id };
  tryCatch(req, res, db.getStyles, `Error getting styles for product ${params.id}`, params);
};

exports.getRelatedProducts = (req, res) => {
  const params = { id: req.params.id };
  tryCatch(req, res, db.getRelatedProducts, `Error getting related products ${params.id}`, params);
};
