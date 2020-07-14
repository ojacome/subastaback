import { Router } from 'express';
import { SaleController } from '../controllers/sale.controller';


const router = Router();       

    const sales = new SaleController();
    
    router.get('/', sales.indexSale)    
    router.get('/:id', sales.showSale);
    
    router.post('/',  sales.createSale);

    router.put('/:id', sales.updateSale);

    // router.delete('/:id', sales.deleteSale);    
       
    
export default router;