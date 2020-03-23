import {Request , Response , Router } from 'express';
import Server from '../classes/server';
import { enviarMensaje, buscarConversacion } from '../bd';
import { mensaje } from '../sockets/socket';
import { Imensaje } from '../models/interfaces';
import { UsuarioList } from '../classes/usuarioLista';
import { Usuario } from '../classes/usuario';
const ctrlUsuarios =  new UsuarioList();
export const router =Router();
router.get('/mensajes' , ( req : Request , res : Response )=>{
    
    res.json( { ok : true })
    
});
router.post('/mensaje/:id' ,async ( req : Request , res : Response )=>{
    const { de ,  para , mensaje }  = req.body;
    const { id } = req.params;
    //emitir mensaje    
    const server = Server.instance;
    let msj:Imensaje= {
      de :de,
       para : para,
       mensaje :mensaje
    }
    //buscar si existe la conversacion con el destinatario
   let recibido :boolean = false;
   let destinatario :Usuario = await ctrlUsuarios.getUsuario(id);
   if(destinatario){
    let conversacion = await enviarMensaje( de , destinatario.idBD || '' , msj);  
   if(destinatario.id && destinatario.id.length > 0){
  
        server.io.in(destinatario.id).emit('mensaje-privado' , { mensaje : true , conversacion}); 
     recibido =  true;
    }
    res.json( { ok : true , conversacion , recibido});
    } 

//    let  chats =  await agregarMensaje(id , msj);

});

router.get('/mensaje/:id' , async (req: Request, res :Response  )=>{
//devolver los mensajes nuevos 
const { id }  = req.params;
   let chats =await buscarConversacion(id);
   res.json({ chats});
});


export default router;