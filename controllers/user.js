const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../auth')

module.exports.registerUser = async (req, res) => {
    try {
        const {firstName, lastName, email, password, mobileNo} = req.body;

        if (!email.includes("@")){
            return res.status(400).send({error: 'Invalid email format'})
        } else if (password.length < 8){
            return res.status(400).send({error: 'Password must be atleast 8 characters'})
        } 

        const existingUser = await User.findOne({email: email});
        console.log(existingUser)
        if (existingUser) {
            return res.status(400).send({error: 'Email already exsists'})
        }
        
        let newUser = new User({
            firstName : firstName,
            lastName: lastName,
            email: email,
            password: bcrypt.hashSync(password, 10),
            mobileNo: mobileNo
        })

        return await newUser.save()
        .then((result) => res.status(201).send({
            message: 'Registeres Successfully'
        }))
        .catch(error => error)

        
    } catch (error) {
        console.log('Error in register a user: ', error)
        return res.status(500).send({error: 'Internal server error: Failed to register'})
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (email.includes('@')){
            return await User.findOne({email: email})
            .then(result => {
                if(result === null){
                    return res.status(404).send({error: 'No email found'})
                } else {
                    const isPasswordCorrect = bcrypt.compareSync(password, result.password);
                    if (isPasswordCorrect){
                        return res.status(200).send({access: auth.createAccess(result)});
                    } else{
                        return res.status(401).send({error: 'Email and password do not match'})
                    }
                }
            })
            .catch(error => error)
        } else {
            return res.status(400).send({error: 'Email invalid'})
        }
    } catch (error) {
        console.log('Error login: ', error)
        return res.status(500).send({error: 'Internal server error: Failed to login'});
    }
}