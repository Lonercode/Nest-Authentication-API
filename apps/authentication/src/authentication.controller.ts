import { Controller, Post, Res, UseGuards, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CurrentUser } from '@app/common/decorators/currentUser.decorator';
import { UsersDocument } from './schema/users.schema';
import { Response } from 'express';
import { localAuthGuard } from '@app/common/guards/localAuth.guard';
import { VerifyUserDto } from './dto/verifyUser.dto';


@Controller('users')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(localAuthGuard)
  @Post('login')
  async Login(@CurrentUser() user: UsersDocument, @Res({passthrough: true}) response: Response){
    await this.authenticationService.Login(user, response);
  }


}
