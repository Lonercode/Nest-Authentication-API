import { AbstractRepository } from "@app/common/database";
import { Injectable, Logger } from "@nestjs/common";
import { UsersDocument } from "../schema/users.schema";
import { Model, Connection } from 'mongoose'
import { InjectModel, InjectConnection} from '@nestjs/mongoose'

@Injectable()
export class UsersRepository extends AbstractRepository<UsersDocument>{
    protected readonly logger = new Logger(UsersRepository.name)

    constructor(@InjectModel(UsersDocument.name) usersModel: Model<UsersDocument>,
    @InjectConnection() connection: Connection){
        super(usersModel, connection)
    }
}