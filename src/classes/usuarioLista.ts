import { Usuario } from "./usuario";
import { agregarUsuario, actualizarUsuario, retornaUsuario, eliminarSesion, getUsuarios, verificarUsuario } from '../bd';
import bycript from 'bcrypt';
import { Isuario, IUsuarioFro } from '../models/interfaces';
export class UsuarioList {
  private lista: Usuario[] = [];
  constructor() {}

  public async agregar(usuario: Usuario)  {
     let user = await agregarUsuario(usuario);
     if(user){
       return user;
     }else{
       return false;
     }
  
  }
//darle un id de sesion a un usuario
    public async otorgarSesion(id: string, idbd:string) {
      await actualizarUsuario( idbd ,id);
    }
    public getLista() {
      return this.lista;
    }
    public async getUsuario(id: string) {
      
      let user = await retornaUsuario(id); 
      return user;
    }
    //obtener usuarios por sala
    public getUsuariosxSala(sala: string) {
      return this.lista.filter(us => us.sala == sala);
    }
  //borrar usuario
  public async borrarUsuario(idbd: string) {    
      await eliminarSesion(idbd);
  }
  public async listarUsuarios(){
    let usuarios =  await getUsuarios();
   return usuarios;
  }
  public loguinUsuario( nombre :string , password :string){
     return new Promise( async ( resolve , reject)=>{
         let user :IUsuarioFro  = await verificarUsuario(nombre);
         let rpta  =  await bycript.compareSync(password , user.password || '');
         if(rpta){
            resolve(user)
          }else{
             reject({ ok: false})
          }
    });
  }
}
