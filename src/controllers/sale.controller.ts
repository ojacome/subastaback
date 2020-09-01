import { Request, Response } from "express";
import { EntityRepository, Repository, getRepository, DeleteResult, Between } from "typeorm";
import { Sale, Status } from "../models/sale.model";
import { User } from "../models/user.model";
import { Product } from "../models/product.model";
import { validate, isNotEmpty } from "class-validator";
import { isOferta, enviarCorreo, TipoCorreo } from "../helpers/sale.helper";
import { Correo } from "../helpers/send_email.helper";



@EntityRepository(Sale)
export class SaleController extends Repository<Sale>  {


    /**
     * Metodo para obtener incio y fin del mes actual
     *
     * @private
     * @returns
     * @memberof ReportController
     */
    private datesMonth(){

        let now = new Date(); 
        let init = new Date(now.getFullYear(), now.getMonth(), 1);
        let last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return {init, last};
    }

    /**
     * Busqueda de subastas disponibles por NOMBRE DEL PRODUCTO
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof SaleController
     */
    public async search(req: Request, res: Response) {

        const termino = req.params.termino;     
        
        const query = await
        getRepository(Sale)
        .createQueryBuilder("s")
        .leftJoinAndSelect("s.product", "product")
        .leftJoinAndSelect("s.user", "user")        
        .where("s.status= :status", { status: Status.Disponible})    
        .andWhere("product.name like :name", { name: '%' + termino + '%' })
        .getMany()
        .then((sales: Sale[]) => {
            
            res.status(200).json({
                ok: true,
                sales
            })
            
        })
        .catch((err: Error) => {
            return res.status(500).json({
                ok: false,
                message: "Error al buscar prodcutos disponibles",
                error: err.message
            })
        });
    }

	/**
     * Consultar las subastas en status disponibles
     * 
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof SaleController
     */
    public async indexSale(req: Request, res: Response) {

        const categoryId = req.params.categoryId;     
        let page = Number(req.query.page) || 1
        let perPage = 9;

        const query = await
        getRepository(Sale)
        .createQueryBuilder("s")
        .leftJoinAndSelect("s.product", "product")
        .leftJoinAndSelect("s.user", "user")
        .leftJoinAndSelect("product.category", "category")
        .where("s.status= :status", { status: Status.Disponible})

                
        if(isNotEmpty(categoryId) && categoryId !== 'all'){                        
            query.andWhere("category.id = :id", { id: categoryId});        
        }

        //paginacion
        query
        .skip((perPage * page) - perPage)
        .take(perPage)
        
        query
        .getManyAndCount()
        .then(([sales, total]) => {
            
            res.status(200).json({
                ok: true,
                sales,
                page: Math.ceil( total / perPage )
            })
            
        })
        .catch((err: Error) => {
            return res.status(500).json({
                ok: false,
                message: "Error al obtener las subastas disponibles",
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
     * Consulta las subasta para Usuario LOGUEADO
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
     * Actualizar con nueva oferta por ID LOGUEADO
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
     * Actualizar por ID status pagado LOGUEADO
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof SaleController
     */
    public async updatePaySale(req: Request, res: Response) {        
        
        let saleId: number = Number(req.params.id);        
        let salesId: any[] = req.body.map((obj: any) => obj.id);

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
        let foundSales: Sale[] = []

        for(let id of salesId){            
            
            let sale: any = await saleRepo.findOne({id: id, user: user}, {relations: ["product", "user"]})

            if (!sale) {
                return res.status(404).json({
                    ok: false,
                    message: `No se encontró subasta con el id: ${id}`
                });
            }
            
            

            sale.total = sale.total;
            sale.status = Status.Pagado;
            sale.product = sale.product;
            sale.user = sale.user;

            console.log(sale);
            foundSales.push(sale)

        }
        console.log(`actualizando`);
        
        await saleRepo.save(foundSales)
            .then( sales => {
                
                //Notificar al administrador para que se ponga en contacto
                // enviarCorreo(TipoCorreo.OfertaPagada, saleUpdate.user, saleUpdate.product)           

                res.status(201).json({
                    ok: true,
                    sales
                })
            })
            .catch((err: Error) => {
                return res.status(500).json({
                    ok: false,
                    message: "Error al actualizar la subasta",
                    error: err.message
                });
            })
    }




    /**
     * Consultar las subastas para ADMIN
     * debe indicar el status
     * si trae con ofertas (s) o sin ofertas(n)
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof SaleController
     */
    public indexSalexStatus = async(req: Request, res: Response) => {
        
        const status: any = req.params.status;
        const withUser: any = req.params.user;

        let {start, end} =  req.body;            

        //validaciones      
        let startDate = this.datesMonth().init;
        let endDate = this.datesMonth().last;
                        
        if(start !== null && start !=='' && start !== undefined){
                startDate = new Date(start)
        }                
        if(end !== null && end !== '' && end !== undefined){
                endDate = new Date(end)  
        } 


        let query =  await 
        getRepository(Sale)
        .createQueryBuilder("sale") 
        .leftJoinAndSelect("sale.product","product")
        .leftJoinAndSelect("sale.user","user")
        .where("sale.status= :status", { status: status })

        if(status === Status.Pagado){
            query.andWhere("sale.updatedAt BETWEEN :start AND :end", {start: startDate, end: endDate})  
        }



        query
        .getMany()
        .then((sales: Sale[]) => {                              
                                   
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
     * Actualizar por ID status finalizado ADMIN
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
                        enviarCorreo(TipoCorreo.OfertaAceptada, sale.user, sale.product)                    
                        


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

    	
}
