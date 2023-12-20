import {doQuery} from '../lib/index.js'


const getUserByEmail = async email => {
  try {
    const res = await doQuery('select * from users where email=$1', [email])
    return res?.rows ?? []
  } catch (e) {
    console.log(e)
    return null
  }
}

const register = async (email, hash) => {
  try {
    const res = await doQuery('insert into users(email, password) values($1, $2)', [email, hash])
    return res
  } catch (e) {
    throw new Error(e)
  }
}

export {
  getUserByEmail,
  register,
}
