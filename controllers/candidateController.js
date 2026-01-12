const mongoose = require('mongoose');
const Candidate = require('../models/candidate')
const User = require('../models/user')

const generateToken = require('../services/authService');

const checkAdminRole = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user.role === 'admin';
    } catch (error) {
        return false;
    }
}

const adminCount = async(req,res) => {
    try {
        const adminCount = await User.countDocuments({role:'admin'})
        return adminCount == 1;
    } catch (error) {
        return false;
    }
}

const addCandidate = async(req,res) => {
    try {
        console.log(`id : ${JSON.stringify(req.user.id.id)}`)
        if(!(await checkAdminRole(req.user.id.id))){
            return res.status(403).json({success:false,message:'You have not permitted'})
        }
        if(!(await adminCount())) {
            return res.status(400).json({success:false,message:'system currupted...'})
        }
        const data = req.body;
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save();
        console.log('data saved');

        res.status(200).json({success:true,response:response,message:'Candidate registration success'})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

const updateCandidate = async(req,res) => {
    try {
        console.log(`id : ${JSON.stringify(req.user.id.id)}`)
        if(!(await checkAdminRole(req.user.id.id))){
            return res.status(403).json({success:false,message:'You have not permitted'})
        }
        if(!(await adminCount())) {
            return res.status(400).json({success:false,message:'system currupted...'})
        }
        const candidateID = req.params.candidateID;
        const updatedData = req.body;
        const response = await Candidate.findByIdAndUpdate(candidateID,updatedData,{
            new:true,
            runValidators:true
        })
        if(!response){
            return res.status(404).json({success:false,message:'Candidate not found'})
        }
        console.log('data saved');

        res.status(200).json({success:true,response:response,message:'Candidate Updated success'})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}


const deleteCandidate = async(req,res) => {
    try {
        console.log(`id : ${JSON.stringify(req.user.id.id)}`)
        if(!(await checkAdminRole(req.user.id.id))){
            return res.status(403).json({success:false,message:'You have not permitted'})
        }
        if(!(await adminCount())) {
            return res.status(400).json({success:false,message:'system currupted...'})
        }
        const candidateID = req.params.candidateID;
        const response = await Candidate.findByIdAndDelete(candidateID)
        if(!response){
            return res.status(404).json({success:false,message:'Candidate not found'})
        }
        console.log('data saved');

        res.status(200).json({success:true,message:'Candidate deleted success'})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}


const showCandidate = async(req,res) => {
    try {
        const candidate = await Candidate.find({});
        return res.status(200).json({success:true,candidates: candidate})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}

const voteCount = async(req,res) => {
    try {
        const candidate = await Candidate.find().sort({voteCount:'desc'});
        const voteRecord = candidate.map((data) => {
            return {
                party:data.party,
                votes:data.voteCount
            }
        })
        return res.status(200).json({success:true,voteRecord})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}

const addVote = async(req,res) => {
    try {
        const userId = req.user.id.id;
        const candidateId = req.params.candidateId;
        const candidate = await Candidate.findById(candidateId);
        const user = await User.findById(userId)

        console.log(`userId = ${userId}`)
        console.log(`candidateId = ${candidateId}`)
        console.log(`candidate = ${JSON.stringify(candidate)}`)
        console.log(`user = ${user}`)

        if(!candidateId){
            return res.status(403).json({success:false,message:'Candidate not found'})
        }
        if(!userId){
            return res.status(403).json({success:false,message:'User not found'})
        }
        if(user.role == 'admin'){
            return res.status(403).json({success:false,message:'You are not permitted'})
        }
        if(user.age < 18){
            return res.status(403).json({success:false,message:'Your age is not 18+'})
        }
        if(user.isVoted){
            return res.status(403).json({success:false,message:'You are already voted'})
        }

        candidate.votes.push({user:userId});
        candidate.voteCount++;
        await candidate.save();

        user.isVoted = true;
        await user.save();

        return res.status(200).json({success:true,message:'Your vote confirmed.'})
        
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}

module.exports = {
    addCandidate,
    updateCandidate,
    deleteCandidate,
    showCandidate,
    voteCount,
    addVote
}