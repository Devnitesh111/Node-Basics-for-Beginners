const mongoose = require('mongoose')
const ConnectionString = "mongodb+srv://niteshthapa824:123@cluster0.jb6scw0.mongodb.net/?retryWrites=true&w=majority"
//uri use garinxa for secure
async function connectToDatabase(){
    await  mongoose.connect(ConnectionString)
    console.log("Connected To DB Successfully")
 }

 module.exports = connectToDatabase