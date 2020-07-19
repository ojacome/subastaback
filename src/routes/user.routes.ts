import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { verificaToken } from '../middlewares/autenticacion';


const router = Router();       

    const users = new UserController();
    
    router.get('/', users.indexUser)    
    router.get('/:id', verificaToken,  users.showUser);
    
    router.post('/',  users.createUser);
    router.post('/login',  users.loginPost);

    router.put('/:id', verificaToken,  users.updateUser);

    // router.delete('/:id', users.deleteUser);    
       
    
export default router;