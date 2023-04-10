const pgp = require('pg-promise')();

const cn = {
  host: 'localhost',
  port: 5432,
  user: 'johnathansimeroth',
  database: 'lybica',
};

const db = pgp(cn);

// const getStylePhotos = async (styleID) => {
//   const query = 'SELECT thumbnail_url, url FROM photos WHERE style_id = $1';
//   const params = [styleID];
//   return db.any(query, params);
// };

// const getStyleSkus = async (styleID) => {
//   const query = `SELECT json_object_agg(id, json_build_object('size', size, 'quantity', quantity)) AS skus FROM skus WHERE style_id = $1`;
//   const params = [styleID];
//   return db.any(query, params);
// };

exports.listProducts = ({ page = 1, count = 5 }) => {
  const query = 'SELECT * FROM products WHERE id > $1 ORDER BY id ASC LIMIT $2';
  const params = [(page - 1) * count, count];
  return db.any(query, params);
};

// exports.getProductByID = async ({ id }) => { // original await combine method
//   let query = 'SELECT * FROM products WHERE id = $1';
//   const params = [id];
//   const product = await db.one(query, params);

//   query = 'SELECT feature, value FROM features WHERE product_id = $1';
//   const features = await db.any(query, params);
//   product.features = features;
//   return product;
// };

// exports.getProductByID = async ({ id }) => { // promise.all approach
//   const queries = [
//     'SELECT * FROM products WHERE id = $1',
//     'SELECT feature, value FROM features WHERE product_id = $1',
//   ];
//   const params = [id];

//   const [[product], features] = await Promise.all(queries.map((query) => db.any(query, params)));
//   product.features = features;
//   return product;
// };

exports.getProductByID = async ({ id }) => { // join table approach
  const query = `
  SELECT
    p.id,
    p.name,
    p.slogan,
    p.description,
    p.category,
    p.default_price,
    json_agg(json_build_object('feature', f.feature, 'value', f.value)) AS features
  FROM products p
  LEFT JOIN features f ON p.id = f.product_id
  WHERE p.id = $1
  GROUP BY p.id;
  `;
  const params = [id];
  const product = await db.one(query, params);
  return product;
};

// exports.getProductByID = async ({ id }) => { // subquery approach without join table
//   const query = `
//   SELECT
//     p.id,
//     p.name,
//     p.slogan,
//     p.description,
//     p.category,
//     p.default_price,
//     (
//       SELECT json_agg(json_build_object('feature', f.feature, 'value', f.value))
//       FROM features f
//       WHERE f.product_id = p.id
//     ) AS features
//   FROM products p
//   WHERE p.id = $1;
//   `;
//   const params = [id];
//   const product = await db.one(query, params);
//   return product;
// };

// const getStylePhotos = async (styleID) => {
//   const query = 'SELECT thumbnail_url, url FROM photos WHERE style_id = $1';
//   const params = [styleID];
//   return db.any(query, params);
// };

// const getStyleSkus = async (styleID) => {
//   const query = `SELECT json_object_agg(id, json_build_object('size', size, 'quantity', quantity)) AS skus FROM skus WHERE style_id = $1`;
//   const params = [styleID];
//   return db.any(query, params);
// };

// exports.getStyles = async ({ id }) => {
//   const stylesObj = { product_id: id.toString() };
//   const query = 'SELECT id, name, sale_price, original_price, "default?" FROM styles WHERE product_id = $1';
//   const params = [id];

//   const styles = await db.any(query, params);
//   const photos = await Promise.all(styles.map((style) => getStylePhotos(style.id)));
//   const skus = await Promise.all(styles.map((style) => getStyleSkus(style.id)));
//   styles.forEach((style, index) => {
//     style.style_id = style.id;
//     delete style.id;
//     style.photos = photos[index];
//     style.skus = skus[index][0].skus;
//   });
//   stylesObj.results = styles;
//   return stylesObj;
// };

// exports.getStyles = async ({ id }) => { // no joins
//   const query = `
//   SELECT
//     s.product_id,
//     (
//       SELECT json_agg(json_build_object(
//         'style_id', s.id,
//         'name', s.name,
//         'sale_price', s.sale_price,
//         'original_price', s.original_price,
//         'default?', s."default?",
//         'photos', (
//           SELECT json_agg(json_build_object('thumbnail_url', p.thumbnail_url, 'url', p.url))
//           FROM photos p
//           WHERE p.style_id = s.id
//         ),
//         'skus', (
//           SELECT json_object_agg(k.id, json_build_object('size', k.size, 'quantity', k.quantity))
//           FROM skus k
//           WHERE k.style_id = s.id
//         )
//         ))
//     ) AS results
//     FROM styles s
//     WHERE s.product_id = $1
//     GROUP BY s.product_id;
//   `;

//   const params = [id];
//   const stylesObj = await db.one(query, params);
//   return stylesObj;
// };

exports.getStyles = async ({ id }) => { // using joins
  const query = `
  SELECT
    s.id,
    s.name,
    s.sale_price,
    s.original_price,
    s."default?",
    json_agg(json_build_object('thumbnail_url', p.thumbnail_url, 'url', p.url)) AS photos,
    json_object_agg(k.id, json_build_object('size', k.size, 'quantity', k.quantity)) AS skus
  FROM styles s
  JOIN photos p ON p.style_id = s.id
  JOIN skus k ON k.style_id = s.id
  WHERE s.product_id = $1
  GROUP BY s.id;
  `;

  const params = [id];
  const stylesObj = { product_id: id.toString() };
  stylesObj.results = await db.any(query, params);
  return stylesObj;
};

exports.getRelatedProducts = async ({ id }) => {
  const query = 'SELECT json_agg(related_product_id) AS related FROM related WHERE current_product_id = $1';
  const params = [id];
  const result = await db.one(query, params);
  return result.related;
};
