const router = require("express").Router();
const User = require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {authenticateToken}=require("./userAuth");


//sign up
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // Check username length is more than 3
        if (username.length < 4) {
            return res
                .status(400)
                .json({ message: "Username length should be greater than 3" });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return res
                .status(400)
                .json({ message: "Username already exists" });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res
                .status(400)
                .json({ message: "Email already exists" });
        }

        // Check password length
        if (password.length <= 5) {
            return res
                .status(400)
                .json({ message: "Password length should be greater than 5" });
        }

        const hashPass=await bcrypt.hash(password,10);

        const newUser = new User({
            username: username,
            email: email,
            password: hashPass,
            address: address,
        });
        await newUser.save();

        return res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//sign in
router.post("/sign-in", async (req, res) => {
    try {
        const {username,password}=req.body;
        const existingUser=await User.findOne({username});
        if(!existingUser)
        {
            res.status(400).json({ message: "invalid credentials" });

        }

        await bcrypt.compare(password,existingUser.password,(err,data)=>{
            if(data)
            {
                const authClaims=[
                    {name:existingUser.username},
                    {role:existingUser.role},
                ];
                const token=jwt.sign({authClaims},"bookstore123",{
                    expiresIn:"30d",
                })
                res.status(200).json({
                    id:existingUser._id,
                    role:existingUser.role,
                    token:token });
            }
            else{
                res.status(400).json({ message: "invalid credentials" });
            }

        });
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});

//get user information
router.get("/get-user-information",authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const data=await User.findById(id).select('-password');
        return res.status(200).json(data);


    }catch(error){
        res.status(500).json({ message: "internal server error" });
    }
});

//update address
router.put("/update-address",authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const {address}=req.body;
        await User.findByIdAndUpdate(id,{address:address});
        return res.status(200).json({message:"Address Updated"})

    }catch(error){
        res.status(500).json({ message: "internal server error" })
    }
});
//update name
router.put("/update-name",authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const {username}=req.body;
        await User.findByIdAndUpdate(id,{username:username});
        return res.status(200).json({message:"Name Updated"})

    }catch(error){
        res.status(500).json({ message: "internal server error" })
    }
});
//update email
router.put("/update-email",authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const {email}=req.body;
        await User.findByIdAndUpdate(id,{email:email});
        return res.status(200).json({message:"Email Updated"})

    }catch(error){
        res.status(500).json({ message: "internal server error" })
    }
});
router.put("/update-all", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
      const { address, username, email } = req.body;
  
      // Update multiple fields at once
      await User.findByIdAndUpdate(id, { address, username, email });
  
      return res.status(200).json({ message: "All details updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;
