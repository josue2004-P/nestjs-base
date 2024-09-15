import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService:JwtService
  ) {}

  async register({ password, email, name }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      message: 'User created successfully',
      name,
      email
    };
  }

  async login({ password, email }: LoginDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Email already exists');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { 
      id: user.id, 
      email:user.email,
      role:user.role
     };

    const token = await this.jwtService.signAsync(payload);

    return {
      token: token,
      email: user.email,
      role: user.role
    };
  }

  async profile({email,role}: {email:string,role:string}){


    // if(role !== "admin"){
    //   throw new UnauthorizedException(
    //     'You are not authorized to acces this resource'
    //   )
    // }

    return await this.usersService.findOneByEmail(email)
  }
}
