import { Injectable, UnprocessableEntityException, UnauthorizedException, Inject } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUsersDto } from '../dto/createUsers.dto';
import * as bcrypt from 'bcryptjs'
import { GetUserDto } from '../dto/getUser.dto';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { TokenPayload } from '@app/common/interfaces/tokenPayload.interface';


@Injectable()
export class UsersService {
    constructor( private readonly usersRepository: UsersRepository,
      private readonly jwtService: JwtService,
      @Inject('NOTIFICATIONS_SERVICE') private client: ClientProxy){}

      //Private Functions 


    private async validateCreateUserDto(createUserDto: CreateUsersDto) {
      try {
        await this.usersRepository.findOne({ email: createUserDto.email });
  
      } catch (error) {
        return; 
      }
  
      throw new UnprocessableEntityException('Email already exists')
    }

    //Endpoints

    async signUp(createUserDto: CreateUsersDto){
      
        await this.validateCreateUserDto(createUserDto);
            const newUser = await this.usersRepository.create({
                ...createUserDto,
                password: await bcrypt.hash(createUserDto.password, 10),
                verified: false
            })
            const tokenLoad: TokenPayload = {
              userId: newUser._id.toHexString()
            }
            const token = this.jwtService.sign(tokenLoad)
          const link = `${process.env.CLIENT_URL}/confirm?_id=${newUser._id}&token=${token}`
            const email = newUser.email
            const name = newUser.name

            this.client.emit('send_email', {
              email: email,
              subject: 'Account Verification',
              template: 'confirmation',
              context: { 
                name: name,
                link: link
              }
            });
        
            /* Here, the link is returned for testing purposes.
            It would also however be sent to the email from which
            it would be clicked and the user confirmed. Since this is
            not linked to any frontend technologies at present,
            this would suffice for now...for testing.
            */
           
            return {
              message: 'Verification link sent to email',
              link: link,
            }
  }


  // Get user for validation

    async getUser(user: GetUserDto){
        const aUser = await this.usersRepository.findOne(user)
        return aUser;
    }
    
    // Verify user for login
    
    async verifyUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({ email });
        const passwordIsValid = await bcrypt.compare(password, user.password);
    
        if(!passwordIsValid) {
          throw new UnauthorizedException('Credentials are not valid');
        }
    
        return user;
      }

      // Update user verification to true after link is clicked so that user may log in

      async confirmUser(id: GetUserDto, token: string){
        const confirmedUser = await this.usersRepository.findOne(id);
        if (confirmedUser && token){
          const updatedUser = await this.usersRepository.findOneAndUpdate(
            {email: confirmedUser.email}, 
            {$set: {verified: true}},
            )
          return {
            message: "You have been verified! You can successfully login now",
            updatedUser: updatedUser //Updated user is only sent for testing purposes
          }
        }
        return {
          message: "Oops! Confirm your account or register."
        }
      }

}


  