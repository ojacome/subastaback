import { CLIENT_SERVERS } from "../global/environment"

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
        <table class="table" style="background-color: #FEEEEC;width: 100%;height: 100%;text-align: center;font-family: Helvetica, Arial, sans-serif;opacity: 0.8;">
            <thead class="head">
                <tr>
                    <td style="display: table-cell;vertical-align: inherit;border-bottom: 1px solid #ddd;">
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
                    <td style="display: table-cell;vertical-align: inherit;border-bottom: 1px solid #ddd;">
                        <br>

                        <h4 class="intro" style="font-style: italic;">
                            Estimado/a ${this.name.toUpperCase()},
                        </h4>
                        <br>
                        <br>
                        <p>
                            Tu oferta realizada al producto ${this.nameProduct.toUpperCase()} fue aceptada ingresa a 
                            
                            <a href="http://localhost:4200/#/cart">
                                éste 
                            </a>
                            enlace para cancelar el valor del mismo
                        </p>
                        <br>
                    </td>
                </tr>
            </tbody>

            <tfoot class="footer" style="background-color: #edd7d4;">
                <tr>
                    <td style="display: table-cell;vertical-align: inherit;border-bottom: 1px solid #ddd;">
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

export class BodyAdminPay {
    public html: string

    constructor(
        private nameClient: string,
        private nameProduct: string,
        private emailClient: string
    ) {

        this.getHtml()
    }

    getHtml() {

        this.html =
            `
        <table class="table" style="background-color: #FEEEEC;width: 100%;height: 100%;text-align: center;font-family: Helvetica, Arial, sans-serif;opacity: 0.8;">
            <thead class="head">
                <tr>
                    <td style="display: table-cell;vertical-align: inherit;border-bottom: 1px solid #ddd;">
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
                    <td style="display: table-cell;vertical-align: inherit;border-bottom: 1px solid #ddd;">
                        <br>

                        <h4 class="intro" style="font-style: italic;">
                            Mensaje al administrador,
                        </h4>
                        <br>
                        <p>
                            Se realizó el pago de una subasta. 
                            A continuación los detalles para que te pongas en contacto para coordinar la entrega.
                        </p>

                        <br>
                        <p>
                            Nombre del producto: 
                            <b>
                                ${this.nameProduct.toUpperCase()}     
                            </b> 
                        </p>
                        <p>
                            Nombre del comprador: 
                            <b>
                                ${this.nameClient.toUpperCase()}
                            </b>                        
                        </p>
                        <p>
                            Correo electrónico: ${this.emailClient}
                        </p>

                        <br>
                        <p> 
                            También puedes ingresar a                       
                            <a href="http://localhost:4200/#/dashboard">
                                éste 
                            </a>
                            enlace para obtener más detalles de la subasta.
                        </p>
                        <br>
                    </td>
                </tr>
            </tbody>

            <tfoot class="footer" style="background-color: #edd7d4;">
                <tr>
                    <td style="display: table-cell;vertical-align: inherit;border-bottom: 1px solid #ddd;">
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
                    <td>
                        <br>
    
                        <h4 class="intro" style="font-style: italic;">
                            Hola ${this.nameClient.toUpperCase()},
                        </h4>
                        <br>      
                                      
                        <p>
                            Solicitaste el cambio de contraseña, para tu cuenta en Fundación Fé y Acción
                        </p>                    
                        <p>
                            Ingresa al enlace en el botón de abajo para que puedas guardar la nueva constraseña                         
                        </p>
                        <a href="${CLIENT_SERVERS[0]}/#/forgot-password/${this.token}" class="boton_personalizado" style="text-decoration: none;padding: 10px;font-weight: 600;font-size: 16px;color: #ffffff;background-color: #1883ba;border-radius: 6px;border: 2px solid #0016b0;">
                            Cambiar contraseña
                        </a>
                        <p>
                            Si no solicitaste cambiar  tu contraseña ignora éste correo o póngase en contacto con nosotros.
                        </p>
                        <p>Gracias</p>
                        <p>Si tienes problemas para abrir el enlace copia y pega el sigiente URL en su navegador web</p>
                        <p>${CLIENT_SERVERS[0]}/#/forgot-password/${this.token}</p>
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

export let body =
    `
<table class="table" style="background-color: #FEEEEC;width: 100%;height: 100%;text-align: center;font-family: Helvetica, Arial, sans-serif;opacity: 0.8;">
        <thead class="head">
            <tr>
                <td style="display: table-cell;vertical-align: inherit;border-bottom: 1px solid #ddd;">
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
                <td style="display: table-cell;vertical-align: inherit;border-bottom: 1px solid #ddd;">
                    <br>

                    <h4 class="intro" style="font-style: italic;">
                        Mensaje al administrador,
                    </h4>
                    <br>
                    <br>
                    <p>
                        Se registraron nuevas ofertas, porfavor ingresa en el siguiente 
                        <a href="http://localhost/#/dashboard">
                            enlace
                        </a>
                    </p>
                    <br>
                </td>
            </tr>
        </tbody>

        <tfoot class="footer" style="background-color: #edd7d4;">
            <tr>
                <td style="display: table-cell;vertical-align: inherit;border-bottom: 1px solid #ddd;">
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
