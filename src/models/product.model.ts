import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { ImageProduct } from "./image_product.model";
import { IsEmail, IsEnum, IsDefined, IsNotEmpty, ValidateIf } from "class-validator";



@Entity()
export class Product {

  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  @IsDefined({ message: 'El nombre no debe ser nulo o indefinido' })
  @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
  name: string;

  @Column()
  @IsDefined({ message: 'La descripcion no debe ser nulo o indefinido' })
  @IsNotEmpty({ message: 'La descripcion no debe estar vacío' })
  description: string;

  @Column({ default: true })
  isActive: boolean





  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "datetime" })
  deletedAt: Date;





  @OneToMany(type => ImageProduct, image => image.product)
  images: ImageProduct[];
}