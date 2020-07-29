import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { verificaToken, verificaSuperAdmin } from '../middlewares/autenticacion';
import { CategoryController } from '../controllers/category.controller';


const router = Router();       

    const categories = new CategoryController();
    


    //rutas publicas
    router.get('/',  categories.indexCategory)        
    router.get('/:id',  categories.showCategory);


    // rutas admin
    router.post('/', [verificaToken, verificaSuperAdmin],  categories.createCategory);
    router.put('/:id', [verificaToken, verificaSuperAdmin],  categories.updateCategory);    
    router.delete('/:id', [verificaToken, verificaSuperAdmin], categories.deleteCategory);    


       
    
export default router;