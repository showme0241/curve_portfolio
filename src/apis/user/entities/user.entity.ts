import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Log } from './log.entity';

export enum Role {
  SUPER = '최고 관리자',
  ADMIN = '관리자',
  USER = '일반 사용자',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  profileImg: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Log, (log) => log.user)
  logs: Log[];
}
