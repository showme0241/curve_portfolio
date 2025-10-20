import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

enum UserAction {
  LOGIN = '로그인',
  LOGOUT = '로그아웃',
  REGISTER = '회원가입',
  DELETE_ACCOUNT = '회원탈퇴',
}

enum UserInfoLevel {
  SECURITY = '보안',
  PERSONAL = '개인',
  PUBLIC = '일반',
}

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  idx: number;

  @ManyToOne(() => User, (user) => user.logs)
  user: User;

  @Column({
    type: 'enum',
    enum: UserAction,
  })
  action: UserAction;

  @Column({ type: 'varchar', nullable: true })
  ip?: string;

  @Column({ type: 'varchar', nullable: true })
  userAgent?: string;

  @Column({
    type: 'enum',
    enum: UserInfoLevel,
    nullable: true,
  })
  infoLevel: UserInfoLevel;

  @CreateDateColumn()
  createdAt: Date;
}
