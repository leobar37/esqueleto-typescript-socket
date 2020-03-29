
import express from 'express';
import { PORT_SERVER } from '../globals/enviroment';
import  morgan from 'morgan'
import  { router}  from '../routes/index';
import cors from 'cors';
import http from 'http';
import socketIo from 'socket.io';
import  * as socket from '../sockets/socket'
export default class Server {
    private static _instance : Server;
    public app : express.Application;
    public port : number;
    public serveHttp : http.Server;
    public io: SocketIO.Server;
   private constructor (){
        this.app = express();
        this.port = PORT_SERVER;
        this.confiExpres();
        this.serveHttp = new http.Server( this.app);
        this.io = socketIo(this.serveHttp);
        this.escucharSockets();
    }
     public static  get instance(){ return   this._instance || ( this._instance = new Server());}
     private confiExpres(){
        //middlewares
        this.app.use(morgan('dev'));
        this.app.use(express.urlencoded({ extended : false}));
        this.app.use(express.json());
        this.app.use(cors( { origin : true , credentials : true}));
        //rutas
        
        this.app.use( router);
    }
    private escucharSockets(){
         this.io.on('connection' ,  cliente   =>{            
            //conectar client
            socket.conectarCliente(cliente);
            //flujo de mensajes
           //desconeccion de los sockets
            socket.desconectar(cliente); 
         })
    }
   start(resolve :any){
      this.serveHttp.listen( this.port , resolve );   
   }   

} 


