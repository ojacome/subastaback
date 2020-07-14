import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { ImageProduct } from "./image_product.model";


@Entity()
export class Product {

  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: true})
  isActive: boolean





  @CreateDateColumn({ type: "datetime"})
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime"})
  updatedAt: Date;

  @DeleteDateColumn({ type: "datetime"}) 
  deletedAt: Date;





  @OneToMany(type => ImageProduct, image => image.product)
  images: ImageProduct[];
}