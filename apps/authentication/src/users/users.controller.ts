import { Controller, Post, Get, Body, Delete, Query, Param} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from '../dto/createUsers.dto';
import { GetUserDto } from '../dto/getUser.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    // Sign up User
    @Post('signUp')
    async signUp(@Body() createUsersDto: CreateUsersDto){
        return this.usersService.signUp(createUsersDto)
     }

     // Get user for validation
     @Get()
     async getUser(@Query() user: GetUserDto){
        return this.usersService.getUser(user)
     }

      // Confirm user after email verification
     @Get('confirm')
     async confirmUser(@Query() id: GetUserDto, @Query() token: string){
      return this.usersService.confirmUser(id, token)
     }
     
  
}
