import Database from 'better-sqlite3'


export default function connect(path){ 
    try {
    //conect sqlite
    const db = new Database(path)
    db.pragma('journal_mode = WAL')
    console.log('Connected successfully to sqlite')
    return db
} catch (e) {
    console.log(e)
    return null
  }
  
}