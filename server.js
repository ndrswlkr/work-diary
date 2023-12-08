import mojo from '@mojojs/core'
import authPlugin from './server/plugins/authentication.js'
import connect from './db/connect.js'

const app = mojo()

function serverSetup () {
  app.static.publicPaths.push(app.home.child('dist').toString())
  app.static.prefix = ''
  //session
  app.session.cookieName = 'mojo-session'
  app.session.sameSite = 'strict'
  //plugins
  app.plugin(authPlugin)
  //db
  app.models.db = connect(app.home.child('db', 'work-diary.db').toString())
}

serverSetup()

//auth-routes
app.post('/api/register', async ctx => {
  const params = await ctx.req.json()
  const invetationCode = params.invetationCode
  const username = params.uname
  const password = params.psw
  if (!(await ctx.usernameAvailable(username)))
    return await ctx.render({
      json: { success: false, message: 'this username allready exists' }
    })

  if (!(await ctx.checkInvetationCode(invetationCode)))
    return await ctx.render({
      json: { success: false, message: 'this invetation code is not valid' }
    })

  try {
    const token = await ctx.register(username, password)
    await ctx.render({ json: { success: true, username } })
  } catch (e) {
    await ctx.render({ json: { success: false, message: e.message } })
  }
})

app.post('/api/login', async ctx => {
  const params = await ctx.req.json()
  const username = params.uname
  const password = params.psw
  const res = await ctx.verifiy(username, password)
  if (res.success) {
    return await ctx.render({
      json: { success: true, token: res.token, username: res.username }
    })
  } else {
    return await ctx.render({ json: { success: false } })
  }
})

app.get('/api/logout', async ctx => {
  await ctx.logout()
  await ctx.render({ json: { success: true } })
})

app.get('/api/is-authenticated', async ctx => {
  const auth = await ctx.authenticated()
  await ctx.render({ json: { authenticated: auth } })
})

//serve the frontend
app.get('/', async ctx => {
  await ctx.sendFile(ctx.home.child('dist', 'index.html'))
})

//protect
const auth = app.router.under('/api', async ctx => {
  console.log('auth test hit')
  if (await ctx.authenticated()) {
    return
  }
  return await ctx.res.status(401).type('text/html').send('Hello World!')
})

auth.post('/workdata', async ctx => {
  const params = await ctx.req.json()
  const dateMin = Number(new Date(params.year, 0, 1))
  const dateMax = Number(new Date(params.year, 11, 31))
  const stmt = ctx.models.db.prepare('select * from workdiary where date > ? and date < ? order by date desc')
  const data = stmt.all(dateMin, dateMax)

  await ctx.render({ json: data })
})

auth.post('/save', async ctx => {
  const params = await ctx.req.json()
  const stmt = ctx.models.db.prepare(
    'insert into workdiary  (work, date, done, duration, image) values (?,?,?,?,?)'
  )
  const result = stmt.run(
    params.work,
    params.date,
    params.done,
    params.duration,
    params.image
  )
  console.log(result)
  if (result.changes) {
    const newstmt = ctx.models.db.prepare("select * from workdiary where id=?")
    const data = newstmt.get(result.lastInsertRowid)
    return await ctx.render({ json: { success: true, item: data } })
  }
  return await ctx.render({ json: { success: false } })
})

auth.post('/update', async ctx => {
  const params = await ctx.req.json()
  const stmt = ctx.models.db.prepare(
    'update workdiary set work=?, date=?, done=?, duration=?, image=? where id=?'
  )
  const result = stmt.run(
    params.work,
    params.date,
    params.done,
    params.duration,
    params.image,
    params.id
  )
  if (result.changes) return await ctx.render({ json: { success: true } })
  return await ctx.render({ json: { success: false } })
})

auth.post('/update-done', async ctx => {
  const params = await ctx.req.json()
  const stmt = ctx.models.db.prepare(
    'update workdiary set done=? where id=?'
  )
  const result = stmt.run(
    params.done,
    params.id
  )
  if (result.changes) return await ctx.render({ json: { success: true } })
  return await ctx.render({ json: { success: false } })
})

auth.post('/delete', async ctx => {
  const params = await ctx.req.json()
  const id = params.id
  if (!id) return await ctx.render({json:{success: false}})
  const stmt = ctx.models.db.prepare("delete from workdiary where id=?")
  const res = stmt.run(id)
  console.log("delete", res)
  if(res.changes)
    return await ctx.render({json:{success: true}})
  if(!res.changes)
    return await ctx.render({json:{success: false}})
})

//hooks
app.addAppHook('server:stop', async app => {
  console.log('closing db connection')
  await app.models.db.close()
})

app.start()
