import crypto from 'crypto'
import {cacheSet, cacheGet} from '../index.js'

async function createAndSaveSecretKey(user) {
  const token = 'token:' + await getRandomBytes()
  const toSave = {
    userId: user.id,
    timestamp: Date.now()
  }
  await cacheSet(token, JSON.stringify(toSave))
  return token
}

function getRandomBytes(numBytes = 48) {
  return new Promise((resolve, reject) => {
    try {
      crypto.randomBytes(numBytes, (err, buff) => {
        if (err) {
          reject(err)
        } else {
          resolve(buff.toString('hex'))
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

async function getUserIdFromToken(token) {
  try {
    const res = await cacheGet(token)
    if (res) {
      const json = JSON.parse(res)
      return json.userId ?? null
    } else {
      return null
    }
  } catch (e) {
    console.log(e)
    return null
  }
}

export {
  createAndSaveSecretKey,
  getRandomBytes,
  getUserIdFromToken,
}
