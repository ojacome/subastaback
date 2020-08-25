import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne, OneToOne } from "typeorm";
import { ImageProduct } from "./image_product.model";
import { IsEmail, IsEnum, IsDefined, IsNotEmpty, ValidateIf, IsNumber, Min } from "class-validator";
import { Category } from "./category.model";
import { Sale } from "./sale.model";



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
  @Min(5,{message: 'La mínima cantidad es de 5.'})
  price: number;

  @Column({ default: true })
  isActive: boolean





  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "datetime" })
  deletedAt: Date;



  @OneToOne(type => Sale, sale => sale.product) // specify inverse side as a second parameter
  sale: Sale;

  @OneToMany(type => ImageProduct, image => image.product)
  images: ImageProduct[];

  @ManyToOne(type => Category, category => category.products)
  category: Category
}