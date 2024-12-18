const router=require("express").Router();
const User=require("../models/user");
const {authenticateToken}=require("./userAuth");

//add book to favourite
router.put("/add-book-to-fav",authenticateToken,async(req,res)=>{
    try{
        const{bookid,id}=req.headers;
        const userData=await User.findById(id);
        const isBookFav=userData.favourites.includes(bookid);
        if(isBookFav){
            return res.status(200).json({message:"book is already in favourites"});
        }
        await User.findByIdAndUpdate(id,{$push:{favourites:bookid}});
        return res.status(200).json({message:"book added to favourites"});

    }catch(error){
        res.status(500).json({message:"internal server error"});
    }
});

//delete book from fav
router.put("/remove-book-from-fav",authenticateToken,async(req,res)=>{
    try{
        const{bookid,id}=req.headers;
        const userData=await User.findById(id);
        const isBookFav=userData.favourites.includes(bookid);
        if(isBookFav){
            await User.findByIdAndUpdate(id,{$pull:{favourites:bookid}});
        }
        
        return res.status(200).json({message:"book removed from favourites"});

    }catch(error){
        res.status(500).json({message:"internal server error"});
    }
});

//get fav books of a particular user
router.get("/get-fav-books",authenticateToken,async(req,res)=>{
    try{
        const{id}=req.headers;
        const userData=await User.findById(id).populate("favourites");
        const favouriteBooks=userData.favourites;
        return res.json({
            status:"success",
            data:favouriteBooks,
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({message:"an error occured"});
    }
});
module.exports=router;