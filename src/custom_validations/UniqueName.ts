import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import { getManager } from 'typeorm';

 
@ValidatorConstraint({ async: true })
export class UniqueOnDatabaseExistConstraint implements ValidatorConstraintInterface {
 
    async validate(value: any, args: ValidationArguments) {

        const model = args.targetName;
        
        const entity = await getManager().getRepository(model).findOne({ [args.property]: value });
         
        if (entity){
            if ((entity as any)['id'] != (args.object as any)['id'] ){
                return false;
            }else {
                return true;
            }
        }else {
            return true;
        }       
    }
}
 
export function UniqueName(entity: Function, validationOptions?: ValidationOptions) {
    validationOptions = { ...{ message: '$value ya se encuentra registrado.' }, ...validationOptions };    
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: UniqueOnDatabaseExistConstraint
        });
    };
}