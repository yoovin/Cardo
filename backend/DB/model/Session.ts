import {Schema, Model, model} from 'mongoose'
import session from '../interface/session'

interface sessionModel extends Model<session>{}

const SessionSchema = new Schema<session, sessionModel>({
    sessionid: {
        type: String,
        required: true,
        unique: true
    },
    userid: {
        type: String,
        required: true
    }
})

export default model<session, sessionModel>('Session', SessionSchema)