import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { verificaToken, verificaSuperAdmin } from '../middlewares/autenticacion';


const router = Router();       

    const users = new UserController();
    
    // rutas admin
    router.get('/', [verificaToken, verificaSuperAdmin], users.indexUser)    
    // router.delete('/:id', users.deleteUser);


    //rutas auth
    router.get('/user', verificaToken,  users.showUser);
    router.put('/user', verificaToken,  users.updateUser);
    

    // rutas publicas
    router.post('/',  users.createUser);
    router.post('/login',  users.loginPost);
    router.post('/forgot-password',  users.forgotPassword);
    router.post('/reset-password/:token',  users.resetPassword);


       
    
export default router;