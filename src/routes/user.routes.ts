import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { verificaToken, verificaSuperAdmin } from '../middlewares/autenticacion';


const router = Router();       

    const users = new UserController();
    
    // rutas admin
    router.get('/', [verificaToken, verificaSuperAdmin], users.indexUser)    
    // router.delete('/:id', users.deleteUser);
        

    //rutas auth
    router.get('/:id', verificaToken,  users.showUser);
    router.put('/:id', verificaToken,  users.updateUser);
    

    // rutas publicas
    router.post('/',  users.createUser);
    router.post('/login',  users.loginPost);


       
    
export default router;