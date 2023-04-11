import {Schema, Model, model} from 'mongoose'
import counters from '../interface/counters'

interface counterModel extends Model<counters>{}

const CounterSchema = new Schema<counters, counterModel>({
    _id: String,
    seq: {type: Number, default: 1}
})

export default model<counters, counterModel>('Counter', CounterSchema)