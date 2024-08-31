import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PublicRouter } from 'src/common/decorators/api/public-router.decorator';
import { ApiResponseType } from 'src/common/decorators/swagger/response.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import { AuthService } from './auth.service';
import { AuthLoginDTO, AuthResponseDTO } from './dtos/auth-login.dto';
import { AuthRefreshTokenDTO } from './dtos/auth-refresh-token.dto';
import { MessageResponseDTO } from 'src/common/interfaces/response-default';
import { AuthRecoverPasswordDTO } from './dtos/auth-recover-parssword.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponseType(AuthResponseDTO)
  @PublicRouter()
  @Post('login')
  async login(
    @Body() data: AuthLoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(data);
    return this.responseAuthentication(result, response);
  }

  @ApiResponseType(AuthResponseDTO)
  @PublicRouter()
  @Post('refresh-token')
  async refreshToken(
    @Body() data: AuthRefreshTokenDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.refreshToken(data.refreshToken);
    return this.responseAuthentication(result, response);
  }

  @ApiResponseType(MessageResponseDTO)
  @UseGuards(JwtAuthGuard)
  @PublicRouter()
  @Post('register')
  async register(@Body() data: AuthLoginDTO) {
    return await this.authService.register(data);
  }

  @ApiResponseType(MessageResponseDTO)
  @PublicRouter()
  @Post('recover-password')
  async recoverPassword(@Body() data: AuthRecoverPasswordDTO) {
    return await this.authService.recoverPassword(data);
  }

  private responseAuthentication(data: AuthResponseDTO, response: Response) {
    response.cookie('accessToken', data.accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 20,
    });
    response.cookie('refreshToken', data.refreshToken, {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 2,
    });
    response.json(data);
  }
}
