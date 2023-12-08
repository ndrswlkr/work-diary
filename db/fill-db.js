import Path from '@mojojs/path'
import Database from 'better-sqlite3'
import { epoc_date } from '../src/lib/diary_functions.js'
let data = await Path.currentFile().sibling( "data", "workdata.json").readFile('utf8')
let entrys = JSON.parse(data)
console.log(entrys[0].work)
//app
let db
//db
try {
    // Use connect method to connect to the server  
  
    //debug sqlite
 
    async function openDB () {
      const m = new Path("migrations/001-initial.sql")
      const migration = await m.readFile('utf8')
      console.log(migration)
      const d = new Path('work-diary.db')
      const db = new Database(d.toString())
      db.pragma('journal_mode = WAL')
      db.exec(migration)
      return db
    }
    //conect sqlite
    db = await openDB()
    console.log('Connected successfully to sqlite')
 

} catch (e) {
  console.log(e)
}

const stmt = db.prepare("insert into workdiary (work, date, duration, done) values (?, ?, ?, ?)")

entrys.map( async (e) =>{

    stmt.run([e.work,  epoc_date(e.date), e.duration, e.done ? 1 : 0])
    
    
})

 

//await app.client.close()