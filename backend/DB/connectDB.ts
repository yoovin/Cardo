import mongoose from "mongoose"

const connectDB: Function = () => {
    mongoose.connect("mongodb://host.docker.internal/YVTodo")
}

export default connectDB