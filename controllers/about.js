const About = require('../models/about')

const aboutUser = async (req,res)=>{
    try {
        const userID = req.userID
        const {about} = req.body
        const setAbout = new About({about:about,user:userID})
        const saveAbout = await setAbout.save()
        if(saveAbout){
            return res.status(201).json({message: 'Saved About Info'})
        }
        else{
            return res.status(401).json({message:'Error Saving'})
        }
    } catch (error) {
        return res.status(500).json({message:'Server Error'})
    }
}

const fetchAbout = async (req,res)=>{
    try {
        const userID = req.userID
        const getAbout = await About.findOne({user:userID})
        if(getAbout){
            return res.status(201).json({about:getAbout.about})
        }
    } catch (error) {
        return res.status(500).json({message:'Server Error'})
    }
}


const updateAbout = async (req,res)=>{
    try {
        const userID = req.userID
        const {editAbout} = req.body
        const getAbout = await About.findByIdAndUpdate(userID,{about:editAbout})
      
        if(getAbout){
            return res.status(201).json({message:'About Info Updated'})
        }else{
            return res.status(201).json({message:'Error Occured'})
        }
    } catch (error) {
        return res.status(500).json({message:'Server Error'})
    }
}

module.exports = {aboutUser,fetchAbout,updateAbout}