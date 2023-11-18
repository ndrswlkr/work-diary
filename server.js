import mojo from '@mojojs/core'

const app = mojo()
app.static.publicPaths.push(app.home.child('dist').toString())
app.static.prefix = ''

app.get('/', async ctx => {
  await ctx.sendFile(ctx.home.child('dist', 'index.html'))
})

app.get('/api/test', async ctx => {
  const data = { name: 'ndrs', lastname: 'wlkr' }
  await ctx.render({ json: data })
})

app.get('/api/is-authenticated', async ctx => {
  await ctx.render({ json: { authenticated: false } })
})

app.start()
