import { Router } from 'express';
import { SaleController } from '../controllers/sale.controller';
import { verificaToken } from '../middlewares/autenticacion';


const router = Router();       

    const sales = new SaleController();
    
    //rutas con auth
    router.get('/', sales.indexSale)    
    router.get('/:id', sales.showSale); 
    
    
    // router.post('/', verificaToken,  sales.createSale);
    router.put('/:id', verificaToken, sales.updateSale);
    router.put('/paypal/:id', verificaToken, sales.updatePaySale);
    // router.delete('/:id', sales.deleteSale);    
       
    
export default router;