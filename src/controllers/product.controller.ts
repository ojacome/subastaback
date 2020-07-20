import { Request, Response } from "express";
import { EntityRepository, Repository, getRepository, DeleteResult } from "typeorm";
import { Product } from "../models/product.model";
import { ImageProduct } from "../models/image_product.model";
import path from "path";
import fs from "fs";
import { Sale, Status } from "../models/sale.model";
import { validate } from 'class-validator';


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

        await getRepository(Product).find({ relations: ["images"] })
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

        let { name, description, price } = req.body;



        let imageRepos = getRepository(ImageProduct);
        let imgFiles: any = req.files;
        // console.log(imgFiles.length)
        if (imgFiles.length === 0) {

            return res.status(400).json({
                ok: false,
                message: 'Debe subir al menos una imagen'
            });
        }

        let productRepo = getRepository(Product);
        let newProduct = new Product();

        newProduct.name = name;
        newProduct.description = description;
        newProduct.price = parseFloat(price)


        //Validaciones
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

        await productRepo.findOne({ id: productId }, { relations: ["images"] })
            .then((product: Product | undefined) => {

                if (!product || product === undefined) {
                    return res.status(404).json({
                        ok: false,
                        error: `No se encontró un producto para el id ${productId}`
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
        let { name, description, price } = req.body;


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
                        message: `El producto se encuentra en subasta`,
                    });
                }

                product.name = name;
                product.description = description;
                product.price = parseFloat(price)

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
                let regSale: any = await getRepository(Sale).findOne({ product: productDelete }, {relations: ["user"]} )
                    .then()
                    .catch((err: Error) => {
                        return res.status(500).json({
                            ok: false,
                            message: "Error al buscar Producto en subastas ",
                            error: err.message
                        })
                    });
                console.group(regSale)
                if (!regSale.user) {
                    await productRepo.softDelete({ id: productId })
                        .then((result: DeleteResult) => {

                            res.status(200).json({
                                ok: true,
                                message: 'Producto eliminado',
                                product: productDelete
                            });

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
