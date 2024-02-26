const express = require('express');
const users = require('../Models/user');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const accessVerifying = require('../Middlewares/index');
const messages = require('../Models/messages');
const router = express.Router();
router.post('/login',  async (req, res)=>{
    try {
        const {username, password} = req.body;
        const isFound = await users.findOne({
            username
        });
        if(!isFound){
            res.status(204).send('Invalid credentials.');
        }
        else{
                const isMatch = await bcrypt.compare(password, isFound.password);
                if(isMatch){
                    //we create a token
                    const token = jwt.sign(
                        {
                            username : isFound.username, 
                        },
                        process.env.TOKEN_PASS,
                        {
                            expiresIn : "2d"
                        }
                    );
                    res.status(200).json({
                        token : token, 
                        _id   : isFound._id 
                    })
                }
                else{
                    console.log(e.message);
                }
            }
        
    } 
    catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);    
    }
}
);
router.get('/logout/:id',  accessVerifying ,async (req, res)=>{
    try {
        const {id} = req.params;
        const isUpdated = await users.findByIdAndUpdate(id, {
            isConnected : false
        })
        if(isUpdated){
            res.status(200).send('Logged Out');
        }
        else{
            res.status(202).send('not logged Out successfully...');
        }
    } 
    catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);    
    }
}
);



router.post('/register', async (req, res)=>{
    try {
        const { fullName, username, password} = req.body;
        const isEmailFound = await users.findOne({
            username
        });
        if(isEmailFound){
            res.status(201).send('Username already taken.');
        }
        else{
            //we create a new user
            const saltRound = await bcrypt.genSalt(4);
            const hashedPassword = await bcrypt.hash(password, saltRound);
            const isCreated = await users.create({
                fullName, 
                username, 
                password : hashedPassword
            });
            if(isCreated){
                res.status(200).send({
                    username : username, 
                    fullName : fullName
                });
            }
            else{
                res.status(202).send('Oops, something went wrong!');
            }
        }
    } 
    catch (error) {
        res.status(500).send(error.message);    
    }
}
);


router.get('/user/:idUser',accessVerifying, async(req, res)=>{
    try{        
        const {idUser} = req.params;
        const isFound = await users.findById(idUser);
        if(isFound){
            res.status(200).send(isFound);
        }
        else{
            res.status(202).send('Not Found..');
        }
    }
    catch(e){
        console.log(e.message);
        res.status(500).send(e.message);
    }
})

router.post('/createMessage',accessVerifying,async(req, res)=>{
    try{        
        const {sender,senderId, message, picturePath, fullName, time} = req.body;
        const isCreated = await messages.create({
            sender,
            senderId,
            message,
            picturePath,
            fullName,
            time
        });
        if(isCreated){
            res.status(200).send(isCreated);
            console.log("message created");
        }
        else{
            res.status(202).send('message not created...');
            console.log('202 | message not created');
        } 
    }
    catch(e){
        console.log(e.message);
        res.status(500).send(e.message);
        console.log('500 | message not created');
    }
});
router.get('/getAllMessages',accessVerifying,async(req, res)=>{
    try{        
        const isFound = await messages.find();
        if(isFound){
            res.status(200).send(isFound);
        }
        else{
            res.status(202).send('message not created...');
        } 
    }
    catch(e){
        res.status(500).send(e.message);
    }
});


router.post('/updateUserInfos/:id',accessVerifying,async(req, res)=>{
    try{        
        var {fullName, bio , picturePath} = req.body;
        const {id} = req.params;
        if(picturePath === "" || picturePath === " " || picturePath === "  " ){
            picturePath = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        }
        const isFoundAndUpdated = await users.findByIdAndUpdate(id, {
            fullName, 
            bio, 
            picturePath
        });
        if(isFoundAndUpdated){
            const isFound = await users.findOne({
                _id : id
            })
            res.status(200).send(isFound);
        }
        else{
            res.status(202).send('Not Updated...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});


module.exports = router;