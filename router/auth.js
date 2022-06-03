const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');


const User = require('../model/userSchema');

const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', (req, res) => {
    res.send(`Hello World authjs`);
});

router.post('/register', async (req, res) => {

    const {name, email, role, password, cpassword } = req.body;
     
    if(!name  || !email || !role || !password || !cpassword) {
        return res.status(422).json({error: "fill properly"});
    }
       
    try {

        const userExist = await User.findOne({ email: email});

        if(userExist) {
            return res.status(422).json({ error: "Email already Exist"});
        }
  
        const newUser = new User({name, email, role, password, cpassword});
        await newUser.save();
        
         return res.status(201).send({newUser});

    } catch (err) {
        console.error(err);
        return res.status(500).send({error: err, code: 500});
    }


});

router.post('/signin', async(req,res) => {
    // try{
    //     const {email,password} = req.body;

    //     if(!email || !password) {
    //         return res.status(400).json({error: "Plz filled the data"})
    //     }

    // } catch(err) {
    //     console.log(err);
    // }

    const body = req.body;

    const email = body?.email;
    const password = body?.password;

    // TODO: Add Validation

    try {
        const user = await userModel.findOne({email: email}).exec();
        console.log(email);
        if (!user) return res.status(403).send({error: "Invalid email", code: 403});

        const password_hash = user?.password;
        if (!await argon2.verify(password_hash, password)) return res.status(403).send({error: "Invalid Password", code: 403});

        const uData = { _id: user?._id, email: user?.email, name: user?.name, acType: user?.acType, isAdmin: user?.isAdmin }
        const token = jwt.sign(uData, process.env.JWT_SECRET);
        return res.status(200).send({token, user});
    } catch (err) {
        console.error(err);
        return res.status(500).send({error: err, code:500});
    }

});

router.get('/', isAuthenticated, (req, res) => {
    const user = req?.user;
    return res.status(200).send({user});
});

router.post('/registerAdmin', isAuthenticated, isAdmin, async (req, res) => {
    const body = req?.body;
    const email = body?.email;
    const password = body?.password;
    const confirmPassword = body?.cpassword;
    const name = body?.name;
    const acType = 'ADMIN';
    const isAdmin = true;

    // TODO: Add Validation

    try {
        if (password !== confirmPassword) {
            return res.status(500).send({error: "Passwords mismatch", code: 500});
        }
        const hash = await argon2.hash(password);
        const newUser = await userModel({email, password: hash, isAdmin, acType, name});
        await newUser.save();

        return res.status(201).send({newUser});
    } catch (err) {
        console.error(err);
        return res.status(500).send({error: err, code: 500});
    }
})


module.exports = router;