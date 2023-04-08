const pgp = require('pg-promise')();

const cn = {
  host: 'localhost',
  port: 5432,
  user: 'johnathansimeroth',
  database: 'lybica',
};

const db = pgp(cn);

const getStylePhotos = async (styleID) => {
  const query = 'SELECT thumbnail_url, url FROM photos WHERE style_id = $1';
  const params = [styleID];
  return db.any(query, params);
};

const getStyleSkus = async (styleID) => {
  const query = `SELECT json_object_agg(id, json_build_object('size', size, 'quantity', quantity)) AS skus FROM skus WHERE style_id = $1`;
  const params = [styleID];
  return db.any(query, params);
};

exports.listProducts = ({ page = 1, count = 5 }) => {
  const query = 'SELECT * FROM products WHERE id > $1 ORDER BY id ASC LIMIT $2';
  const params = [(page - 1) * count, count];
  return db.any(query, params);
};

exports.getProductByID = async ({ id }) => {
  // let query = 'SELECT * FROM products LEFT OUTER JOIN features ON products.id = features.product_id WHERE products.id = $1';
  let query = 'SELECT * FROM products WHERE id = $1';
  const params = [id];
  const product = await db.one(query, params);

  query = 'SELECT feature, value FROM features WHERE product_id = $1';
  const features = await db.any(query, params);
  product.features = features;
  return product;
};

exports.getStyles = async ({ id }) => {
  const stylesObj = { product_id: id.toString() };
  const query = 'SELECT id, name, sale_price, original_price, "default?" FROM styles WHERE product_id = $1';
  const params = [id];

  const styles = await db.any(query, params);
  const photos = await Promise.all(styles.map((style) => getStylePhotos(style.id)));
  const skus = await Promise.all(styles.map((style) => getStyleSkus(style.id)));
  styles.forEach((style, index) => {
    style.style_id = style.id;
    delete style.id;
    style.photos = photos[index];
    style.skus = skus[index][0].skus;
  });
  stylesObj.results = styles;
  return stylesObj;
};

exports.getRelatedProducts = async ({ id }) => {
  const query = 'SELECT json_agg(related_product_id) AS related FROM related WHERE current_product_id = $1';
  const params = [id];
  const result = await db.one(query, params);
  return result.related;
};
