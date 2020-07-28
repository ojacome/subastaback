import { Router } from 'express';
import { SaleController } from '../controllers/sale.controller';
import { verificaToken, verificaSuperAdmin } from '../middlewares/autenticacion';


const router = Router();       

    const sales = new SaleController();
    
    //rutas publicas
    router.get('/', sales.indexSale)    
    router.get('/:id', sales.showSale); 
    
    
    //rutas con auht    
    router.put('/:id', verificaToken, sales.updateSale);
    router.put('/paypal/:id', verificaToken, sales.updatePaySale);


    //rutas admin
    router.get('/admin/:status/:user', [verificaToken, verificaSuperAdmin], sales.indexSalexStatus)   
    router.put('/finished/:id', [verificaToken, verificaSuperAdmin], sales.updateFinalizadoSale);
    
       
    
export default router;