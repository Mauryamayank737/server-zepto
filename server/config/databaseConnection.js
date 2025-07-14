import mongoose from 'mongoose'

export const DataBaseConnection = async()=>{
try {
   await mongoose.connect(process.env.DB_URL)
   console.log("database connected successfuly")
} catch (error) {
    console.log("database not connected" ,error.message)
}
}