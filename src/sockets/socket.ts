import { Socket  , Server} from "socket.io";
export const  conectarCliente  =  (cliente :Socket)=>{
  

} 
export const desconectar  = (cliente : Socket)=>{
    cliente.on('disconnect', ()=>{
    })
}
