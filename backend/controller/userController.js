const User = require('../Model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const { generateToken } = require('../utils/generateToken');

const sendMail  = require('../utils/sendMail');


const register = async(req,res)=>{
    const {username,password,email,avatar} = req.body;

  try {

    const existingUser = await User.findOne({email})
    if(existingUser){
      return res.status(400).json({message:"Email already taken!"})
    }
    
   
    const cloudAvatar = await cloudinary.v2.uploader.upload(avatar,{
        folder:"avatars"
    })

    const user = new User({username,password,email,avatar:{
        public_id:cloudAvatar.public_id,
        url:cloudAvatar.secure_url
    }})
    

    await user.save().then((user)=>{
        try {
            const token = generateToken(user._id)
            // const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1h"})
            const {password:pass,...rest} = user._doc;
            return res.cookie("token",token,{
                path:'/',
                expires:new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httpOnly:true,
                secure:true,
                sameSite:'none'
            }).status(201).json({token,rest,message:"User registered successfully"})
            
        } catch (error) {
            return res.status(400).json({message:"Error in registering user",error:error})
        }
    })
    
  } catch (error) {
    return res.status(400).json({message:"Error in registering user",error:error})
  } 
}



const login = async(req,res)=>{
    const {email,password} = req.body;

    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const matchPassword = await bcrypt.compareSync(password,user.password)
        if(!matchPassword){
            return res.status(400).json({message:"Invalid Password"})
        }
        const token = generateToken(user._id)
        // const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1h"})
        const {password:pass,...rest} = user._doc;
       
       return res.cookie("token",token,{
        path:'/',
        expires:new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly:true,
        secure:true,
        sameSite:'none'
        }).status(200).json({token,rest,message:"User logged in successfully"})
        
    } catch (error) {
        return res.status(400).json({message:"Internal Server Error (login)",error:error})
    }
}


const loginUser = async (req, res) => {
  // console.log('trish');
  // console.log(req.body)

  try {
      const user = await User.findOne({ username: req.body.username });
      // if (!user) return next(createError(404, "User not found!"));
      if(!user){
            return res.status(400).json({message:"User not found"})
        }
        
      // const isCorrect = bcrypt.compareSync(req.body.password, user.password);
      // if (!isCorrect) return next(createError(400, "Wrong password or username!"));
      const matchPassword = await bcrypt.compareSync(req.body.password,user.password)
        if(!matchPassword){
            return res.status(400).json({message:"Invalid Password"})
        }

      // const token = jwt.sign(
      //    {
      //      id: user._id,
      //      isSeller: user.isSeller,
      //    },
      //    process.env.JWT_KEY
      // );
      // const token = generateToken(user._id)
       const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})
      // const token = jwt.sign({Id},process.env.JWT_SECRET,{expiresIn:"1d"})


      // const { password, ...info } = user._doc;
      const {password:pass,...rest} = user._doc;

      // res.cookie("accessToken", token, {
      //        httpOnly: true,
      //    }).status(200).send(info);
      return res.cookie("token",token,{
        path:'/',
        expires:new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly:true,
        secure:true,
        sameSite:'none'
        }).status(200).json({token,rest,message:"User logged in successfully"})

  } catch (error) {
      // res.status(500).send("Something went wrong.");
      // next(error);
      return res.status(400).json({message:"Internal Server Error (login)",error:error})
  }

}



const getUser=async(req,res)=>{
   const id = req.user;
   

try {
    const user = await User.findById(id,"-password")
    if(!user){
        return res.status(400).json({message:"User not found"})
    }
    return res.status(200).json({user:user})

} catch (error) {
    return res.status(500).json({message:"Error in fetching user",error:error})
}
}

const updateUser = async(req,res)=>{
    const id = req.user;
    const {username,email,profile} = req.body;
    try {
        const user = await User.findByIdAndUpdate(id,{username,email,profile},{new:true})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }

        const {password,...rest} = user._doc
        return res.status(200).json({message:"User updated successfully",data:rest}) 
        
    } catch (error) {
        return res.status(500).json({message:"Error in updating user",error:error})
    }
}


const logout=async(req,res)=>{
    try {
        res.cookie("token", null,{
          expires: new Date(Date.now()),
          httpOnly: true,
        });
    
    res.status(201).json({
      success: true,
      message: "Logout Successful!"
      
    })
    } catch (error) {
        return res.status(500).json({message:"Error in logging out",error:error})   
    }

}



const createSession=async(req,res)=>{
   if(req.app.locals.resetSession){
    req.app.locals.resetSession=false;
    res.status(201).send({
        message:"Access granted!"
    })
   }

   res.status(440).send({
         error:"Session Expired!"
    
   })

}





// const resetPassword=async(req,res)=>{

// try {

//     if(!req.app.locals.resetSession){
//      return res.status(401).send({
//         error:"Session Expired"
//     })   
//     }
//     const {email,password} = req.body;
   
//     const user = await User.findOne({email})
//     if(!user){
//         return res.status(400).json({message:"User not found"})
//     }
//     const hashedPassword = await bcrypt.hash(password,10)
//     const updatedUser = await User.findByIdAndUpdate(user._id,{password:hashedPassword},{new:true})
//     if(!updatedUser){
//         return res.status(400).json({message:"Error in updating password"})
//     }
//     return res.status(200).json({message:"Password updated successfully"})

    
// } catch (error) {
//     return res.status(401).send({
//         error
//     })
// }
// }


const forgetPassword = async(req,res)=>{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"User not found"})
    }

   let resetToken = generateToken(user._id);

   
   const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

     // Reset Email
  const message = `
  <h2>${user.username}</h2>
  <p>Please use the url below to reset your password</p>  
  <p>This reset link is valid for only 30 minutes.</p>

  <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

`;
const subject = "Password Reset Request";
const sent_to = user.email;
const sent_from = process.env.SMTP_USER;

try {
    await sendMail(subject, message, sent_to, sent_from);
    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    res.status(500).json({message:"Email not sent, please try again",error:error});
  }

}



const resetPassword = async(req,res)=>{

    const { password } = req.body;
    const { resetToken } = req.params;
    if (!resetToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    try {
      const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
      if (!decoded) {
        return res.status(401).json({ message: "Invalid Token" });
      }
      const user = await User.findById({
        _id: decoded.Id,
      
      });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { password: hashedPassword },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(400).json({ message: "Error in updating password" });
      }
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      return res.status(401).json({
        error,
      });
    }



}


module.exports = {register,login,loginUser,getUser,updateUser,createSession,resetPassword,logout,forgetPassword}