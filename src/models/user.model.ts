import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { Sale } from "./sale.model";
import { IsDefined, IsNotEmpty, IsEmail, IsInt, IsNumberString, ValidateIf } from "class-validator";
import { UniqueEmail } from "../custom_validations/UniqueEmail";


@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;



  @Column({unique: true})
  @IsNotEmpty({ message: 'El email no debe estar vacío' })
  @IsEmail(undefined,{message:'Debe escribir un correo válido'})
  @UniqueEmail({message: "El correo ya está registrado."})
  email: string;
  
  @Column({select: false})
  @IsNotEmpty({ message: 'La contraseña no debe estar vacío' })
  password: string;
  
  @Column()
  @IsNotEmpty({ message: 'El nombre y apellido no debe estar vacío' })
  fullName: string;

  @Column({nullable: true})
  address: string;

  @Column({nullable: true})
  @ValidateIf((o) => {
    if(o.phone === "" || o.phone === null || o.phone === undefined){
      return false;
    }
    return true;
  })
  @IsNumberString({no_symbols: true},{message: 'Debe escribir un teléfono válido'})
  phone: string;

  @Column({ default: false})
  isAdmin: boolean





  @CreateDateColumn({ type: "datetime", select: false})
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime", select: false})
  updatedAt: Date;

  @DeleteDateColumn({ type: "datetime", select: false}) 
  deletedAt: Date;




  @OneToMany(type => Sale, sale => sale.user)
  sales: Sale[];
}