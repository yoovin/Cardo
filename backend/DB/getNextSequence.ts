// import connectDB from "./connectDB";
import Counters from "./model/Counters";

const getNextSequence = async (name: string) => {
    let ret = await Counters.findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { returnNewDocument: true }
    ).exec()
    if(ret != null){
        return ret.seq
    }else{
        console.log('null')
        await new Counters({_id: name, seq: 2}).save()
        return 1
    }
}

export default getNextSequence