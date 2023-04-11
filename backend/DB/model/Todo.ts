import {Schema, Model, model} from 'mongoose'
import todo from '../interface/todo'
import todoContent from '../interface/todoContent'

// import { AutoIncrementSimple } from '@typegoose/auto-increment'

interface todoModel extends Model<todo>{}

const TodoSchema = new Schema<todo, todoModel>({
    userid: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    todos: Array<todoContent>,
    color: Array<String>,
})

export default model<todo, todoModel>('Todo', TodoSchema)