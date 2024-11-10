import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from '../users/api-keys/entities/api-key.entity';
import { User } from '../users/entities/user.entity';
import { ApiKeysService } from './authentication/api-keys.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { ApiKeyGuard } from './authentication/guards/api-key.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import { PoliciesGuard } from './authorization/guards/policies.guard';
import { FrameworkContributorPolicyHandler } from './authorization/policies/framework-contributor.policy';
import { PolicyHandlersStorage } from './authorization/policies/policy-handlers.storage';
import jwtConfig from './config/jwt.config';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { GoogleAuthenticationService } from './authentication/social/google-authentication.service';
import { GoogleAuthenticationController } from './authentication/social/google-authentication.controller';
import { OtpAuthenticationService } from './authentication/otp-authentication.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ApiKey]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
    AccessTokenGuard,
    ApiKeyGuard,
    AuthenticationService,
    RefreshTokenIdsStorage,
    PolicyHandlersStorage,
    FrameworkContributorPolicyHandler,
    ApiKeysService,
    GoogleAuthenticationService,
    OtpAuthenticationService,
  ],
  controllers: [AuthenticationController, GoogleAuthenticationController],
})
export class IamModule {}
