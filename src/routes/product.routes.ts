import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';


const router = Router();       

    const products = new ProductController();
    
    router.get('/', products.indexProduc)    
    router.get('/:id', products.showProduct);
    
    router.post('/',  products.createProduct);

    router.put('/:id', products.updateProduct);

    router.delete('/:id', products.deleteProduct);    
       
    
export default router;