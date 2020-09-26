import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { User } from '../models/user.model'
import bcrypt from 'bcryptjs';
 
export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        { 
            email:          'feyaccion.sis@gmail.com.com',
            fullName:       'admin ',
            password:       bcrypt.hashSync('12345678', 10),
            isAdmin:        true,
            address:        'fundacion dir',
            phone:          '0969778869',            
        },
      ])
      .execute()
  }
}