import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { Sale } from "./sale.model";
import { IsDefined, IsNotEmpty, IsEmail, IsInt, IsNumberString, ValidateIf, MinLength, Matches, Length } from "class-validator";
import { UniqueName } from "../custom_validations/UniqueName";


@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;



  @Column({
    unique: true,
    length: 30,
  })
  @IsNotEmpty({ message: 'El email no debe estar vacío' })
  @IsEmail(undefined,{message:'Debe escribir un correo válido'})
  @ValidateIf( o => !o.id)
  @UniqueName(User)
  email: string;
  
  @Column({
    select: false,
    length: 100
  })
  @IsNotEmpty({ message: 'La contraseña no debe estar vacío' })
  @Matches(/(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{8,}/,{ message: 'Escriba mínimo 8 caracteres, con al menos letras y números.'})
  password: string;
  
  @Column({ length: 150})
  @IsNotEmpty({ message: 'El nombre y apellido no debe estar vacío' })
  @Length(2, 150)
  fullName: string;

  @Column({
    nullable: true,
    length: 200
  })
  @ValidateIf((o) => {
    if(o.address === "" || o.address === null || o.address === undefined){
      return false;
    }
    return true;
  })
  @Length(3, 200)
  address: string;

  @Column({
    nullable: true,
    length: 20
  })
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