import { Request, Response } from "express";
import { EntityRepository, Repository, getRepository, DeleteResult } from "typeorm";
import { Product } from "../models/product.model";
import { ImageProduct } from "../models/image_product.model";
import path from "path";
import fs from "fs";
import { Sale, Status } from "../models/sale.model";
import { validate } from 'class-validator';
import { Category } from "../models/category.model";
import { obtenerFechaLimite } from "../helpers/time/time.helper";
import { programarFinalizacionSubasta } from "../helpers/schedule/schedule.helper";


@EntityRepository(Product)
export class ProductController extends Repository<Product>  {




	/**
     * Consultar todos los productos
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof ProductController
     */
    public async indexProduc(req: Request, res: Response) {

        await getRepository(Product).find({ relations: ["images","category"] })
            .then((products: Product[]) => {

                if (products.length === 0) {
                    return res.status(404).json({
                        ok: false,
                        message: 'No se encontraron registros'
                    })
                } else {
                    res.status(200).json({
                        ok: true,
                        products
                    })
                }

            })
            .catch((err: Error) => {
                return res.status(500).json({
                    ok: false,
                    message: "Error al obtener todos los productos",
                    error: err.message
                })
            });
    }

	/**
     * Crear Producto y Subasta en Status disponible
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof ProductController
     */
    public async createProduct(req: Request, res: Response) {

        let { name, description, price, deadline, categoryId } = req.body;


        let usuario: any = req.userToken;
        let imageRepos = getRepository(ImageProduct);
        let imgFiles: any = req.files;
        // console.log(imgFiles.length)
        if (imgFiles.length === 0) {

            return res.status(400).json({
                ok: false,
                message: 'Debe subir al menos una imagen'
            });
        }

        let categoryRepo = getRepository(Category);
        let category: any = await categoryRepo.findOne({ id: categoryId });
        if (!category || category === undefined) {

            return res.status(404).json({
                ok: false,
                message: `No se encontró un categoría para el id: ${categoryId}`,
            });
        }
        
        //validaciones para fecha limite
        const limite = obtenerFechaLimite(deadline)
        if(limite === '1'){
            return res.status(404).json({
                ok: false,
                message: `La fecha límite es incorrecta, la subasta no puede durar menos a 3 días`,
            });
        }
        if(limite === '2'){
            return res.status(404).json({
                ok: false,
                message: `La fecha límite es incorrecta, la subasta no puede durar más de 14 días`,
            });
        }

        let productRepo = getRepository(Product);
        let newProduct = new Product();

        newProduct.name = name;
        newProduct.description = description;
        newProduct.price = parseFloat(price);
        newProduct.category = category  
        newProduct.updatedByUser = usuario.id      


        //Validaciones de clase
        const errorsProduct = await validate(newProduct);

        if (errorsProduct.length > 0) {
            return res.status(400).json({
                ok: false,
                errors: {
                    validation: true,
                    error: errorsProduct
                }
            })
        }

        await productRepo.save(newProduct)
            .then(async (productCreated: Product) => {

                if (!productCreated) {
                    return res.status(409).json({
                        ok: false,
                        message: "No se pudo crear el producto"
                    });
                }



                //asociar las imagenes al producto
                imgFiles.forEach(async (file: Express.Multer.File) => {
                    // console.log(file)
                    let img = new ImageProduct();
                    img.filename = file.filename;
                    img.product = productCreated;
                    await imageRepos.save(img);
                })



                let sale = new Sale()
                sale.total = parseFloat(price);
                sale.status = Status.Disponible;
                sale.product = productCreated;
                sale.deadline = new Date(limite);
                sale.updatedByUser = usuario.id

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

                
                
                await getRepository(Sale).save(sale)
                    .then(async (saleCreated: Sale) => {

                        if (!saleCreated) {
                            return res.status(409).json({
                                ok: false,
                                message: "No se pudo crear la subasta"
                            });
                        }

                        // const date = new Date(2020, 8, 21, 22, 47, 0);
                        programarFinalizacionSubasta(sale.deadline,saleCreated.id);

                        res.status(201).json({
                            ok: true,
                            product: productCreated,
                            sale: saleCreated
                        });

                    }).catch((err: Error) => {

                        return res.status(500).json({
                            ok: false,
                            message: "Error al crear la subasta",
                            error: err.message
                        });

                    });

            }).catch((err: Error) => {

                return res.status(500).json({
                    ok: false,
                    message: "Error al crear el producto",
                    error: err.message
                });

            });
    }

	/**
     * Consultar por ID
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof ProductController
     */
    public async showProduct(req: Request, res: Response) {

        const productId: number = Number(req.params.id);

        let productRepo = getRepository(Product);

        await productRepo.findOne({ id: productId }, { relations: ["images","category"] })
            .then((product: Product | undefined) => {

                if (!product || product === undefined) {
                    return res.status(404).json({
                        ok: false,
                        message: `No se encontró un producto para el id ${productId}`
                    });
                }

                res.status(200).json({
                    ok: true,
                    product
                });


            }).catch((err: Error) => {

                return res.status(500).json({
                    ok: false,
                    message: 'Error al buscar producto',
                    error: err.message
                })

            });
    }

	/**
     * Actualizar por ID siempre que NO tenga ofertante en la subasta
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof ProductController
     */
    public async updateProduct(req: Request, res: Response) {

        let productId: number = Number(req.params.id);
        let { name, description, price, categoryId } = req.body;
        let usuario: any = req.userToken;

        //validar que exista categoria
        let category: any = await getRepository(Category).findOne({ id: categoryId });
        if (!category || category === undefined) {

            return res.status(404).json({
                ok: false,
                message: `No se encontró un categoría para el id: ${categoryId}`,
            });
        }


        let productRepo = getRepository(Product);

        await productRepo.findOne({ id: productId })
            .then(async (product: Product | undefined) => {

                if (!product) {
                    return res.status(404).json({
                        ok: false,
                        message: `No se encontró producto con el id: ${productId}`
                    });
                }

                //se puede actualizar si no tiene ofertante
                let saleRepo = getRepository(Sale);
                let sale: any = await saleRepo.findOne({ product: product }, {relations: ["user"]});
                // console.log(sale)
                if (sale.user) {

                    return res.status(400).json({
                        ok: false,
                        message: `El producto tiene una oferta. No puede cambiar información.`,
                    });
                }

                product.name = name;
                product.description = description;
                product.price = parseFloat(price)
                product.category = category;
                product.updatedByUser = usuario.id;

                // Validaciones
                const errorsSale = await validate(product);
                if (errorsSale.length > 0) {
                    return res.status(400).json({
                        ok: false,
                        errors: {
                            validation: true,
                            error: errorsSale
                        }
                    })
                }                


                await productRepo.save(product)
                    .then(async (productUpdate: Product) => {

                        if (!productUpdate) {

                            return res.status(409).json({
                                ok: false,
                                message: "No se pudo actualizar el producto",
                            });

                        }
                        
                        sale.total = parseFloat(price);
                        sale.status = Status.Disponible;
                        sale.product = productUpdate;

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

                        await getRepository(Sale).save(sale)
                            .then(async (saleUpdated: Sale) => {

                                if (!saleUpdated) {
                                    return res.status(409).json({
                                        ok: false,
                                        message: "No se pudo actualizar la subasta disponible"
                                    });
                                }

                                res.status(201).json({
                                    ok: true,
                                    product: productUpdate,
                                    sale: saleUpdated
                                });

                            }).catch((err: Error) => {

                                return res.status(500).json({
                                    ok: false,
                                    message: "Error al crear la subasta",
                                    error: err.message
                                });

                            });

                    }).catch((err: Error) => {

                        return res.status(500).json({
                            ok: false,
                            message: "Error al actualizar producto",
                            error: err.message
                        });

                    });

            }).catch((err: Error) => {

                return res.status(500).json({
                    ok: false,
                    error: {
                        message: "Error al buscar producto a actualizar",
                        error: err.message
                    }
                });

            });

    }

	/**
     * Eliminar por ID siempre que No tenga ofertante en subasta
     * Tambien se elimina la subasta ya que no tiene ofertante
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof ProductController
     */
    public async deleteProduct(req: Request, res: Response) {

        const productId: number = Number(req.params.id);

        let productRepo = getRepository(Product);


        await productRepo.findOne({ id: productId })
            .then(async (productDelete: Product | undefined) => {

                if (!productDelete || productDelete === undefined) {
                    return res.status(404).json({
                        ok: false,
                        message: `No se encontró producto con el id: ${productId}`
                    });
                }

                // /******** Validaciones **********/
                let saleRepo = getRepository(Sale);
                let sale: any = await saleRepo.findOne({ product: productDelete }, {relations: ["user"]} )
                    .then()
                    .catch((err: Error) => {
                        return res.status(500).json({
                            ok: false,
                            message: "Error al buscar Producto en subastas ",
                            error: err.message
                        })
                    });
            
                if (!sale.user) {
                    await productRepo.softDelete({ id: productId })
                        .then(async (result: DeleteResult) => {

                            await saleRepo.softDelete({id: sale.id})
                            .then((result: DeleteResult)=> {

                                res.status(200).json({
                                    ok: true,
                                    message: 'Producto eliminado',
                                    product: productDelete,
                                    sale: result
                                });

                            })
                            .catch((err: Error) => {
                                return res.status(500).json({
                                    ok: false,
                                    message: 'Error al subasta',
                                    error: err.message
                                })
                            })

                            

                        }).catch((err: Error) => {
                            return res.status(500).json({
                                ok: false,
                                message: 'Error al eliminar producto',
                                error: err.message
                            })
                        })
                } else {
                    return res.status(400).json({
                        ok: false,
                        message: 'El Producto no puede ser eliminado porque se encuentra en uso.'
                    });
                }

            }).catch((err: Error) => {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al buscar producto a eliminar',
                    error: err.message
                })
            })
    }

    /**
     * Obtener imagen por fileName 
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof ProductController
     */
    public downloadImg(req: Request, res: Response) {

        let img = req.params.img;

        let pathImg = path.resolve(__dirname, `../uploads/products/${img}`);

        //verificar si existe la imagen
        if (fs.existsSync(pathImg)) {
            res.sendFile(pathImg);
        } else {
            let imgDefault = path.resolve(__dirname, '../uploads/products/no-img.png');
            res.sendFile(imgDefault);
        }

    }

    /**
     * Subir imágenes a producto creado
     * recibe por parametro el productId
     * 
     * @param {Request} req
     * @param {Response} res
     * @returns
     * @memberof ProductController
     */
    public async uploadImg(req: Request, res: Response) {


        let imgFiles: any = req.files;
        // console.log(imgFiles.length)
        if (imgFiles.length === 0) {

            return res.status(400).json({
                ok: false,
                message: 'Debe subir al menos una imagen'
            });
        }

        let imageRepos = getRepository(ImageProduct);
        let productId: Number = Number(req.params.productId);

        let productRepo = getRepository(Product);
        await productRepo.findOne({ where: { id: productId } })
            .then((product: Product | undefined) => {

                if (!product || product === undefined) {

                    return res.status(404).json({
                        ok: false,
                        message: `No se encontró un Producto para el id: ${productId}`,
                    });
                }

                //asociar las imagenes al producto
                imgFiles.forEach(async (file: Express.Multer.File) => {
                    // console.log(file)
                    let img = new ImageProduct();
                    img.filename = file.filename;
                    img.product = product;
                    await imageRepos.save(img);
                })

                res.status(200).json({
                    ok: true,
                    message: 'Las imágenes fueron subidas con éxito.'
                });



            }).catch((err: Error) => {

                return res.status(500).json({
                    ok: false,
                    message: 'Error al buscar producto',
                    error: err.message
                })
            })


    }
    
    /**
     * Eliminar imagen po fileName (id unico para cada imaeng)
     * se eliminar archivo y registro de base de datos
     *
     * @param {Request} req
     * @param {Response} res
     * @returns
     * @memberof ProductController
     */
    public async deleteImg(req: Request, res: Response) {

        let img = req.params.img;


        if (img) {
            let oldPath = path.resolve(__dirname, `../uploads/products/${img}`);

            //verificar si existe la imagen en el path		
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);

                //verificar si existe en base
                let imageRepos = getRepository(ImageProduct);
                await imageRepos.findOne({ filename: img })
                    .then(async (imagen: ImageProduct | undefined) => {

                        if (!imagen || imagen === undefined) {
                            return res.status(400).json({
                                ok: false,
                                message: 'La imagen no existe en base'
                            });
                        }

                        //eliminar de base
                        await imageRepos.delete({ filename: img })
                            .then((result) => {

                                res.status(200).json({
                                    ok: false,
                                    message: 'Imagen eliminada'
                                });
                            }).catch((err: Error) => {
                                return res.status(500).json({
                                    ok: false,
                                    message: 'Error al eliminar imagen de la base',
                                    error: err.message
                                })
                            })

                    })
                    .catch((err: Error) => {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error al buscar imagen a eliminar',
                            error: err.message
                        })
                    })
            }
            else {
                return res.status(400).json({
                    ok: false,
                    message: 'La imagen no existe'
                });
            }
        }

    }
}
