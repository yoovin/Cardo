import {Schema, Model, model} from 'mongoose'
import user from '../interface/user'

// import { AutoIncrementSimple } from '@typegoose/auto-increment'

interface userModel extends Model<user>{}

const UserSchema = new Schema<user, userModel>({
    userid: {
        type: String,
        required: true,
        unique: true
    },
    nickname: {
        type: String,
        required: true
    },
})

export default model<user, userModel>('User', UserSchema)