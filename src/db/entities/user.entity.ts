import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { EncryptUtils } from '@common/utils';
import { SoftDeleteAbstractEntity } from '@common/entities/soft-delete-abstract.entity';

export enum UserRoleEnums {
  SUPER_ADMIN = 'super-admin',
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  CUSTOMER = 'customer',
}

@Entity('user')
export class UserEntity extends SoftDeleteAbstractEntity {
  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 60,
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  password: string;

  static async hashPassword(password: string) {
    return EncryptUtils.hash(password);
  }

  @Column({
    name: 'full_name',
    type: 'varchar',
    length: 180,
    nullable: false,
  })
  fullName: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  phone: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRoleEnums,
    nullable: false,
    default: UserRoleEnums.ADMIN,
  })
  role: UserRoleEnums;

  @ManyToOne(() => UserEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'created_user_id', referencedColumnName: 'id' })
  createdUser: UserEntity | null;
}
