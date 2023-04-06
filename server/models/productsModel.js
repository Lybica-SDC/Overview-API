const { Client } = require('pg');

async function testFunc() {
  const client = new Client({
    host: 'postgresql://localhost:5432',
  });
  await client.connect();

  const res = await client.query('SELECT $1::text as message', ['Hello world!']);
  console.log(res.rows[0].message);
  await client.end();
}

testFunc();
