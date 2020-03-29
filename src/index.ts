import Server from './classes/server';
 
const server = Server.instance;
import { create } from './bd'

server.start(async ()=>{
    await create()
 console.log('listen on port: ' + server.port);
});