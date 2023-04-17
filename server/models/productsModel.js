require('dotenv').config();
const pgp = require('pg-promise')();

const cn = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
};
console.log(cn);

// const cn = {
//   host: 'localhost',
//   port: 5432,
//   database: 'lybica',
//   user: 'johnathansimeroth',
// };

const db = pgp(cn);

exports.listProducts = ({ page = 1, count = 5 }) => {
  const query = 'SELECT * FROM products WHERE id > $1 ORDER BY id ASC LIMIT $2';
  const params = [(page - 1) * count, count];
  return db.any(query, params);
};

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

exports.getStyles = async ({ id }) => { // using joins
  const query = `
  SELECT
    s.id AS style_id,
    s.name,
    s.sale_price,
    s.original_price,
    s."default?",
    json_agg(json_build_object('thumbnail_url', p.thumbnail_url, 'url', p.url)) AS photos,
    (
      SELECT json_object_agg(k.id, json_build_object('size', k.size, 'quantity', k.quantity))
      FROM skus k
      WHERE k.style_id = s.id
    ) AS skus
  FROM styles s
  LEFT JOIN photos p ON p.style_id = s.id
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
