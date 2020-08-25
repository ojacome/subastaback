import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SEED } from '../global/environment';




//  middleware para verificar token
export const verificaToken = (req: Request, res: Response, next: NextFunction) => {

  //obtener el token por la url ?token=...
  //let token = req.query.token
  // por el header 
   //let token = req.headers.authorization?.replace('Bearer ', ''); 
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'Falta Token de autorización',
    });
  }
  token = token.replace('Bearer ', '');

  // decoded contiene payload del usuario que genero el token
  /* * "decoded": {
       "userToken": {
         "id": 25,
         "user_name": "josue",
         "password": ":("
     },
     "iat": 1585417834,
     "exp": 1585432234
     }
*/
  //Verificar el token enviado desde el front
  jwt.verify(token, SEED, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        message: 'Token incorrecto',
        error: err
      });
    }
    // ahora el payload (la info del usuario que genero el token, usuario logueado ) se agrega al request para que este disponible en cada peticion
    req.userToken = decoded.userToken;
    // console.log(req.userToken)
    next(); //continuar con proxima peticion
  });

}


//  middleware para verificar SuperAdmin
export const verificaSuperAdmin = (req: Request, res: Response, next: NextFunction) => {

    let usuario: any = req.userToken; //usuario agregado al request en el middleware verificaToken
 
    if (usuario.isAdmin === true){
      next();
    }else {
 
     return res.status(403).json({
       ok: false,
       message: 'Token incorrecto',
       errors: { message: 'No autorizado'}
     });
 
    }
 
 }