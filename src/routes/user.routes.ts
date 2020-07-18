import { Router } from 'express';
import { UserController } from '../controllers/user.controller';


const router = Router();       

    const users = new UserController();
    
    router.get('/', users.indexUser)    
    router.get('/:id', users.showUser);
    
    router.post('/',  users.createUser);
    router.post('/login',  users.loginPost);

    router.put('/:id', users.updateUser);

    // router.delete('/:id', users.deleteUser);    
       
    
export default router;