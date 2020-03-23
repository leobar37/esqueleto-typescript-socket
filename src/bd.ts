import  lowdb from 'lowdb'
import FileAsync from "lowdb/adapters/FileAsync"
import { Isuario, Ichat, Imensaje, Iconversacion, isms } from './models/interfaces';
import { Usuario } from './classes/usuario';
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
/*=============================================
=            usuario            =
=============================================*/
let collection = 'users'; 
let chatCollec = 'chats';
let converCollec = 'conversaciones';
export const  agregarUsuario =async ( data: Usuario)=>{
   //verifica si existe un usuario con el mismo nombre
   let usuario = await db.get(collection).find({ nombre : data.nombre }).value();
   //si existe
    if(usuario != undefined){
        return  null;
    }else{
        //agregar
        await  db.get(collection).push(data).write();
        //  data.password = ':)';
        let chat :Ichat = {
            userId: data.idBD,
            conversaciones : []
            // conversaciones
        }
        await db.get(chatCollec).push(chat).write();
    //    let tmp =  data;
    //    tmp.password = ':0';
        return  data;
    }
}

export const actualizarUsuario = async (idbd:string , id:string)=>{
    //actualiza al usuario con su id de sesion
    await db.get(collection).find({idBD : idbd}).assign( {id : id}).write();
}

export const retornaUsuario = async (idbase:string)=>{
    let user = await db.get(collection).find({idBD :idbase }).value();
    return user;
}

export const eliminarSesion = async ( idn :string)=>{
    //   let user = await db.get(collection).find({idBD :idbase }).value();
    await db.get(collection).find({id : idn}).assign( {id : ''}).write();
    
}

export const getUsuarios = async ()=>{
   let usuarios =  await  db.get(collection).value();
  return usuarios;
}
export const verificarUsuario = async ( nombre:string )=>{
    let user = await db.get(collection).find({nombre :nombre }).value();

    return user;
}
export const getConnection = async () => await db;
/*=============================================
=            mensajes            =
=============================================*/
export const enviarMensaje = async  (idUser:string ,idbDestino :string , msj : Imensaje)=>{
//generales

let idConversacion:string;
let tmpIchat : Ichat;    
let chats :Ichat  = await db.get(chatCollec).find({userId : idUser}).value();
let conver  = chats?.conversaciones;
let tmpConver;
for (const conversacion of conver || []) {
    if(conversacion.idestino == idbDestino){
        tmpConver = conversacion;
        break;
    } 
}
//si ay una conversacion
let  tmpmsj: Imensaje[]=[];  
if(tmpConver || tmpConver != undefined){
    //buscar converdacion   
 let chatConver : Iconversacion=await db.get(converCollec).find({ idConversacion  : tmpConver.idConver}).value();
 //existe conversacion 
  if(chatConver || chatConver != undefined){

    if(chatConver?.mensajes != undefined){
        tmpmsj  = chatConver.mensajes; 
     }
      tmpmsj.push( msj);
      await db.get(converCollec).find({ idConversacion  : tmpConver.idConver}).assign({ mensajes : tmpmsj}).write(); 
      idConversacion = chatConver.idConversacion || 'no-existe';
        //modificar el chat del receptor
        await modificarDestino(idbDestino , chats.userId || '', idConversacion);
       await modificarChat(chats, idbDestino , idConversacion);
      return idConversacion;
  }
}else{
        //crear la conversacion
    //no existe la conversacion      
    tmpmsj.push( msj);
    idConversacion = `${uuid()}conversacion`
    let converg : Iconversacion ={
        idConversacion : idConversacion ,
        mensajes : tmpmsj
    }
    await db.get(converCollec).push(converg).write();
    //modificar el chat del receptor
    await modificarDestino(idbDestino , chats.userId || '', idConversacion);
    //no existe un chat con esa persona
    await modificarChat(chats, idbDestino , idConversacion);
    return idConversacion;
    }
}
//fin
export const buscarConversacion = async (idConver :string)=>{
 let conversacion =await db.get(converCollec).find({idConversacion : idConver } ).value(); 
 return conversacion; 
}
//modifica el chat con la nueva conversacion
export const modificarChat =async (ichat:Ichat, destino :string, idconversacion :string)=>{
//    let chat :Ichat = await db.get(chatCollec).find( {userId : idChat}).value();    
   let conver  = ichat.conversaciones;
   if(!conver){
     conver = [{
         idestino : destino,
        idConver: idconversacion
     }];
     await db.get(chatCollec).find( {userId : ichat.userId}).assign( {conversaciones : conver}).write();
   return;
   }
   let tmpConver;
   for (const conversacion of conver || []) {
       if(conversacion.idestino == destino){
           tmpConver = conversacion;
           tmpConver.idConver = idconversacion;
           break;
       } 
   }
   if(!tmpConver){
    conver.push({
        idestino : destino,
       idConver: idconversacion
    });
       await db.get(chatCollec).find( {userId : ichat.userId}).assign( {conversaciones : conver}).write();
   }

}
//modifica los chat del destino agregandole la conversacion en comun
export const modificarDestino = async (idDestino: string, idRemitente :string , idConversacion:string)=>{
    let ichat:Ichat  =await db.get(chatCollec).find({userId : idDestino } ).value();     
    let conver  = ichat.conversaciones || [];
    //si las conversaciones estan vacias
    if(conver.length === 0){
 
      conver = [{
          idestino :idRemitente,
         idConver: idConversacion
      }];
      await db.get(chatCollec).find( {userId : ichat.userId}).assign( {conversaciones : conver}).write();
    return;
    }
    //verificar si la conversacion no existe
    let bander = false;
    for (const conversacion of conver || []) {
        if(conversacion.idestino == idRemitente){
           //encontro la conversacion
            bander = true;
            break;
        } 
    }
   if(bander == false){
      //no existe tal conversacion 

       conver.push({
        idestino :idRemitente,
       idConver: idConversacion
       })
       await db.get(chatCollec).find( {userId : ichat.userId}).assign( {conversaciones : conver}).write();
   }
    
}
// export const agregarMensaje = async ( idbd :string , mensaje :Imensaje)=>{
// let chats :Ichat  = await db.get(chatCollec).find({userId : idbd}).value();
// let msjs : Imensaje[]= [];
// if(chats?.mensajes != undefined){
//     msjs=  chats.mensajes; 
// }
// msjs.push(mensaje);
// await db.get(chatCollec).find({userId : idbd}).assign({ mensajes : msjs}).write();
// return chats;
// }

// export const getMsjs = async (idbd :string)=>{
//     let chats :Ichat = await db.get(chatCollec).find({userId : idbd}).value();
//     console.log('imprimiendo chat');
    
//     let msjs : Imensaje[]= [];
//     if(chats?.mensajes != undefined){
//         msjs=  chats.mensajes; 
//     }
    
//  return msjs;

// }





