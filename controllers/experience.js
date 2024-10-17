const Experience = require("../models/experienceSchema");

const postExperience = async (req, res) => {
    try {
        const userID = req.userID;
        const { title, companyName, employmentType, location, startDate, endDate, description } = req.body;

        const saveExperience = new Experience({
            user: userID,
            title,
            companyName,
            employmentType,
            location,
            startDate,
            endDate,
            description
        });

        const saveExp = await saveExperience.save();
        if (saveExp) {
            return res.status(201).json({ message: 'Saved!' });
        } else {
            return res.status(500).json({ message: 'Error!' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error!' });
    }
}

const fetchExperience = async (req, res) => {
    try {
        const userID = req.userID
        const fetchData = await Experience.find({ user: userID })
        if (fetchData) {
            return res.status(200).json(fetchData)
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const updateExperience = async (req, res) => {
    try {
        const userID = req.userID
        const { id } = req.params
        const { title, companyName, employmentType, location, startDate, endDate, description } = req.body
        const checkExp = await Experience.findByIdAndUpdate(
             { _id:id, user:userID} ,
            { title, companyName, employmentType, location, startDate, endDate, description },
            { new: true }
        )
        if (checkExp) {
            return res.status(200).json({ message: 'Updated Successfully' })
        } else {
            return res.status(401).json({ message: 'Error Updating' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' })
    }
}
const deleteExperience = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEducation = await Experience.findByIdAndDelete(id);

        if (!deletedEducation) {
            return res.status(404).json({ message: 'Education record not found' });
        }

        res.status(200).json({ message: 'Education record deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete education', error });
    }
};

module.exports = { postExperience, fetchExperience, updateExperience, deleteExperience };
