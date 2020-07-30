import {Router, Request, Response} from 'express';
import prodRoute from './product.routes';
import userRoute from './user.routes';
import saleRoute from './sale.routes';
import categoryRoute from './category.routes';
import EmailController from '../helpers/send_email.helper';

const router = Router()

/**
 * Peticion get a url /api/v1/
 */
router.get('/', (req: Request,res: Response) => {
   
    res.status(200).json({
        ok:true,
        mensaje: 'API V1 funcionando correctamente' 
    });

});



router.use('/products', prodRoute);
router.use('/sales', saleRoute);
router.use('/users', userRoute);
router.use('/categories', categoryRoute);
router.get('/email', EmailController.sendEmail)

export default router;