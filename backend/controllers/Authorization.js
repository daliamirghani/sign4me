const Users = require("../models/user_model"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60;


const signUp = async(req,res)=>  {
    try{
        const {email,password,username}=req.body;
        // check if user already exists
        const existingUser=await Users.findOne({email});
        if (existingUser){
            return res.status(400).json({msg: "User already exists"})
        }
        // hashing password
        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt)
        const newUser= new Users({
            username,
            email,
            password:hashedPassword
        });

        // save user 
        await newUser.save();
        res.status(201).json({
            data:{
                email:newUser.email,
                username:newUser.username
            }
        });
    }
    catch(error){
   res.status(500).json(error);
    }
};


const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",  
  });
};
const signIn= async(req,res)=>{
    try{
         const {email,password,username}=req.body;
         const user=await Users.findOne({email});
         if(!user){
            return res.status(404).send({
               status:404
               , msg:"User not found"
            });
         }
         const auth= await bcrypt.compare(password,user.password);
         if(!auth){
           return res.status(400).json({msg:"Incorrect Password"})
         }
        const token=createToken(user._id);
        // res.cookie("token", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({
            msg:"Login successful",
            data:{
                id:user._id,
                token,
                email:user.email,
                username:user.username
            }
        })
    }
   catch(error){
    console.error(error);  
    res.status(500).json({ msg: "Server error", error: error.message });
   }
}
const signOut = async(req,res)=>{
    res.cookie("token","",{maxAge:1});
    res.status(200).send({
        status:200,
        msg:"User logged out successfully"
    });
};

module.exports={signUp,signIn,signOut};