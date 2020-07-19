import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator} from "class-validator";
import { getManager } from "typeorm";
import { User } from "../models/user.model";

@ValidatorConstraint({ name: "uniqueEmail", async: true })
export class UniqueEmailConstraint implements ValidatorConstraintInterface {


    async validate(value: any, args: ValidationArguments) {

        const userRepository = getManager().getRepository(User);

        return new Promise<boolean>( async (resolve, reject) => {
            
        let existe = await userRepository.findOne({email: value});
        
            if (existe){
                resolve(false)
            }else {
                resolve(true);
            }
        });
    }

}


export function UniqueEmail(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: UniqueEmailConstraint
        });
    };
}