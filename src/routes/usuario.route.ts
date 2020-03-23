import {Request , Response , Router } from 'express';

import { v4 as uuid } from 'uuid'

import { UsuarioList } from '../classes/usuarioLista';
let ctrlUser = new UsuarioList();
export const router =Router();
import bycript from 'bcrypt'
import { Usuario } from '../classes/usuario';
router.post('/login' , async ( req : Request, res :Response)=>{
    let { name , password } =  req.body;
    let error = false;
    let user  = await  ctrlUser.loguinUsuario(name , password).catch( err =>{
      error = true;
      res.json(err);
    });
  
    if(error == false)
    res.json({ok : true  , user });
  });
  router.post('/register' , async ( req : Request, res :Response)=>{
    let { nombre , password  } =  req.body;
    //guardar bd
    let us = new Usuario('', uuid());
    us.nombre = nombre;
    us.password = await bycript.hashSync( password ,10); 
    let rpta :any =await ctrlUser.agregar(us);
    let user ;
    if(rpta != false){
    user = new Usuario();
    user.id = rpta.id;
    user.idBD = rpta.idBD;
    user.nombre = rpta.nombre;
    user.sala  = rpta.sala;
    console.log(user);
    res.json({ok : true  , rpta :user});
  }else{
    res.json( { ok : true , rpta});
  }
});


export default router;