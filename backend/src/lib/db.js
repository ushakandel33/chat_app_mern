import mongoose from 'mongoose'

const mongo = process.env.MONGO_URI
// if(!mongo){
//     throw new Error('mongo_uri string not found')
// }
export const connectDb = async()=>{
    try {
     const conn = await mongoose.connect(process.env.MONGO_URI);
     console.log(`db connected ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1) //1 means failed
    }
}