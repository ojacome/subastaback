import { Router, Request, Response } from 'express';
import { ProductController } from '../controllers/product.controller';
import multer from 'multer'
import path from 'path';


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
    
    router.get('/', products.indexProduc)    
    router.get('/:id', products.showProduct);
    
    router.post('/', [uploadImages.array('images', 5)] ,products.createProduct);

    router.put('/:id', products.updateProduct);

    router.delete('/:id', products.deleteProduct);    
       
    router.get('/download/images/:img', products.downloadImg);    
    router.post('/upload/images/:productId', [uploadImages.array('images', 5)] ,products.uploadImg);
    router.delete('/remove/images/:img', products.deleteImg);

export default router;