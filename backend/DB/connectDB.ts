import mongoose from "mongoose"

const connectDB: Function = () => {
    mongoose.connect("mongodb://localhost/YVTodo")
}

export default connectDB