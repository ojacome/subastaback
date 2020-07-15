import { createConnection} from 'typeorm';
import 'reflect-metadata';
import app from './app'
import router from './routes/routes';
import { Request, Response, NextFunction} from 'express'
import multer from 'multer'

let port = 3900;



//routes 
app.use('/api/v1', router);
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("Ruta no encontrada!");
});



//Catch errores de multer
app.use((err:Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    
    if (err instanceof multer.MulterError) {
         console.log(err.code);
        let message: string = '';
        if (err.code === 'LIMIT_FILE_SIZE'){ message='Archivo excede el tamaño permitido' };
        if (err.code === 'LIMIT_FILE_COUNT'){ message='No debe exceder el número máximo de imágenes a subir' };
        if (err.code === 'LIMIT_UNEXPECTED_FILE'){ message='Tipo de archivo no permitido' };
        
        return res.status(400).json({
            ok: false,
            message: message.length ? message: err.message
        });
    }
        
    res.status(500).send('Error en el servidor!');
});


createConnection()
    .then( async connection =>{

        console.log("Conectado a la Base de datos")
    })
    .catch(error => console.log("TypeORM error en conexion a la BD: ", error));



app.listen(port, () => {

    console.log('Servidor escuchando en http://localhost:'+port);
});