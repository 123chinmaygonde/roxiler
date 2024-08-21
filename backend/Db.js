const mongoose= require("mongoose")

const ConnectDb=async()=>{
    try {
        await mongoose.connect('mongodb+srv://chinmay:<db_password>@cluster0.phh0z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log("mongodb connected")
        
    } catch (error) {
        console.log(error.message)
        process.exit(1);
        
    }

    module.exports=ConnectDb
}