import { Request, Response } from "express";
import { EntityRepository, Repository, getRepository, DeleteResult } from "typeorm";
import { Product } from "../models/product.model";
import { ImageProduct } from "../models/image_product.model";
import { Sale, Status } from "../models/sale.model";
import { validate } from 'class-validator';
import { Category } from "../models/category.model";


@EntityRepository(Category)
export class CategoryController extends Repository<Category>  {




	/**
     * Consultar todas las categorias
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof CategoryController
     */
    public async indexCategory(req: Request, res: Response) {

        let categoryRepo = getRepository(Category)

        await categoryRepo.find()
            .then( (categories: Category[]) => {

                if (categories.length === 0) {
                    return res.status(404).json({
                        ok: false,
                        message: 'No se encontraron registros'
                    })
                } else {                    
                     

                    res.status(200).json({
                        ok: true,
                        categories
                    })
                }

            })
            .catch((err: Error) => {
                return res.status(500).json({
                    ok: false,
                    message: "Error al obtener todas las categorías",
                    error: err.message
                })
            });
    }

	/**
     * Crear categoria
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof CategoryController
     */
    public async createCategory(req: Request, res: Response) {

        let { name, description } = req.body;


        let categoryRepo = getRepository(Category);
        let newCategory = new Category();

        newCategory.name = name;
        newCategory.description = description;        


        //Validaciones
        const errorsCategory = await validate(newCategory);

        if (errorsCategory.length > 0) {
            return res.status(400).json({
                ok: false,
                errors: {
                    validation: true,
                    error: errorsCategory
                }
            })
        }

        await categoryRepo.save(newCategory)
            .then(async (categoryCreated: Category) => {

                if (!categoryCreated) {
                    return res.status(409).json({
                        ok: false,
                        message: "No se pudo crear la categoría"
                    });
                }


                res.status(201).json({
                    ok: true,
                    product: categoryCreated
                });


            }).catch((err: Error) => {

                return res.status(500).json({
                    ok: false,
                    message: "Error al crear la categoría",
                    error: err.message
                });

            });
    }

	/**
     * Consultar por ID
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof CategoryController
     */
    public async showCategory(req: Request, res: Response) {

        const categoryId: number = Number(req.params.id);

        let categoryRepo = getRepository(Category);

        await categoryRepo.findOne({ id: categoryId })
            .then(async (category: Category | undefined) => {

                if (!category || category === undefined) {
                    return res.status(404).json({
                        ok: false,
                        message: `No se encontró un categoría para el id ${categoryId}`
                    });
                }

                let products = await categoryRepo.createQueryBuilder().relation(Category, "products").of(category).loadMany()
                category["products"] = products;

                res.status(200).json({
                    ok: true,
                    category
                });


            }).catch((err: Error) => {

                return res.status(500).json({
                    ok: false,
                    message: 'Error al buscar categoría',
                    error: err.message
                })

            });
    }

	/**
     * Actualizar por ID 
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof CategoryController
     */
    public async updateCategory(req: Request, res: Response) {

        let categoryId: number = Number(req.params.id);
        let { name, description } = req.body;


        let categoryRepo = getRepository(Category);

        await categoryRepo.findOne({ id: categoryId })
            .then(async (category: Category | undefined) => {

                if (!category) {
                    return res.status(404).json({
                        ok: false,
                        message: `No se encontró categoría con el id: ${categoryId}`
                    });
                }

                category.name = name;
                category.description = description;

                // Validaciones
                const errorsCategory = await validate(category);
                if (errorsCategory.length > 0) {
                    return res.status(400).json({
                        ok: false,
                        errors: {
                            validation: true,
                            error: errorsCategory
                        }
                    })
                }                


                await categoryRepo.save(category)
                    .then(async (categoryUpdate: Category) => {

                        if (!categoryUpdate) {

                            return res.status(409).json({
                                ok: false,
                                message: "No se pudo actualizar la categoría",
                            });

                        }
                        
                        res.status(201).json({
                            ok: true,
                            category: categoryUpdate
                        });


                    }).catch((err: Error) => {

                        return res.status(500).json({
                            ok: false,
                            message: "Error al actualizar categoría",
                            error: err.message
                        });

                    });

            }).catch((err: Error) => {

                return res.status(500).json({
                    ok: false,
                    error: {
                        message: "Error al buscar categoría a actualizar",
                        error: err.message
                    }
                });

            });

    }

	/**
     * Eliminar por ID siempre que No tenga productos relacionados
     * 
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof CategoryController
     */
    public async deleteCategory(req: Request, res: Response) {

        const categoryId: number = Number(req.params.id);

        let categoryRepo = getRepository(Category);


        await categoryRepo.findOne({ id: categoryId })
            .then(async (categoryDelete: Category | undefined) => {

                if (!categoryDelete || categoryDelete === undefined) {
                    return res.status(404).json({
                        ok: false,
                        message: `No se encontró categoría con el id: ${categoryId}`
                    });
                }                
            
                if (!categoryDelete.products) {
                
                    await categoryRepo.softDelete({ id: categoryId })
                        .then(async (result: DeleteResult) => {

                            res.status(200).json({
                                ok: true,
                                message: 'Categoría eliminada',
                                category: categoryDelete
                            });
                            

                        }).catch((err: Error) => {
                            return res.status(500).json({
                                ok: false,
                                message: 'Error al eliminar Categoría',
                                error: err.message
                            })
                        })
                } else {
                    return res.status(400).json({
                        ok: false,
                        message: 'La categoría no puede ser eliminada porque se encuentra en uso.'
                    });
                }

            }).catch((err: Error) => {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al buscar categoría a eliminar',
                    error: err.message
                })
            })
    }

    
    
    
}
