import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'apps/authentication/src/users/users.service';
import { Strategy, ExtractJwt } from 'passport-jwt'
import { TokenPayload } from '../interfaces/tokenPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(configService: ConfigService,
        private readonly usersService: UsersService )
        {
            super({
                jwtFromRequest: ExtractJwt.fromExtractors([
                    (request: any) => 
                    request?.cookies?.Authentication || request?.Authentication,
                ]),
                secretOrKey: configService.get('JWT_SECRET')
            })
        }   

        async validate({userId}: TokenPayload){
            const user = await this.usersService.getUser({_id: userId})
            return user;
        }
}

