import mongoose from "mongoose"

const connectDB: Function = () => {
    // mongoose.connect("mongodb://host.docker.internal/YVTodo")
    mongoose.connect("mongodb://localhost/YVTodo")
}

export default connectDB