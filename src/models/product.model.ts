import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { ImageProduct } from "./image_product.model";
import { IsEmail, IsEnum, IsDefined, IsNotEmpty, ValidateIf, IsNumber, Min } from "class-validator";



@Entity()
export class Product {

  @PrimaryGeneratedColumn()
  id: number;


  @Column()  
  @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
  name: string;

  @Column()
  @IsNotEmpty({ message: 'La descripcion no debe estar vacío' })
  description: string;

  @Column({type: 'double'})
  @IsNotEmpty({ message: 'El precio no debe estar vacío' })
  @IsNumber({maxDecimalPlaces: 2},{message: 'El número ingresado es inválido'})
  @Min(1,{message: 'La mínima cantidad es de 1.'})
  price: number;

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