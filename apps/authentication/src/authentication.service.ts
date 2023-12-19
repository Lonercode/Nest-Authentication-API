import { TokenPayload } from '@app/common/interfaces/tokenPayload.interface';
import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService} from '@nestjs/jwt';
import { UsersDocument } from './schema/users.schema';
import { Response } from 'express';
import { VerifyUserDto } from './dto/verifyUser.dto';
import { UsersRepository } from './users/users.repository';

@Injectable()
export class AuthenticationService {
  constructor(private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersRespository: UsersRepository){}
  
    // Login user

    async Login(user: UsersDocument, response: Response){
    const exist = await this.usersRespository.findOne({email: user.email})
    
    if (exist.verified == true){
      const tokenPayload:TokenPayload = {
      userId: user._id.toHexString()
    }
    
    const expires = new Date()
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION')
    )

    const token = this.jwtService.sign(tokenPayload)
    
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    })
    response.send(`${exist.name} is logged in!`)
  }
  throw new UnauthorizedException("You must register first!")
    }  
  }
  

 

