import { Request, Response } from "express";
import { EntityRepository, Repository, getRepository, DeleteResult } from "typeorm";
import { Sale, Status } from "../models/sale.model";
import { User } from "../models/user.model";
import { Product } from "../models/product.model";
import { validate } from "class-validator";
import { isOferta } from "../helpers/sale.helper";
import { Correo } from "../helpers/send_email.helper";


@EntityRepository(Sale)
export class SaleController extends Repository<Sale>  {




	/**
     * Consultar las subastas en status disponibles
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof SaleController
     */
    public async indexSale(req: Request, res: Response) {

        await getRepository(Sale).find({
            where: { status: Status.Disponible },
            relations: ["user", "product"]
            })
            .then((sales: Sale[]) => {

                if (sales.length === 0) {
                    return res.status(404).json({
                        ok: false,
                        message: 'No se encontraron registros'
                    })
                } else {
                    res.status(200).json({
                        ok: true,
                        sales
                    })
                }

            })
            .catch((err: Error) => {
                return res.status(500).json({
                    ok: false,
                    message: "Error al obtener todas las subastas",
                    error: err.message
                })
            });
    }	

    /**
     * Consulta las subasta para Usuario
     * debe indicar el status por parametro
     * 
     *
     * @param {Request} req
     * @param {Response} res
     * @returns
     * @memberof SaleController
     */
    public async indexSalexStatusUser(req: Request, res: Response) {
                
        const status: any = req.params.status;        
        const usuario: any = req.userToken;
        
        let user: any = await getRepository(User).findOne({ id: usuario.id });
        if (!user || user === undefined) {

            return res.status(404).json({
                ok: false,
                message: `No se encontró un Usuario para el id: ${usuario.id}`,
            });
        }

        await getRepository(Sale).find({
            where: { status: status, user: user},
            relations: ["user", "product"]
            })
            .then((sales: Sale[]) => {                                                                 
                                
                //repuesta puede ser cero registros pero necesito que llegué así el dato
                res.status(200).json({
                    ok: true,
                    sales
                })                
            })
            .catch((err: Error) => {
                return res.status(500).json({
                    ok: false,
                    message: "Error al obtener todas las subastas",
                    error: err.message
                })
            });
    }

    /**
     * Consultar las subastas para administrador
     * debe indicar el status
     * si trae con ofertas (s) o sin ofertas(n)
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof SaleController
     */
    public async indexSalexStatus(req: Request, res: Response) {
        
        const status: any = req.params.status;
        const withUser: any = req.params.user;

        await getRepository(Sale).find({
            where: { status: status },
            relations: ["user", "product"]
            })
            .then((sales: Sale[]) => {

                if (sales.length === 0) {
                    return res.status(404).json({
                        ok: false,
                        message: 'No se encontraron registros'
                    })
                }                  
                
                if(withUser==='s'){ sales = sales.filter( sales => sales.user) }
                else { sales = sales.filter( sales => !sales.user) }
                                    
                res.status(200).json({
                    ok: true,
                    sales
                })                
            })
            .catch((err: Error) => {
                return res.status(500).json({
                    ok: false,
                    message: "Error al obtener todas las subastas",
                    error: err.message
                })
            });
    }

	/**
     * Consultar subasta status disponible por ID
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof SaleController
     */
    public async showSale(req: Request, res: Response) {

        const saleId: number = Number(req.params.id);

        let saleRepo = getRepository(Sale);

        await saleRepo.findOne({ id: saleId, status: Status.Disponible }, { relations: ["user", "product"] })
            .then((sale: Sale | undefined) => {

                if (!sale || sale === undefined) {
                    return res.status(404).json({
                        ok: false,
                        message: `No se encontró una subasta para el id ${saleId}`
                    });
                }

                res.status(200).json({
                    ok: true,
                    sale
                });


            }).catch((err: Error) => {

                return res.status(500).json({
                    ok: false,
                    message: 'Error al buscar la subasta',
                    error: err.message
                })

            });
    }

	/**
     * Actualizar con nueva oferta por ID
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof SaleController
     */
    public async updateSale(req: Request, res: Response) {

        let saleId: number = Number(req.params.id);
        let { total } = req.body;

        let usuario: any = req.userToken;

        let userRepo = getRepository(User);
        let user: any = await userRepo.findOne({ id: usuario.id });
        if (!user || user === undefined) {

            return res.status(404).json({
                ok: false,
                message: `No se encontró un Usuario para el id: ${usuario.id}`,
            });
        }

        let saleRepo = getRepository(Sale);

        //se hace triple validacion para que sea el usuario, subasta y mismo producto a actualizar
        await saleRepo.findOne({ id: saleId }, {relations: ["product", "user"]})
            .then(async (sale: Sale | undefined) => {

                if (!sale) {
                    return res.status(404).json({
                        ok: false,
                        message: `No se encontró subasta con el id: ${saleId}`
                    });
                }

                
                
                if(!isOferta(sale, Number(total))){

                    return res.status(400).json({
                        ok: false,
                        message: "Tu oferta no ha sido aceptada.",
                    });
                }

                sale.total = parseFloat(total);
                sale.user = user;
                

                //Validaciones
                const errorsSale = await validate(sale);

                if (errorsSale.length > 0) {
                    return res.status(400).json({
                        ok: false,
                        errors: {
                            validation: true,
                            error: errorsSale
                        }
                    })
                }

                await saleRepo.save(sale)
                    .then((saleUpdate: Sale) => {

                        if (!saleUpdate) {

                            return res.status(409).json({
                                ok: false,
                                message: "No se pudo actualizar la subasta",
                            });

                        }

                        res.status(201).json({
                            ok: true,
                            sale: saleUpdate,
                            message: 'Tu oferta fué ingresada, espera el correo de confirmación o puedes mejorar la oferta :)'

                        })

                    }).catch((err: Error) => {

                        return res.status(500).json({
                            ok: false,
                            message: "Error al actualizar la subasta",
                            error: err.message
                        });

                    });

            }).catch((err: Error) => {

                return res.status(500).json({
                    ok: false,
                    error: {
                        message: "Error al buscar subasta a actualizar",
                        error: err.message
                    }
                });

            });

    }

    /**
     * Actualizar por ID status pagado
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof SaleController
     */
    public async updatePaySale(req: Request, res: Response) {

        let saleId: number = Number(req.params.id);        

        let usuario: any = req.userToken;

        let userRepo = getRepository(User);
        let user: any = await userRepo.findOne({ id: usuario.id });
        if (!user || user === undefined) {

            return res.status(404).json({
                ok: false,
                message: `No se encontró un Usuario para el id: ${usuario.id}`,
            });
        }

        let saleRepo = getRepository(Sale);

        //se hace triple validacion para que sea el usuario, subasta y mismo producto a actualizar
        await saleRepo.findOne({ id: saleId, user: user }, {relations: ["product", "user"]})
            .then(async (sale: Sale | undefined) => {

                if (!sale) {
                    return res.status(404).json({
                        ok: false,
                        message: `No se encontró subasta con el id: ${saleId}`
                    });
                }

                sale.total = sale.total;
                sale.status = Status.Pagado;
                sale.product = sale.product;
                sale.user = sale.user;


                //Validaciones
                const errorsSale = await validate(sale);

                if (errorsSale.length > 0) {
                    return res.status(400).json({
                        ok: false,
                        errors: {
                            validation: true,
                            error: errorsSale
                        }
                    })
                }

                await saleRepo.save(sale)
                    .then((saleUpdate: Sale) => {

                        if (!saleUpdate) {

                            return res.status(409).json({
                                ok: false,
                                message: "No se pudo actualizar la subasta",
                            });

                        }
                        
                        
                        //Notificar al administrador para que se ponga en contacto
                        Correo.sendCorreoPagado(saleUpdate.user, saleUpdate.product)


                        res.status(201).json({
                            ok: true,
                            sale: saleUpdate

                        })

                    }).catch((err: Error) => {

                        return res.status(500).json({
                            ok: false,
                            message: "Error al actualizar la subasta",
                            error: err.message
                        });

                    });

            }).catch((err: Error) => {

                return res.status(500).json({
                    ok: false,
                    error: {
                        message: "Error al buscar subasta a actualizar",
                        error: err.message
                    }
                });

            });

    }

    /**
     * Actualizar por ID status finalizado
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof SaleController
     */
    public async updateFinalizadoSale(req: Request, res: Response) {

        let saleId: number = Number(req.params.id);                
        let { status } = req.body
        
        let saleRepo = getRepository(Sale);

        //se hace triple validacion para que sea el usuario, subasta y mismo producto a actualizar
        await saleRepo.findOne({ id: saleId }, {relations: ["product", "user"]})
            .then(async (sale: Sale | undefined) => {

                if (!sale) {
                    return res.status(404).json({
                        ok: false,
                        message: `No se encontró subasta con el id: ${saleId}`
                    });
                }                

                sale.total = sale.total;
                sale.status = status;
                sale.product = sale.product;
                sale.user = sale.user;

                
                //Validaciones
                const errorsSale = await validate(sale);

                if (errorsSale.length > 0) {
                    return res.status(400).json({
                        ok: false,
                        errors: {
                            validation: true,
                            error: errorsSale
                        }
                    })
                }                                
                


                await saleRepo.save(sale)
                    .then((saleUpdate: Sale) => {

                        if (!saleUpdate) {

                            return res.status(409).json({
                                ok: false,
                                message: "No se pudo actualizar la subasta",
                            });

                        }

                        
                        //Enviar correo al cliente para pagar                        
                        Correo.sendCorreoCliente(sale.user, sale.product)


                        res.status(201).json({
                            ok: true,
                            sale: saleUpdate

                        })

                    }).catch((err: Error) => {

                        return res.status(500).json({
                            ok: false,
                            message: "Error al actualizar la subasta",
                            error: err.message
                        });

                    });

            }).catch((err: Error) => {

                return res.status(500).json({
                    ok: false,
                    error: {
                        message: "Error al buscar subasta a actualizar",
                        error: err.message
                    }
                });

            });

    }

    /**
     * Crear Subasta METODO ELIMINADO
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof SaleController
     */
    public async createSale(req: Request, res: Response) {

        let { productId, total } = req.body;

        let usuario: any = req.userToken;

        let userRepo = getRepository(User);
        let user: User | undefined = await userRepo.findOne({ id: usuario.id });
        if (!user || user === undefined) {

            return res.status(404).json({
                ok: false,
                message: `No se encontró un Usuario para el id: ${usuario.id}`,
            });
        }

        let productRepo = getRepository(Product);
        let product: Product | undefined = await productRepo.findOne({ id: productId });
        if (!product || product === undefined) {

            return res.status(404).json({
                ok: false,
                message: `No se encontró un Producto para el id: ${productId}`,
            });
        }



        let saleRepo = getRepository(Sale);


        let newSale = new Sale();

        newSale.status = Status.Disponible;
        newSale.total = parseFloat(total);
        newSale.product = product;
        newSale.user = user;


        //Validaciones
        const errorsSale = await validate(newSale);

        if (errorsSale.length > 0) {
            return res.status(400).json({
                ok: false,
                errors: {
                    validation: true,
                    error: errorsSale
                }
            })
        }

        await saleRepo.save(newSale)
            .then(async (saleCreated: Sale) => {

                if (!saleCreated) {
                    return res.status(409).json({
                        ok: false,
                        message: "No se pudo crear la subasta"
                    });
                }

                res.status(201).json({
                    ok: true,
                    sale: saleCreated
                });

            }).catch((err: Error) => {

                return res.status(500).json({
                    ok: false,
                    message: "Error al crear la subasta",
                    error: err.message
                });

            });
    }
}
