export interface Isuario {
  id?:string,
  sala? :string,
  name ?:string, 
  password ?: string
}

export interface IUsuarioFro {
  id?:string,
  idBD :string,
  sala :string
   nombre? :string,
    password ?:string
 }
 export interface  Imensaje{
   de ?: string,
   para ?:string,
   mensaje ?:string,
   sala?:string,
   date ? :number,
   estado ? :boolean
 }
 export interface Ichat{
    userId? :string,
    conversaciones?:isms[]
 }
export interface  isms{
    idestino? :string,
    idConver?:string
}
 export interface Iconversacion{
   idConversacion ?:string,
   mensajes ?:Imensaje[]
 }