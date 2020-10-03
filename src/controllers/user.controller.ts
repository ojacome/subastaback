import { Request, Response } from "express";
import { EntityRepository, Repository, getRepository, DeleteResult } from "typeorm";
import { User } from "../models/user.model";
import { validate, isEmpty, isEmail } from "class-validator";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SEED, resetPassSEED, emailVerificationSEED } from "../global/environment";
import { send } from "process";
import { enviarCorreo, TipoCorreo } from "../helpers/sale.helper";

@EntityRepository(User)
export class UserController extends Repository<User>  {




	/**
     * Consultar todos los usuarios
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof UserController
     */
    public async indexUser(req: Request, res: Response) {

        await getRepository(User).find()
            .then((users: User[]) => {

                if (users.length === 0) {
                    return res.status(404).json({
                            ok: false,
                            message: 'No se encontraron registros'
                        })
                } else {
                    res.status(200).json({
                            ok: true,
                            users
                        })
                }

            })
            .catch((err: Error) => {
                return res.status(500).json({
                    ok: false,
                    message: "Error al obtener todos los usuarios",
                    error: err.message
                })
            });
    }

	/**
     * Crear Usuario y envio de token al email
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof UserController
     */
    public async createUser(req: Request, res: Response) {

        let { email, password, fullName } = req.body;                
        
        let newUser = new User();
        newUser.email = email;
        newUser.password = password;
        newUser.fullName = fullName;
        // newUser.isAdmin = true;
        
        
        //Validaciones
        const errorsUser = await validate(newUser);
        if (errorsUser.length > 0) {
            return res.status(400).json({
                ok: false,
                errors: {
                    validation: true,
                    error: errorsUser
                }
            })
        }

        //Crear token...
        let emailToken = jwt.sign({ newUser }, emailVerificationSEED, { expiresIn: '2h' }); 
        
        enviarCorreo(TipoCorreo.EmailVerification,newUser,emailToken);                        

        return res.status(200).json({
            ok: true,
            message: 'Te enviamos un enlace a tu correo para que puedas activar tu cuenta.',
            emailToken
        })
    }

    /** 
     * Metodo para activar la cuenta   
     *
     * @param {Request} req se espera token por parametro
     * @param {Response} res
     * @memberof UserController
     */
    public async accountActivation(req: Request, res: Response) {
        
        let token: any = req.params.token;
       
        //verifico si existe token
        jwt.verify(token, emailVerificationSEED, async (err: any, decoded: any) => {
            if (err) {
              return res.status(404).json({
                ok: false,
                message: 'Código incorrecto o ha caducado.',
                error: err
              });
            }

            // ahora obtengo validados del token
            let { newUser } = decoded

            let user = new User();
            user.fullName       = newUser.fullName;
            user.email          = newUser.email;       
            user.password       = newUser.password   
            
            //Validaciones
            const errorsUser = await validate(user);
            if (errorsUser.length > 0) {
                return res.status(400).json({
                    ok: false,
                    errors: {
                        validation: true,
                        error: errorsUser
                    }
                })
            }

            //encripto la contraseña
            user.password       = bcrypt.hashSync(newUser.password, 10);
                        
            
            let userRepository = getRepository(User);                            
            await userRepository.save(user)
                .then((userCreated: User) => {

                    if (!userCreated) {

                        return res.status(409).json({
                                ok: false,
                                message: "No se pudo crear la cuenta",
                            });

                    }

                    userCreated.password = ":("
                    console.log(userCreated);
                    
                    //Crear toquen...   {userToken: usuario} info agregada al payload, sera utilizada en el decoded en la verificacion del token
                    let token = jwt.sign({ userToken: userCreated }, SEED, { expiresIn: 14400 }); //14400 expira en 4h 

                    res.status(200).json({
                        ok: true,                        
                        token
                    })

                }).catch((err: Error) => {

                    return res.status(500).json({
                        ok: false,
                        message: "Error al guar usuario",
                        error: err.message
                    });
                });
        }); 
    }

   /**
    * Inicio de Sesion, envio token
    *
    * @param {Request} req
    * @param {Response} res
    * @memberof UserController
    */
   public async  loginPost  (req: Request, res: Response) {
       
		let email: string = req.body.email;
		let pass: string = req.body.password;
		

		let userRepository = getRepository(User);

		await userRepository.findOne({ 
            select: ["id", "email", "password", "fullName", "phone", "isAdmin", "address"], 
            where: { email: email } 
            })
			.then((usuario: User | undefined) => {


                //si entra es porque no está registrado 
				if (!usuario || usuario === undefined) {

					return res.status(400)
						.json({
							ok: false,
							message: 'Credenciales incorrectas.'
						});

				}

				if (!bcrypt.compareSync(pass, usuario.password)) {

					return res.status(400)
						.json({
							ok: false,
							message: 'Credenciales incorrectas'
						});

				}

				usuario.password = ":("; //enmascarar el password

                console.log(usuario);
                
				//Crear toquen...   {userToken: usuario} info agregada al payload, sera utilizada en el decoded en la verificacion del token
				let token = jwt.sign({ userToken: usuario }, SEED, { expiresIn: 14400 }); //14400 expira en 4h 

				res.status(200).json({
					ok: true,
					// user_login: usuario,
					token
				})

			}).catch((err: Error) => {

				return res.status(500).json({
					ok: false,
					mensaje: 'Error al iniciar sesión',
					error: err.message
				});

			})

	}

	/**
     * Consultar por ID
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof UserController
     */
    public async showUser(req: Request, res: Response) {        

        let usuario: any = req.userToken;
        let userRepo = getRepository(User);

        await userRepo.findOne({id: usuario.id},{relations: ["sales"]})
            .then((user: User | undefined) => {

                if (!user || user === undefined) {
                    return res.status(404).json({
                            ok: false,
                            message: `No se encontró un usuario para el id ${usuario.id}`
                        });
                }

                res.status(200).json({
                        ok: true,
                        user
                    });


            }).catch((err: Error) => {

                return res.status(500).json({
                        ok: false,
                        message: 'Error al buscar usuario',
                        error: err.message
                    })

            });
    }

	/**
     * Actualizar por ID
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof UserController
     */
    public async updateUser(req: Request, res: Response) {
        
        let usuario: any = req.userToken;
        let { fullName, address, phone } = req.body;

        let userRepo = getRepository(User);

        await userRepo.findOne({id: usuario.id},{select: ["id","fullName","email","password","phone","address","isAdmin"]})
            .then(async (user: User | undefined) => {

                if (!user) {
                    return res.status(404).json({
                            ok: false,
                            message: `No se encontró usuario con el id: ${usuario.id}`
                        });
                }
                // console.log(user)

                // user.email = user.email;
                // user.password = user.password;
                user.fullName = fullName;
                user.address = address;
                user.phone = phone;
                // user.isAdmin = user.isAdmin;


                //Validaciones
                const errorsUser = await validate(user);
        
                if (errorsUser.length > 0) {
                    return res.status(400).json({
                        ok: false,
                        errors: {
                            validation: true,
                            error: errorsUser
                        }
                    })
                }

                
                // encriptar constraseña
                // user.password = bcrypt.hashSync(password, 10);

                await userRepo.save(user)
                    .then((userUpdate: User) => {

                        if (!userUpdate) {

                            return res.status(409).json({
                                    ok: false,
                                    message: "No se pudo actualizar el usuario",
                                });

                        }

                        userUpdate.password = ":("

                        res.status(201).json({
                                ok: true,
                                user: userUpdate

                            })

                    }).catch((err: Error) => {

                        return res.status(500).json({
                                ok: false,
                                message: "Error al actualizar usuario",
                                error: err.message
                            });

                    });

            }).catch((err: Error) => {

                return res.status(500).json({
                        ok: false,
                        error: {
                            message: "Error al buscar usuario a actualizar",
                            error: err.message
                        }
                    });

            });

    }

	/**
     * Eliminar por ID
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof UserController
     */
    public async deleteUser(req: Request, res: Response) {

        const userIdparam: number = Number(req.params.id);
        let usuario: any = req.userToken;
        let userRepo = getRepository(User);

        
        await userRepo.findOne({id: usuario.id})
        .then(async (userDelete: User | undefined) => {
                        
            if (!userDelete || userDelete === undefined) {
                return res.status(404).json({
                    ok: false,
                    message: `No se encontró usuario con el id: ${usuario.id}`
                });
            }

            // /******** Validaciones **********/
            // let regInci = await getRepository(Incidence).count({ usuario.id : usuario.id })
            //     .then()
            //     .catch((err: Error) => {
            //         return res.status(500).json({
            //             ok: false,
            //             message: "Error al buscar CAC en incidencias ",
            //             error: err.message
            //         })
            //     });

            // if(!regInci){
            if(true){
                await userRepo.softDelete({ id: usuario.id })
                    .then((result: DeleteResult) => {

                        res.status(200).json({
                                ok: true,
                                message: 'Usuario eliminado',
                                user: userDelete
                            });

                    }).catch((err: Error) => {
                        return res.status(500).json({
                                ok: false,
                                message: 'Error al eliminar usuario',
                                error: err.message
                            })
                    })
            }else{
                return res.status(400).json({
                    ok: false,
                    message: 'El Usuario no puede ser eliminado porque se encuentra en uso.'
                });
            }

            }).catch((err: Error) => {
                return res.status(500).json({
                        ok: false,
                        message: 'Error al buscar usuario a eliminar',
                        error: err.message
                    })
            })
    }


    /**
     * Método que envia correo con el token para reestablecer contraseña
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof UserController
     */
    public async  forgotPassword  (req: Request, res: Response) {               
                        
		let email: string = req.body.email;		
		
		let userRepository = getRepository(User);

		await userRepository.findOne({  where: { email: email }  })
			.then((usuario: User | undefined) => {


                //si entra es porque no está registrado 
				if (!usuario || usuario === undefined) {

					return res.status(400)
						.json({
							ok: false,
							message: 'El correo no está registrado.'
						});

				}			
                
                
				//Crear toquen...   {id: usuario.id} info agregada al payload, sera utilizada en el decoded en la verificacion del token
				let token = jwt.sign({ id: usuario.id }, resetPassSEED, { expiresIn: 86400 }); //expira en 24h 

                let user = {
                    fullName: usuario.fullName,
                    email:  usuario.email,            
                    token
                }   
                // console.log(user)
                //enviar correo con enlace y token
                enviarCorreo(TipoCorreo.ForgotPassword, user)
                
				res.status(200).json({
					ok: true,					
					message: 'Te enviamos un enlace al correo electrónico para restablecer la contraseña.'
				})

			}).catch((err: Error) => {

				return res.status(500).json({
					ok: false,
					mensaje: 'Error al buscar usuario',
					error: err.message
				});

			})

    }


    /** 
     * Metodo que reestablece contraseña
     * recibe token y nueva contraseña
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof UserController
     */
    public async  resetPassword (req: Request, res: Response) {               
                        
        let token: any = req.params.token;
		let password: string = req.body.password;		
                
        //verifico si existe token
        jwt.verify(token, resetPassSEED, async (err: any, decoded: any) => {
            if (err) {
              return res.status(404).json({
                ok: false,
                message: 'Código incorrecto o ha caducado.',
                error: err
              });
            }

            // ahora obtengo el id del usuario del token
            let userId = decoded.id
            let userRepository = getRepository(User);

            await userRepository.findOne({
                select: ["fullName","password","id","email","isAdmin","phone","address"],
                where: {id: userId}  
                })
			.then(async (usuario: User | undefined) => {
                      
                if (!usuario) {
                    return res.status(404).json({
                            ok: false,
                            message: `No se encontró usuario con el id: ${userId}`
                        });
                }

                usuario.password = password

                //Validaciones para contraseña
                const errorsUser = await validate(usuario);
        
                if (errorsUser.length > 0) {
                    return res.status(400).json({
                        ok: false,
                        errors: {
                            validation: true,
                            error: errorsUser
                        }
                    })
                }

                //encriptar constraseña
                usuario.password = bcrypt.hashSync(password, 10);
                
                await userRepository.save(usuario)
                    .then((userUpdate: User) => {

                        if (!userUpdate) {

                            return res.status(409).json({
                                    ok: false,
                                    message: "No se pudo actualizar contraseña",
                                });

                        }

                        userUpdate.password = ":("

                        res.status(201).json({
                                ok: true,
                                user: userUpdate

                            })

                    }).catch((err: Error) => {

                        return res.status(500).json({
                                ok: false,
                                message: "Error al actualizar contraseña",
                                error: err.message
                            });

                    });				

			}).catch((err: Error) => {

				return res.status(500).json({
					ok: false,
					mensaje: 'Error al buscar usuario',
					error: err.message
				});

			})
          });          		
    }
    
    /**
     * Metodo para enviar correo de contacto
     *
     * @param {Request} req
     * @param {Response} res
     * @returns
     * @memberof UserController
     */
    public async  contact (req: Request, res: Response) {               
                                
		let {name, email, message, phone} = req.body;		
             
        

        //validaciones
        if(isEmpty(name) || isEmpty(email) || isEmpty(message) || isEmpty(phone)){
            return res.status(400).json({
                ok: false,
                message: 'Los campos nombre, telefono, email y el mensaje son requeridos.',            
            });    
        }

        if(!isEmail(email)){
            return res.status(400).json({
                ok: false,
                message: 'Ingrese un correo válido.'      
            });
        }
        
        try{

            let user = {
                name,
                email,
                message,
                phone
            }            
            
            enviarCorreo(TipoCorreo.Contact, user)
            
            return res.status(200).json({
                ok: false,
                message: 'Tu mensaje fue recibido por Fundación Fe y Acción. Tan pronto podamos nos pondremos en contacto. Gracias!',            
            });

        }catch(e){

            return res.status(500).json({
                ok: false,
                message: 'Ha ocurrido un error, inténtalo más tarde.',            
                error: e
            });
        }               		
	}
}
