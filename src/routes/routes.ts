import {Router, Request, Response} from 'express';
import prodRoute from './product.routes';
import userRoute from './user.routes';


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



// router.use('/login', loginRoute);
router.use('/products', prodRoute);
// router.use('/sales', socketsRoute);
router.use('/users', userRoute);

export default router;