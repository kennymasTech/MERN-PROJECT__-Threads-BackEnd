const User = require ("../models/userModel")
const bcrypt = require("bcryptjs")

const signUpUser = async(req, res) => {
    try {
        const {name, email, username, password} = req.body;
        const user = await User.findOne({$or:[{email},{username}]})

        if (user) {
            return res.status(400).json({message: "User Already Exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


    } catch (error) {

    }
}

module.exports = { signUpUser }