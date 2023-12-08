import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'

const saltRounds = 10
const invetationCodes = ['be-my-guest-00327', 'join-the-club-8818', 'get-in-77']

function createUuid () {
  return uuid()
}

export default function authPlugin (app) {
  
  app.addHelper('checkInvetationCode', async (ctx, invetationCode) => {
    if (!invetationCodes.find(elem => elem === invetationCode)) return false
    //else
    return true
  })

  app.addHelper('authenticated', async (ctx)=> {
    const session = await ctx.session()
    const stmt = ctx.models.db.prepare('SELECT * from users where username = ?')
    const reg = stmt.get(session.username)
    if (
      reg &&
      session &&
      session?.token !== null &&
      session.token === reg.token
    ) {
      return true
    }
    return false
  })

  app.addHelper('usernameAvailable', async (ctx, username) => {
    const stmt = ctx.models.db.prepare(
      'select count(*) as found from users where username = ?'
    )
    const res = stmt.get(username)

    console.log('found', res.found)
    if (res.found == 0) return true
    //else
    return false
  })

  app.addHelper('register', async (ctx, username, password) => {
    const session = await ctx.session()
    const hash = await bcrypt.hash(password, saltRounds)
    try {
      const token = uuid()

      const stmt = ctx.models.db.prepare(
        'INSERT INTO users (username, hash, token) VALUES  (?, ?, ?)'
      )
      const succ = stmt.run([username, hash, token])
      console.log(succ)
      session.username = username
      session.token = token
      return token
    } catch (e) {
      throw new Error('error creating new user ' + e.message)
    }
  })

  app.addHelper('verifiy', async (ctx, username, password) => {
    const session = await ctx.session()
    const stmt = ctx.models.db.prepare(
      'SELECT hash from users where username = ?'
    )
    const reg = stmt.get(username)
    if (!reg) return false

    const verified = await bcrypt.compare(password, reg.hash)
    if (verified) {
      console.log('verified')
      const token = uuid()

      const stmt = ctx.models.db.prepare(
        'update users set token = ? where username = ?'
      )
      const success = stmt.run([token, username])
      console.log('success', success)
      if (!success.changes) {
        return { success: false }
      }
      session.token = token
      session.username = username
      session.maxAge = 3600
      //await ctx.res.setCookie('user', username, {maxAge: 3600, path: '/', secure: true, sameSite: 'strict'});

      return { success: true, token, username }
    }
    return { success: false }
  })

  app.addHelper('logout', async ctx => {
    const session = await ctx.session()
    const username = session.username
    const stmt = ctx.models.db.prepare(
      'update users set token = ? where username = ?'
    )

    stmt.run([null, session.username])

    session.expires = 1
    await ctx.res.setCookie('user', 'nobody', { maxAge: 0 })
  })
}
