import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain, plainToClass } from 'class-transformer';
import {
  USER_STATUS_ENUM,
  UserEntity,
} from 'src/common/database/drizzle/entities/main';
import { UserRepository } from 'src/common/database/drizzle/repositories/user.repository';
import { MessageResponseDTO } from 'src/common/interfaces/response-default';
import { HASHING_SERVICE } from 'src/common/modules/hashing/hashing.constant';
import { HashingService } from 'src/common/modules/hashing/hashing.interface';

import {
  AuthLoginDTO,
  AuthResponseDTO,
  AuthUserResponseDTO,
} from './dtos/auth-login.dto';
import { AuthRecoverPasswordDTO } from './dtos/auth-recover-parssword.dto';
import { AuthRegisterDTO } from './dtos/auth-register.dto';
import {
  GenerateTokensResponse,
  PayloadGenerateTokenDTO,
} from './dtos/index-jwt.dto';
import { EVENT_EMITTER } from 'src/common/constants/event-emitter.constant';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { GenerationHelper } from 'src/common/helpers/generation.helper';
import { DateHelper } from 'src/common/helpers/date.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    @Inject(HASHING_SERVICE) private readonly hashingService: HashingService,
    private eventEmitter: EventEmitter2,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<UserEntity>> {
    // TODO: Implementar Cache!
    const result = await this.userRepository.getOneBySingleKey('email', email);
    this.checkUserAuthorization(result);
    const valid = await this.hashingService.compare(password, result.password);
    if (!valid) throw new UnauthorizedException('Dados inválido');
    return result;
  }

  public async login(data: AuthLoginDTO): Promise<AuthResponseDTO> {
    const userResult = await this.validateUser(data.email, data.password);
    const payload = plainToClass(PayloadGenerateTokenDTO, userResult, {
      excludeExtraneousValues: true,
    });
    const tokens = this.generateTokens(payload);
    const user = plainToClass(AuthUserResponseDTO, userResult, {
      excludeExtraneousValues: true,
    });
    const response: AuthResponseDTO = { ...tokens, user };
    return response;
  }

  public async refreshToken(refreshToken: string): Promise<AuthResponseDTO> {
    let dataJwt: PayloadGenerateTokenDTO;
    try {
      dataJwt = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_AUTH_SECRET'),
      }) as PayloadGenerateTokenDTO;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
    const resultUser = await this.userRepository.getOneBySingleKey(
      'email',
      dataJwt.email,
    );
    if (!resultUser) throw new UnauthorizedException('Usuário não encontrado');
    this.checkUserAuthorization(resultUser);
    const payload = plainToClass(PayloadGenerateTokenDTO, resultUser, {
      excludeExtraneousValues: true,
    });
    const tokens = this.generateTokens(payload);
    const user = plainToClass(AuthUserResponseDTO, resultUser, {
      excludeExtraneousValues: true,
    });
    const response: AuthResponseDTO = { ...tokens, user };
    return response;
  }

  public async register(data: AuthRegisterDTO): Promise<MessageResponseDTO> {
    const existUser = await this.userRepository.getOneBySingleKey(
      'email',
      data.email,
    );
    if (existUser) throw new UnauthorizedException('Usuário já cadastrado');
    const password = await this.hashingService.hash(data.password);
    const user = await this.userRepository.insert({
      email: data.email,
      password,
      status: USER_STATUS_ENUM.PENDING,
    });

    if (!user) throw new UnauthorizedException('Erro ao cadastrar usuário');
    return { message: 'Usuário cadastrado com sucesso' };
  }

  public async recoverPassword(
    data: AuthRecoverPasswordDTO,
  ): Promise<MessageResponseDTO> {
    const resultUser = await this.userRepository.getOneBySingleKey(
      'email',
      data.email,
    );
    if (!resultUser) throw new UnauthorizedException('Usuário não encontrado');
    const code = GenerationHelper.code(6);
    const passwordResetExpiresAt = DateHelper.generateFutureTime('minutes', 30);

    await this.userRepository.updateById(resultUser.id, {
      passwordResetCode: code,
      passwordResetExpiresAt,
    } as Partial<UserEntity>);

    const mail: ISendMailOptions = {
      to: data.email,
      subject: 'Recuperação de senha',
      template: 'recover-password',
      context: {
        code,
        email: data.email,
        link: 'http://localhost:3000/recover-password',
      },
    };
    this.eventEmitter.emit(EVENT_EMITTER.MAIL_SEND, mail);
    return { message: 'E-mail enviado com sucesso' };
  }

  private checkUserAuthorization(user: Partial<UserEntity>): void {
    if (!user) throw new UnauthorizedException('Dados inválido');
    if (!user.tenantId) throw new UnauthorizedException('Usuário sem tenant');
    if (user.status === USER_STATUS_ENUM.BLOCKED)
      throw new UnauthorizedException('Usuário bloqueado');
    if (user.status === USER_STATUS_ENUM.PENDING)
      throw new UnauthorizedException('Usuário pendente de ativação');
    if (user.status === USER_STATUS_ENUM.DEACTIVATED)
      throw new UnauthorizedException('Usuário desativado');
  }

  private generateAccessToken(payload: PayloadGenerateTokenDTO): string {
    const plainPayload = instanceToPlain(payload);
    return this.jwtService.sign(plainPayload);
  }

  private generateRefreshToken(payload: PayloadGenerateTokenDTO): string {
    const plainPayload = instanceToPlain(payload);
    return this.jwtService.sign(plainPayload, {
      secret: this.configService.get('JWT_REFRESH_AUTH_SECRET'),
      expiresIn: '7d',
    });
  }

  private generateTokens(
    payload: PayloadGenerateTokenDTO,
  ): GenerateTokensResponse {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}
