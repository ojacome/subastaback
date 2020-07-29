//Puerto
export const SERVER_PORT: number = Number( process.env.PORT ) || 3900;


//secret key jwt
export const SEED = 'toGu8/v2/we6L0eorUWp1JFY9ZaInKNJWLJV4ujN76E=';
export const refreshSEED = 'ABaJas0nxRf5vdAmfUMZMh5J5yksr0qOn52TiDWHFdU=';


// CORS options
let whitelist = ['http://localhost:4200', 'http://localhost']
export const corsOptions = {
    origin: function (origin:any, callback:any) {
        // if (whitelist.indexOf(origin) !== -1 ) {
        if (whitelist.indexOf(origin) !== -1 || !origin) { // || !origin para que funcione postman eliminar despues
          callback(null, true);
        } else {
          callback(new Error('No permitido por CORS'));
        }
      },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    allowedHeaders: "Origin,X-Requested-With,Content-Type,Authorization,Accept,Access-Control-Allow-Origin",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  };