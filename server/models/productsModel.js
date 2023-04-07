const pgp = require('pg-promise')();

const cn = {
  host: 'localhost',
  port: 5432,
  user: 'johnathansimeroth',
  database: 'lybica',
};

const db = pgp(cn);

exports.listProducts = ({ page = 1, count = 5 }) => {
  const query = 'SELECT * FROM products WHERE id > $1 ORDER BY id ASC LIMIT $2';
  const params = [(page - 1) * count, count];
  return db.any(query, params);
};

exports.getProductByID = ({ id }) => {
  const query = 'SELECT * FROM products WHERE id = $1';
  const params = [id];
  return db.any(query, params);
};

exports.getStyles = ({ id }) => {
  const query = 'SELECT * FROM styles WHERE product_id = $1';
  const params = [id];
  return db.any(query, params);
};

exports.getRelatedProducts = ({ id }) => {
  const query = 'SELECT related_product_id FROM related WHERE current_product_id = $1';
  const params = [id];
  return db.any(query, params);
};
