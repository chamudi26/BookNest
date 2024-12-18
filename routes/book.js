const router = require("express").Router();
const User = require("../models/user");
const jwt=require("jsonwebtoken");
const Book=require("../models/book");
const {authenticateToken}=require("./userAuth");

//add book --admin
router.post("/add-book",authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const user=await User.findById(id);
        if(user.role !== "admin"){
            return res
            .status(400)
            .json({message:"you do not have access to perform admin works"});
        }
        const book=new Book({
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
           language:req.body.language
            
        });
        await book.save();
        res.status(200).json({message:"book added succes"});

    }catch(error){
        console.error("Error adding book:", error.message);  
        res.status(500).json({message:"internal server error"});

    }
});

//update book
router.put("/update-book",authenticateToken,async(req,res)=>{
    try{
        const {bookid}=req.headers;
        await Book.findByIdAndUpdate(bookid,{
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
            language:req.body.language,
        });
        
        
        return res.status(200).json({
            message:"book updated succes",
        });

    }catch(error){
        console.log(error);
         return res.status(500).json({message:"an error occurred"});

    }
});

//delete book
router.delete("/delete-book",authenticateToken,async(req,res)=>{
    try{
        const {bookid}=req.headers;
        await Book.findByIdAndDelete(bookid);
        
        
        return res.status(200).json({
            message:"book deleted succes",
        });

    }catch(error){
        console.log(error);
         return res.status(500).json({message:"an error occurred"});

    }
});

//get all books
router.get("/get-all-book",async(req,res)=>{
    try{
        const books=await Book.find().sort({createdAt:-1});
        return res.json({
            status:"success",
            data:books,
        });

    }catch(error){
        console.log(error);
         return res.status(500).json({message:"an error occurred"});

    }
});

//get recently added books limit 4
router.get("/get-recent-book",async(req,res)=>{
    try{
        const books=await Book.find().sort({createdAt:-1}).limit(4);
        return res.json({
            status:"success",
            data:books,
        });

    }catch(error){
        console.log(error);
         return res.status(500).json({message:"an error occurred"});

    }
});

//get book by id
router.get("/get-book-by-id/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const book=await Book.findById(id);
        return res.json({
            status:"success",
            data:book,
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({message:"an error occurred"});

    }
});


//get all book titles
router.get("/get-all-book-titles", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }); // Fetch all books
        const titles = books.map(book => book.title); // Extract titles
        return res.json({
            status: "success",
            data: titles, // Return only titles
        });
    } catch (error) {
        console.error("Error fetching book titles:", error.message);
        return res.status(500).json({ message: "An error occurred" });
    }
});





module.exports=router;