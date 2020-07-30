import nodemailer from 'nodemailer';
import { Request, Response } from 'express';


//servicio de correo ethereal , mailtrap investigar
let EmailController = {

    sendEmail(req: Request, res: Response){
    
        // return res.status(200).json({
        //     ok: true,
        //     message: 'Correo enviado',
        //     detail: 'xd'
        // })
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
        
                user:'olmedo.bdp@gmail.com',
                pass: 'teamovirgen10'
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            },
        });
        
        let mailOptions = {
            from: 'admin@fundacion.feyaccion.com',
            to: 'olmedo.jacomeb@ug.edu.ec',
            subject: 'Fundacion fe',
            text: `Hola Olmedo`,            
            html: "<h3>Has recibido una oferta en el siguiente producto</h3>"
        }
        
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error)
                res.status(500).json({
                    ok: true,
                    message: 'error al enviar correo',
                    detail: error
                })
            }
            else{
                console.log('Correo enviado '+ info.response)
                res.status(200).json({
                    ok: true,
                    message: 'Correo enviado',
                    detail: info.response
                })
            }
        })
    }
}

export default EmailController