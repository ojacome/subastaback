import { Router, Request, Response } from 'express';
import { ProductController } from '../controllers/product.controller';
import multer from 'multer'
import path from 'path';
import { verificaToken, verificaSuperAdmin } from '../middlewares/autenticacion';


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb( null, path.resolve(__dirname,'../uploads/products') );  
    },
    filename: function(req, file, cb){
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9)
         cb( null, uniqueName + '-' + file.originalname );
    }
});

const imageFilter = (req: Request , file: Express.Multer.File, cb: any) => {
    //solo imagenes
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {         
         cb( new multer.MulterError("LIMIT_UNEXPECTED_FILE") , false);
    }else {
        cb(null, true);
    } 
}

const uploadImages = multer({ 
    dest:'temp/uploads',
    storage,
    limits:{        
        files: 5,
        fileSize : 1024*1024 *3,
    },
    fileFilter: imageFilter
})





const router = Router();       

    const products = new ProductController();
    
    //rutas publicas
    router.get('/download/images/:img', products.downloadImg);    
    
    //rutas admin
    router.get('/', [verificaToken, verificaSuperAdmin], products.indexProduc)    
    router.get('/:id', [verificaToken, verificaSuperAdmin], products.showProduct);
    router.post('/', [verificaToken, verificaSuperAdmin], [uploadImages.array('images', 5)] ,products.createProduct);
    router.post('/upload/images/:productId',[verificaToken, verificaSuperAdmin], [uploadImages.array('images', 5)] ,products.uploadImg);
    router.put('/:id',[verificaToken, verificaSuperAdmin], products.updateProduct);
    router.delete('/:id', [verificaToken, verificaSuperAdmin], products.deleteProduct);           
    router.delete('/remove/images/:img', [verificaToken, verificaSuperAdmin], products.deleteImg);

export default router;