const mongoose = require('mongoose');
const User = require('../models/user')
const bcrypt = require('bcrypt')
const authService = require('../services/authService')
const generateToken = require('../services/authService');

const signUp = async(req,res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id:response._id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken.setUser(payload);
        console.log(`token is : ${token}`)
        res.status(200).json({success:true,response:response,token:token,message:'Registration success'})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

const login = async(req,res) => {
     try {
        const {aadharcardNumber,password} = req.body;
        const user = await User.findOne({aadharCardNumber:aadharcardNumber,password:password})
        console.log(`user : ${user}`)
        if(!user){
            return res.status(400).json({success:false,message:'Invalid username or password'})
        }
        console.log(`userId : ${user._id}`)
        const payload = {
            id:user._id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken.setUser(payload);
        console.log(`token is : ${token}`)
        res.status(200).json({success:true,token:token,message:'Login success'})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}


const profile = async(req,res) => {
     try {
        const userData = req.user;
        const userId = userData.id.id;
        console.log(`userId : ${userId}`)
        const user = await User.findById(userId)
        console.log(`user : ${user}`)
    
        res.status(200).json({success:true,user:user,message:''})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

const passwordUpdate = async(req,res) => {
     try {
        const userData = req.user.id;
        const {currentPassword,password} = req.body;
        const userId = userData.id;
        const user = await User.findById(userId)
        const passwordMatch = user.password == currentPassword;
        if(!passwordMatch){
            return res.status(400).json({success:false,message:'Password not match'});
        }
        const savepassword = password;
        const response = await User.findByIdAndUpdate(userId,{password:password},{
            new:true,
            runValidators:true
        })
        console.log(`res = ${response}`)
        res.status(200).json({success:true,response:response,message:'password updated'})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

module.exports = {
    signUp,
    login,
    profile,
    passwordUpdate,
}