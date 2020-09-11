import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { Product } from './product.model';



@Entity()
export class ImageProduct {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  filename: string;    




  @ManyToOne(type => Product , product => product.images)
  product: Product;

}

