import { Request, Response } from "express";
import { EntityRepository, Repository, getRepository, DeleteResult } from "typeorm";
import { User } from "../models/user.model";
import { validate } from "class-validator";


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
     * Crear Usuario
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof UserController
     */
    public async createUser(req: Request, res: Response) {

        let { email, password, fullName, phone, address } = req.body;
        
        let userRepo = getRepository(User);

        
        let newUser = new User();

        newUser.email = email;
        newUser.password = password;
        newUser.fullName = fullName;
        newUser.phone = phone;
        newUser.address = address;
        
        

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

        await userRepo.save(newUser)
            .then(async (userCreated: User) => {

                if (!userCreated) {
                    return res.status(409).json({
                            ok: false,
                            message: "No se pudo crear el usuario"
                        });
                }

                res.status(201).json({
                        ok: true,
                        user: userCreated
                    });

            }).catch((err: Error) => {

                return res.status(500).json({
                        ok: false,
                        message: "Error al crear el usuario",
                        error: err.message
                    });

            });
    }

	/**
     * Consultar por ID
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof UserController
     */
    public async showUser(req: Request, res: Response) {

        const userId: number = Number(req.params.id);

        let userRepo = getRepository(User);

        await userRepo.findOne({id: userId},{relations: ["sales"]})
            .then((user: User | undefined) => {

                if (!user || user === undefined) {
                    return res.status(404).json({
                            ok: false,
                            error: `No se encontró un usuario para el id ${userId}`
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

        let userId: number = Number(req.params.id);
        let { email, password, fullName, address, phone } = req.body;

        let userRepo = getRepository(User);

        await userRepo.findOne({id: userId})
            .then(async (user: User | undefined) => {

                if (!user) {
                    return res.status(404).json({
                            ok: false,
                            message: `No se encontró usuario con el id: ${userId}`
                        });
                }

                user.email = email;
                user.password = password;
                user.fullName = fullName;
                user.address = address;
                user.phone = phone;


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

                await userRepo.save(user)
                    .then((userUpdate: User) => {

                        if (!userUpdate) {

                            return res.status(409).json({
                                    ok: false,
                                    message: "No se pudo actualizar el usuario",
                                });

                        }

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

        const userId: number = Number(req.params.id);

        let userRepo = getRepository(User);

        
        await userRepo.findOne({id: userId})
        .then(async (userDelete: User | undefined) => {
                        
            if (!userDelete || userDelete === undefined) {
                return res.status(404).json({
                    ok: false,
                    message: `No se encontró usuario con el id: ${userId}`
                });
            }

            // /******** Validaciones **********/
            // let regInci = await getRepository(Incidence).count({ userId : userId })
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
                await userRepo.softDelete({ id: userId })
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

    
}
