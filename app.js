const express = require('express')
const app =  express()
const fs = require('fs')
const connectToDatabase = require('./database')
const Book = require('./model/bookModel')
//multerconfig imports
const {multer,storage} = require("./middleware/multerConfig")
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1 } // Limit file size to 1MB
})


 // Alternative 
//  const app = require('express')()
//body>raw>json for post reaction

//cors package 
const cors = require('cors')

app.use(cors({
    origin : '*' 
    // '[]'
}))

app.use(express.json())


connectToDatabase()


app.get("/",(req,res)=>{
 
    res.status(200).json({
        message : "Success"
    })
})

// create book
app.post("/book",upload.single("image"), async(req,res)=>{                  //array
console.log(req.file)
let fileName ;
if(!req.file){
    fileName = "https://th.bing.com/th/id/OIP.HGwGqH0hwUuKQqWn40hjOgHaHa?rs=1&pid=ImgDetMain"
}else{
    fileName = "http://localhost:3000/" + req.file.filename 
}
   const {bookName,bookPrice,isbnNumber,authorName,publishedAt,publication} = req.body
   
   await Book.create({
        bookName,
        bookPrice,
        isbnNumber,
        authorName,
        publishedAt,
        publication,
        imageUrl : fileName
       })
   res.status(201).json({
    message : "Book Created Successfully"
   })
})


// all read
app.get("/book",async (req,res)=>{
    const books = await Book.find() // return array ma garxa 
    res.status(200).json({
        message : "Books fetched successfully",
        data : books
    })
    // console.log(books)
})

// single read
app.get("/book/:id",async(req,res)=>{
    const id = req.params.id
   const book = await Book.findById(id) // return object garxa
   if(!book) {
    res.status(404).json({
        message : "Nothing found"
    })
   }else{
    res.status(200).json({
        message : "Single Book Fetched Successfully",
        data : book
    })
    // console.log(book)
   }
   
    
})

//delete operation
app.delete('/book/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Find the book entry by its ID
        const oldData = await Book.findById(id);
        if (!oldData) {
            return res.status(404).json({ message: "Book not found" });
        }

        const imagePath = oldData.imageUrl;
        if (!imagePath) {
            console.log("Image path not found in book entry");
        } else {
            // Extract relative path of the image
            const localhostUrlLength = `${req.protocol}://${req.get('host')}`.length;
            const newImagePath = imagePath.slice(localhostUrlLength);

            // Delete the associated image file from the server directory
            fs.unlink(`storage/${newImagePath}`, (err) => {
                if (err) {
                    console.error("Error deleting image file:", err);
                } else {
                    console.log("Image file deleted successfully");
                }
            });
        }

        // Delete the book entry from the database
        await Book.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Book and associated image deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting book:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

//update operation
app.patch("/book/:id",upload.single('image'), async (req,res)=>{
    const id = req.params.id //kun book update garney id ho yo
    const {bookName,bookPrice,isbnNumber,authorName,publishedAt,publication} = req.body
    const oldDatas = await Book.findById(id)
    let fileName;
    if(req.file){
        console.log(req.file)
        console.log(oldDatas)
 const oldImagePath = oldDatas.imageUrl
        console.log(oldImagePath)
        const localHostUrlLength = "http://localhost:3000/".length
        const newOldImagePath =oldImagePath.slice(localHostUrlLength)
        console.log(newOldImagePath)
        fs.unlink(`storage/${newOldImagePath}`,(err)=>{
            if(err){
            console.log(err)
            }else{
                console.log("File Deleted Successfully")
            }
        })
fileName ="http://localhost:3000/" + req.file.filename
    }
   await Book.findByIdAndUpdate(id,{
        bookName,
        bookPrice,
        authorName,
        publication,
        publishedAt,
        isbnNumber,
        imageUrl : fileName
    })
    res.status(200).json({
        message : "Book updated Successfully"
    })

})

app.use(express.static("./storage/"))
app.listen(3000,()=>{
    console.log("Nodejs server has started at port 3000")
})


