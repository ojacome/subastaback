import { Router } from 'express';
import { verificaToken, verificaSuperAdmin } from '../middlewares/autenticacion';
import { ReportController } from '../controllers/report.controller';


const router = Router();       

    const report = new ReportController();    


    
    // rutas admin
    router.post('/status/:status/user/:user', [verificaToken, verificaSuperAdmin],  report.indexSalexStatus);

       
    
export default router;