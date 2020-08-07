import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import { SERVICE_CORREO, USER_CORREO, PASS_CORREO } from '../global/environment';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';
import { IsEmail } from 'class-validator';
import { getRepository } from 'typeorm';
import { body, BodyClient, BodyAdminPay } from './body_email.helper';

const transporter = nodemailer.createTransport({
    service: SERVICE_CORREO,
    auth: {

        user: USER_CORREO,
        pass: PASS_CORREO
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    },
});
let mailOptions = {
    from: {
        name: 'Fundación Fé y Acción',
        address: 'feyaccion@admin.sist.com'
    },
    to: 'sfgsfg@asdfadf',
    subject: 'SUBASTA - FUNDACIÓN FE Y ACCIÓN',
    text: 'sdfgsdfg',
    html: 'sfdgsf'
}

export class Correo {

    static async NuevaOferta() {
        
        let userAdmin: any = await getRepository(User).findOne({ isAdmin: true })
        mailOptions.to = userAdmin.email
        mailOptions.text = `Hola ${userAdmin.fullName},`
        mailOptions.html = body

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log('Correo enviado ' + info.response)
            }
        })
    }

    static OfertaAceptada(user: User, product: Product) {
                        
        let body = new BodyClient(user.fullName, product.name)

        mailOptions.to = user.email
        mailOptions.text = `Hola ${user.fullName},`
        mailOptions.html = body.html

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log('Correo enviado ' + info.response)
            }
        })
    }

    static async OfertaPagada(user: User, product: Product) {
        
        let body = new BodyAdminPay(user.fullName, product.name, user.email)

        let userAdmin: any = await getRepository(User).findOne({ isAdmin: true })
        mailOptions.to = userAdmin.email
        mailOptions.text = `Hola ${userAdmin.fullName},`
        mailOptions.html = body.html

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log('Correo enviado ' + info.response)
            }
        })
    }
}










// export const sendCorreoElectronico = async () => {

//     console.log("entra enviar correo")
//     let userAdmin: any = await getRepository(User).findOne({ isAdmin: true })
//     mailOptions.to = userAdmin.email
//     mailOptions.text = `Hola ${userAdmin.fullName},`
//     mailOptions.html = bodyEmail()

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error)
//         }
//         else {
//             console.log('Correo enviado ' + info.response)
//         }
//     })
// }
// //servicio de correo ethereal , mailtrap investigar
// let EmailController = {

//     sendEmail(req: Request, res: Response){

//         // return res.status(200).json({
//         //     ok: true,
//         //     message: 'Correo enviado',
//         //     detail: 'xd'
//         // })
//         let transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {

//                 user:'olmedo.bdp@gmail.com',
//                 pass: 'teamovirgen10'
//             },
//             tls: {
//                 // do not fail on invalid certs
//                 rejectUnauthorized: false
//             },
//         });

//         let mailOptions = {
//             from: 'admin@fundacion.feyaccion.com',
//             to: 'olmedo.jacomeb@ug.edu.ec',
//             subject: 'Fundacion fe',
//             text: `Hola Olmedo`,            
//             html: "<h3>Has recibido una oferta en el siguiente producto</h3>"
//         }

//         transporter.sendMail(mailOptions, function(error, info){
//             if(error){
//                 console.log(error)
//                 res.status(500).json({
//                     ok: true,
//                     message: 'error al enviar correo',
//                     detail: error
//                 })
//             }
//             else{
//                 console.log('Correo enviado '+ info.response)
//                 res.status(200).json({
//                     ok: true,
//                     message: 'Correo enviado',
//                     detail: info.response
//                 })
//             }
//         })
//     }
// }

// export default EmailController