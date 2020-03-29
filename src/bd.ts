import  lowdb from 'lowdb'
import FileAsync from "lowdb/adapters/FileAsync"
import { v4  as uuid} from 'uuid';
import _ from 'underscore';
let db  :any;
export const create  = async ()=>{
    const adapter  = new FileAsync("db.json");
     db = await lowdb(adapter);
     db.defaults({
         users : [],
         chats : [],
         conversaciones :[]
    }).write();
}

