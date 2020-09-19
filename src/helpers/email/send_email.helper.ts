import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import { SERVICE_CORREO, USER_CORREO, PASS_CORREO } from '../../global/environment';
import { User } from '../../models/user.model';
import { Product } from '../../models/product.model';
import { IsEmail } from 'class-validator';
import { getRepository } from 'typeorm';
import { BodyNuevaOferta, BodyClient, BodyAdminPay, BodyFortgotPass, BodyContact, BodyEmailVerification } from './body_email.helper';
import { Sale } from '../../models/sale.model';

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

let getMailOptions = (destinatario: string, asunto: string, html: string ) => {

    return  {
        from: {
            name: 'Fundación Fé y Acción',
            address: 'feyaccion@admin.sist.com'
        },
        to: destinatario,
        subject: asunto,
        text: '',
        html: html,
        attachments: [{
            filename: 'logo_recortado.png',
            path: 'D:/universidad/titulacion/subastaback/dist/assets/img/logo_recortado.png',
            cid: '123logofundacion' //same cid value as in the html img src
        }]
    }
}

export class Correo {

    static async NuevaOferta( product: Product ) {
        
        let body = new BodyNuevaOferta(product.name)
        let userAdmin: any = await getRepository(User).findOne({ isAdmin: true })
        
        let mailOptions = getMailOptions(userAdmin.email, `NUEVA OFERTA AL PRODUCTO ${product.name.toUpperCase()}`, body.html)

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
        let mailOptions = getMailOptions(user.email, `OFERTA ACEPTADA AL PRODUCTO ${product.name.toUpperCase()}`, body.html)
        

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log('Correo enviado ' + info.response)
            }
        })
    }

    static async OfertaPagada(user: User, sales: Sale[] | undefined) {
        
        let body = new BodyAdminPay(user.fullName, sales, user.email)
        let userAdmin: any = await getRepository(User).findOne({ isAdmin: true })
        let mailOptions = getMailOptions(userAdmin.email, `SUBASTA PAGADA DE ${sales?.length} PRODUCTO/S`, body.html)        

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log('Correo enviado ' + info.response)
            }
        })
    }

    static async ForgotPassword(user: any) {
        
        let body = new BodyFortgotPass(user.fullName, user.token)
        
        let mailOptions = getMailOptions(user.email, `RECUPERAR CONTRASEÑA`, body.html)   
        

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log('Correo enviado ' + info.response)
            }
        })
    }

    static async Contact(user: any) {
        
        let userAdmin: any = await getRepository(User).findOne({ isAdmin: true })
        
        let body = new BodyContact(user.name, user.email, user.message)
        let mailOptions = getMailOptions(userAdmin.email, `MENSAJE SOBRE VOLUNTARIADO DE ${user.name}`, body.html)   
        

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log('Correo enviado ' + info.response)
            }
        })
    }

    static async EmailVerification(user: any, token: string) {
                
        
        let body = new BodyEmailVerification(user.fullName, token);
        let mailOptions = getMailOptions(user.email, `ACTIVACIÓN DE CUENTA`, body.html)   
        

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
