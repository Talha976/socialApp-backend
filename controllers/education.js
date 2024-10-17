const Education = require("../models/educationSchema");


exports.addEducation = async (req, res) => {
    try {
        const userId = req.userID;

        const { school, degree, fieldOfStudy, startDate, endDate, grade, description } = req.body;

        const newEducation = new Education({
            user: userId,
            school,
            degree,
            fieldOfStudy,
            startDate,
            endDate,
            grade,
            description,
        });

        const savedEducation = await newEducation.save();
        if (savedEducation) {
            res.status(201).json({ message: 'Saved Education' });
        }
        else {
            res.status(401).json({ message: 'Error Saving Education' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.getEducationByUserId = async (req, res) => {
    const userId = req.userID;

    try {
        const educationRecords = await Education.find({ user: userId });
        if (educationRecords) {
            return res.status(200).json(educationRecords);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch education records', error });
    }
};

exports.updateEducation = async (req, res) => {
    const userID = req.userID
    const { id } = req.params;
    const { school, degree, fieldOfStudy, startDate, endDate, grade, description } = req.body;
        
        
    try {
        const updatedEducation = await Education.findByIdAndUpdate(
            { _id: id, user: userID },
            { school, degree, fieldOfStudy, startDate, endDate, grade, description },
            { new: true }
        );

        if (!updatedEducation) {
            return res.status(404).json({ message: 'Education record not found' });
        }else{
            return res.status(200).json({message:'Updated Successfully'});
        }  
    } catch (error) {
        res.status(500).json({ message: 'Failed to update education', error });
    }
};


exports.deleteEducation = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEducation = await Education.findByIdAndDelete(id);

        if (!deletedEducation) {
            return res.status(404).json({ message: 'Education record not found' });
        }

        res.status(200).json({ message: 'Education record deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete education', error });
    }
};
