import { AbstractDocument } from '@app/common/database';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'



@Schema({versionKey: false})
export class UsersDocument extends AbstractDocument{
    @Prop()
    name: string

    @Prop()
    email: string

    @Prop()
    password: string

    @Prop({ default: false})
    verified: boolean;

}

export const UsersSchema = SchemaFactory.createForClass(UsersDocument)
