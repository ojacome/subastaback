import { CLIENT_SERVERS } from "../../global/environment"
import { Sale } from "../../models/sale.model"

export class BodyClient {
    public html: string

    constructor(
        private name: string,
        private nameProduct: string,
    ) {

        this.getHtml()
    }

    getHtml() {

        this.html =
            `
            <table class="table" style="width: 100%;height: 100%;font-family: Helvetica, Arial, sans-serif;padding: 2% 15%;text-align: justify;opacity: 0.8;">
                <thead>
                    <tr>
                        <td class="head" style="background-color: #FEEEEC;padding: 3% 10%;">
            
                            <img class="logo" src="cid:123logofundacion" alt="logo" style="float: left;height: 60px;margin-right: 10px;">
                            <h2>
                                FUNDACIÓN FE Y ACCIÓN
                            </h2>
            
                        </td>
                    </tr>
                </thead>
            
                <tbody>
                    <tr>
                        <td class="body-email" style="padding: 50px 10%;">
            
                            <h4 class="intro" style="font-style: italic;">
                                Estimado/a ${this.name.toUpperCase()},
                            </h4>                    
                            <p>
                                Tu oferta realizada al producto ${this.nameProduct.toUpperCase()} fue aceptada da clic en el botón de abajo para que puedas pagar el valor del mismo
                            </p>
                            <a href="${CLIENT_SERVERS[0]}/#/cart" class="boton_personalizado" style="text-decoration: none;padding: 10px;font-weight: 600;font-size: 16px;color: #ffffff;background-color: #1883ba;border-radius: 6px;">
                                Ver Detalles
                            </a>
            
                            <br>
                            <br>
                            <p>
                                Si tienes problemas para abrir el enlace copia y pega ésta url 
                            </p>
                            <p>
                                ${CLIENT_SERVERS[0]}/#/cart
                            </p>
                        </td>
                    </tr>
                </tbody>
            
                <tfoot>
                    <tr>
                        <td class="footer" style="background-color: #FEEEEC;padding: 3% 10%;">
                            <p>
                                Visita nuestro
                                <a href="${CLIENT_SERVERS[0]}">sitio web</a>
                                y nuestra red social
                                <a href="https://www.facebook.com/fundacionfeyaccion/">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook f logo (2019).svg" height="15px" width="15px">
                                </a>
                            </p>
            
                            <br>
                            <span class="copyright" style="font-size: 12px;">
                                Fundación Fé y Acción ©
                            </span>
                        </td>
                    </tr>
                </tfoot>
            </table> 
            `
    }
}

export class BodyAdminPay {
    public html: string

    constructor(
        private nameClient: string,
        private sales: Sale[] = [],
        private emailClient: string
    ) {

        this.getHtml()
    }

    getHtml() {

        let products = ''

        for (let i = 0; i < this.sales.length; i++) {            
            products += 
            `<p>
            Nombre del producto: 
            <b>
                ${this.sales[i].product.name.toUpperCase()}     
            </b> 
            </p>`
        }
        // console.log(products);
        
        this.html =
            `
            <table class="table" style="width: 100%;height: 100%;font-family: Helvetica, Arial, sans-serif;padding: 2% 15%;text-align: justify;opacity: 0.8;">
                <thead>
                    <tr>
                        <td class="head" style="background-color: #FEEEEC;padding: 3% 10%;">

                            <img class="logo" src="cid:123logofundacion" alt="logo" style="float: left;height: 60px;margin-right: 10px;">
                            <h2>
                                FUNDACIÓN FE Y ACCIÓN
                            </h2>

                        </td>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td class="body-email" style="padding: 50px 10%;">

                            <h4 class="intro" style="font-style: italic;">
                                Mensaje al Administrador
                            </h4>                    

                            <p>
                                Se realizó el pago de ${this.sales.length} subasta/s.
                                A continuación los detalles para que te pongas en contacto para coordinar la entrega.
                            </p>
                            
                            <p>
                                Nombre del comprador: 
                                <b>
                                    ${this.sales[0].user.fullName.toUpperCase()}
                                </b>                        
                            </p>
                            
                            <p>
                                Correo electrónico: ${this.emailClient}
                            </p>

                            ${products}

                            
                            <br>
                            <p> 
                                También puedes conocer más detalles dando clic en el botón de abajo                        
                            </p>
                            <a href="${CLIENT_SERVERS[0]}/#/dashboard/reports" class="boton_personalizado" style="text-decoration: none;padding: 10px;font-weight: 600;font-size: 16px;color: #ffffff;background-color: #1883ba;border-radius: 6px;">
                                Ver Detalles
                            </a>
                        </td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td class="footer" style="background-color: #FEEEEC;padding: 3% 10%;">
                            <p>
                                Visita nuestro
                                <a href="http:localhost:4200">sitio web</a>
                                y nuestra red social
                                <a href="https://www.facebook.com/fundacionfeyaccion/">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook f logo (2019).svg" height="15px" width="15px">
                                </a>
                            </p>

                            <br>
                            <span class="copyright" style="font-size: 12px;">
                                Fundación Fé y Acción ©
                            </span>
                        </td>
                    </tr>
                </tfoot>
            </table>        
            `
    }
}

export class BodyFortgotPass {
    public html: string

    constructor(
        private nameClient: string,
        private token: string
    ) {

        this.getHtml()
    }

    getHtml() {

        this.html =
            `
            <table class="table" style="width: 100%;height: 100%;text-align: center;font-family: Helvetica, Arial, sans-serif;opacity: 0.8;">
        <thead class="head" style="background-color: #FEEEEC;">
            <tr>
                <td>
                    <br>
                    <h2>
                        FUNDACIÓN FE Y ACCIÓN
                    </h2>
                    <br>
                </td>
            </tr>
        </thead>

        <tbody>
            <tr>
                <td class="body-email" style="padding-left: 20%;padding-right: 20%;text-align: justify;">
                    <br>

                    <h4 class="intro" style="font-style: italic;">
                        Hola ${this.nameClient.toUpperCase()},
                    </h4>
                    <br>      
                                  
                    <p>
                        Hemos recibido una solicitud de cambio de contraseña, para tu cuenta en Fundación Fé y Acción.
                    </p>                    
                    <p>
                        Haz clic en el botón de abajo para que puedas cambiar tu contraseña.                         
                    </p>
                    <p>
                        Ten en cuenta que este enlace es válido solo durante 24 horas. Una vez transcurrido el plazo, deberás volver a solicitar el restablecimiento de la contraseña.
                    </p>
                    <a href="${CLIENT_SERVERS[0]}/#/reset-password/${this.token}" class="boton_personalizado" style="text-decoration: none;padding: 10px;font-weight: 600;font-size: 16px;color: #ffffff;background-color: #1883ba;border-radius: 6px;">
                        Cambiar contraseña
                    </a>
                    <br>
                    <p>Si tienes problemas para abrir el enlace copia y pega la siguiente URL en su navegador web</p>
                    <p>${CLIENT_SERVERS[0]}/#/reset-password/${this.token}</p>
                    <br>
                </td>
            </tr>
        </tbody>

        <tfoot class="footer" style="background-color: #FEEEEC;">
            <tr>
                <td>
                    <br>
                    <p>
                        Visita nuestro
                        <a href="http:localhost:4200">sitio web</a>
                        y nuestra red social
                        <a href="https://www.facebook.com/fundacionfeyaccion/">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook f logo (2019).svg" height="15px" width="15px">
                        </a>
                    </p>

                    <br>
                    <span class="copyright" style="font-size: 12px;">
                        Fundación Fé y Acción ©
                    </span>
                    <br>
                </td>
            </tr>
        </tfoot>
    </table>                    
        `
    }
}

export class BodyNuevaOferta {
    public html: string

    constructor(
        private nameProduct: string
    ) {

        this.getHtml()
    }

    getHtml() {

        this.html =
        `      
        <table class="table" style="width: 100%;height: 100%;font-family: Helvetica, Arial, sans-serif;padding: 2% 15%;text-align: justify;opacity: 0.8;">
        <thead>
            <tr>
                <td class="head" style="background-color: #FEEEEC;padding: 3% 10%;">
                    
                    <img class="logo" src="cid:123logofundacion" alt="logo" style="float: left;height: 60px;margin-right: 10px;">
                    <h2>
                        FUNDACIÓN FE Y ACCIÓN
                    </h2>
                    
                </td>
            </tr>
        </thead>

        <tbody>
            <tr>
                <td class="body-email" style="padding: 50px 10%;">                    

                    <h4 class="intro" style="font-style: italic;">
                        Mensaje al Administrador
                    </h4>
                    <br>      
                                  
                    <p>
                        Se registró una nueva oferta para el producto ${this.nameProduct.toUpperCase()}, haz clic en el botón de abajo para que puedas ingresar al sistema y conocer más detalles. 
                    </p>  
                    
                    <a href="${CLIENT_SERVERS[0]}/#/dashboard/reports" class="boton_personalizado" style="text-decoration: none;padding: 10px;font-weight: 600;font-size: 16px;color: #ffffff;background-color: #1883ba;border-radius: 6px;">
                        Ver Oferta
                    </a>
                    
                </td>
            </tr>
        </tbody>

        <tfoot>
            <tr>
                <td class="footer" style="background-color: #FEEEEC;padding: 3% 10%;">                    
                    <p>
                        Visita nuestro
                        <a href="${CLIENT_SERVERS[0]}">sitio web</a>
                        y nuestra red social
                        <a href="https://www.facebook.com/fundacionfeyaccion/">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook f logo (2019).svg" height="15px" width="15px">
                        </a>
                    </p>

                    <br>
                    <span class="copyright" style="font-size: 12px;">
                        Fundación Fé y Acción ©
                    </span>                    
                </td>
            </tr>
        </tfoot>
    </table>                    
        `
    }
}

export class BodyContact {
    public html: string

    constructor(
        private name: string,
        private email: string,
        private message: string
    ) {

        this.getHtml()
    }

    getHtml() {

        this.html =
        `      
        <table class="table" style="width: 100%;height: 100%;font-family: Helvetica, Arial, sans-serif;padding: 2% 15%;text-align: justify;opacity: 0.8;">
            <thead>
                <tr>
                    <td class="head" style="background-color: #FEEEEC;padding: 3% 10%;">

                        <img class="logo" src="cid:123logofundacion" alt="logo" style="float: left;height: 60px;margin-right: 10px;">
                        <h2>
                            FUNDACIÓN FE Y ACCIÓN
                        </h2>

                    </td>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td class="body-email" style="padding: 50px 10%;">

                        <h4 class="intro" style="font-style: italic;">
                            Mensaje al Administrador
                        </h4>
                        <br>

                        <p>
                            Una persona está interesada en ser voluntario, a continuación los datos para que te pongas en contacto.
                        </p>

                        <p>
                            <span class="negrita" style="font-weight: bold;">Nombre:</span> ${this.name.toUpperCase()}
                        </p>

                        <p>
                            <span class="negrita" style="font-weight: bold;">Correo electrónico:</span> ${this.email}
                        </p>

                        <p>
                            <span class="negrita" style="font-weight: bold;">Mensaje:</span> ${this.message}
                        </p>

                    </td>
                </tr>
            </tbody>

            <tfoot>
                <tr>
                    <td class="footer" style="background-color: #FEEEEC;padding: 3% 10%;">
                        <p>
                            Visita nuestro
                            <a href="http:localhost:4200">sitio web</a>
                            y nuestra red social
                            <a href="https://www.facebook.com/fundacionfeyaccion/">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook f logo (2019).svg" height="15px" width="15px">
                            </a>
                        </p>

                        <br>
                        <span class="copyright" style="font-size: 12px;">
                            Fundación Fé y Acción ©
                        </span>
                    </td>
                </tr>
            </tfoot>
        </table>               
        `
    }
}

export class BodyEmailVerification {
    public html: string

    constructor(
        private name: string,
        private token: string
    ) {

        this.getHtml()
    }

    getHtml() {

        this.html =
        `
        <table class="table" style="width: 100%;height: 100%;font-family: Helvetica, Arial, sans-serif;padding: 2% 15%;text-align: justify;opacity: 0.8;">
            <thead>
                <tr>
                    <td class="head" style="background-color: #FEEEEC;padding: 3% 10%;">

                        <img class="logo" src="cid:123logofundacion" alt="logo" style="float: left;height: 60px;margin-right: 10px;">
                        <h2>
                            FUNDACIÓN FE Y ACCIÓN
                        </h2>

                    </td>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td class="body-email" style="padding: 50px 10%;">

                        <h4 class="intro" style="font-style: italic;">
                            Hola, ${this.name.toUpperCase()}
                        </h4>                    

                        <p>
                            Para completar la activación de tu cuenta en "Fundación Fe y Acción" da clic en el botón de abajo.
                        </p>
                        
                        <p>
                            Ten en cuenta que éste enlace es válido solo durante 2 horas. Una vez transcurrido el plazo, deberás volver a realizar el registro.                 
                        </p>                    
                        <a href="${CLIENT_SERVERS[0]}/#/email-verification/${this.token}" class="boton_personalizado" style="text-decoration: none;padding: 10px;font-weight: 600;font-size: 16px;color: #ffffff;background-color: #1883ba;border-radius: 6px;">
                            Activar cuenta
                        </a>
                        <br>
                        <p>
                            Si tienes problemas para abrir el enlace copia y pega ésta url 
                        </p>
                        <p>
                            ${CLIENT_SERVERS[0]}/#/email-verification/${this.token}
                        </p>
                    </td>
                </tr>
            </tbody>

            <tfoot>
                <tr>
                    <td class="footer" style="background-color: #FEEEEC;padding: 3% 10%;">
                        <p>
                            Visita nuestro
                            <a href="http:localhost:4200">sitio web</a>
                            y nuestra red social
                            <a href="https://www.facebook.com/fundacionfeyaccion/">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook f logo (2019).svg" height="15px" width="15px">
                            </a>
                        </p>

                        <br>
                        <span class="copyright" style="font-size: 12px;">
                            Fundación Fé y Acción ©
                        </span>
                    </td>
                </tr>
            </tfoot>
        </table>                
        `
    }
}
