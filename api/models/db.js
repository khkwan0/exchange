import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()
const {Pool} = pg

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD
})

async function doQuery(queryString, params) {
  try {
    const client = await pool.connect()
    const res = await client.query(queryString, params)
    client.release()
    return res
  } catch (e) {
    throw new Error(e)
  }
}

export {
  doQuery,
}
