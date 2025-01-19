import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from 'src/helpers/isPublic';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
      return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @Public()
    @Post('signUp')
    createUser(
      @Body() dto: CreateUserDto,
    ) {
      return this.authService.signUp(dto);
    }

    @Get('profile')
    getProfile(@Request() req) {
      return this.authService.getCards(req.user.username);
      // return req.user;
    }
  }
