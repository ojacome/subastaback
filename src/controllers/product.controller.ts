import { Request, Response } from "express";
import { EntityRepository, Repository, getRepository, DeleteResult } from "typeorm";
import { Product } from "../models/product.model";
import { ImageProduct } from "../models/image_product.model";
import path from "path";
import fs from "fs";


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

        await getRepository(Product).find({relations: ["images"]})
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
     * Crear Producto
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof ProductController
     */
    public async createProduct(req: Request, res: Response) {

        let { name, description } = req.body;
        
        let productRepo = getRepository(Product);

        
        let newProduct = new Product();

        newProduct.name = name;
        newProduct.description = description;
        // newProduct.images = images;
        

        // //Validaciones
        // const errorsCac = await validate(newCac);

        // if (errorsCac.length > 0) {
        //     return res.status(400).json({
        //         ok: false,
        //         errors: {
        //             validation: true,
        //             error: errorsCac
        //         }
        //     })
        // }

        await productRepo.save(newProduct)
            .then(async (productCreated: Product) => {

                if (!productCreated) {
                    return res.status(409).json({
                            ok: false,
                            message: "No se pudo crear el producto"
                        });
                }


                //asociar las imagenes al producto
                let imageRepos = getRepository(ImageProduct);
                let imgFiles: any = req.files;
                
                if (imgFiles.length) {
       
                    imgFiles.forEach(async (file: Express.Multer.File) => {
                        // console.log(file)
                        let img = new ImageProduct();
                        img.filename = file.filename;
                        img.product = productCreated;
                        await imageRepos.save(img);
                    })
       
                }



                res.status(201).json({
                        ok: true,
                        product: productCreated
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

        await productRepo.findOne({id: productId},{relations: ["images"]})
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
     * Actualizar por ID
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof ProductController
     */
    public async updateProduct(req: Request, res: Response) {

        let productId: number = Number(req.params.id);
        let { name, description } = req.body;

        let productRepo = getRepository(Product);

        await productRepo.findOne({id: productId})
            .then(async (product: Product | undefined) => {

                if (!product) {
                    return res.status(404).json({
                            ok: false,
                            message: `No se encontró producto con el id: ${productId}`
                        });
                }

                product.name = name;
                product.description = description;


                //Validaciones
                // const errorsCac = await validate(product);
        
                // if (errorsCac.length > 0) {
                //     return res.status(400).json({
                //         ok: false,
                //         errors: {
                //             validation: true,
                //             error: errorsCac
                //         }
                //     })
                // }

                await productRepo.save(product)
                    .then((productUpdate: Product) => {

                        if (!productUpdate) {

                            return res.status(409).json({
                                    ok: false,
                                    message: "No se pudo actualizar el producto",
                                });

                        }

                        res.status(201).json({
                                ok: true,
                                product: productUpdate

                            })

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
     * Eliminar por ID
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof ProductController
     */
    public async deleteProduct(req: Request, res: Response) {

        const productId: number = Number(req.params.id);

        let productRepo = getRepository(Product);

        
        await productRepo.findOne({id: productId})
        .then(async (productDelete: Product | undefined) => {
                        
            if (!productDelete || productDelete === undefined) {
                return res.status(404).json({
                    ok: false,
                    message: `No se encontró producto con el id: ${productId}`
                });
            }

            // /******** Validaciones **********/
            // let regInci = await getRepository(Incidence).count({ productId : productId })
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
            }else{
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
}
