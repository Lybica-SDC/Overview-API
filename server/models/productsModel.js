import pkg from 'pg';

const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'johnathansimeroth',
});
await client.connect();

const res = await client.query('SELECT $1::text as message', ['Hello world!']);
console.log(res.rows[0].message);
await client.end();