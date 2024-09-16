import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Roles } from './decorators/role.decorator';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { Role } from './enums/role.enum';
import { Auth } from './decorators/auth.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: { email: string; role: string };
}

@Controller('auth')
@ApiTags('Auth')

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() userLogin: LoginDto) {
    return this.authService.login(userLogin);
  }

  @Post('register')
  register(@Body() userRegister: RegisterDto) {
    return this.authService.register(userRegister);
  }

  @Get('profile')
  @ApiBearerAuth()
  @Auth(Role.USER)
  profile(
    @Request()
    req: RequestWithUser,
  ) {
    return this.authService.profile(req.user);
  }
}
