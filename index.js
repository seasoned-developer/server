const express         =   require('express');
const cors            =   require('cors');
const dotenv          =   require('dotenv');
const http            =   require('http');
const { Server }      =   require('socket.io');
const thegameRoute    =   require('./Routes/index');
const mongoose        =   require('mongoose');
const path            =   require('path');
const users           =   require('./Models/user');
dotenv.config();
const app = express(); 
app.use(cors());    
app.use(express.json());
const server = http.createServer(app);
server.listen(process.env.PORT,()=>{
    console.log('Connected to server');
});
mongoose.connect(process.env.MONGO_URL, {   
    useNewUrlParser : true, 
    useUnifiedTopology : true
}).then(()=>{
    console.log('Connected to mongoDb');
}).catch((e)=>{
    console.log(e.message);
});
const io = new Server(
    server, 
    {
        cors : {
            methods : ['GET', 'POST']
        }
    }
); 

let onlineParticipants = new Array(); 
let isExisting = false;

io.on('connect', (socket)=>{
    //connection websockets
    socket.on('EnterRoom', (data)=>{
        require('node-macaddress').one(function (err, addr) {         console.log('Mac Adress of the user ['+data.name+'] : '+addr);    });
        //lorsque quelqu Un rejoin tla room 
        //on voit si il est deja existant al room on ne lui permet pas l access sinon oui 
        for(let i = 0;i<onlineParticipants.length; i++){
            if(onlineParticipants[i] === data.name){
                isExisting = true;
            }
        }
        if(isExisting === false){
             onlineParticipants.push({
                name : data.name, 
                id : socket.id,
                fullName : data.fullName, 
                picturePath : data.picturePath,
                idUser : data._id
            });
        }
         updateOnlineParticipants();
        socket.join(666);
    })
    socket.on('showMeParticipants', ()=>{
        //function qui nous donne le nombre de participant
        io.to(socket.id).emit('ParticipantsNames', onlineParticipants);
    });
    socket.on('sendNumberOfParticipants',()=>{
        updateOnlineParticipants()
    });
    socket.on('SendMsg', (data)=>{
        socket.to(666).emit('ReceiveMsg',data);
        updateOnlineParticipants();     
    });
    socket.on('QuitRoom', () => {
        socket.leave(666);
        
        updateOnlineParticipants();
    });
    socket.on('disconnect', () => {
        const disconnectedUser = onlineParticipants.find((participant) => participant.id === socket.id);
        if (disconnectedUser) {
            const index = onlineParticipants.indexOf(disconnectedUser);
            onlineParticipants.splice(index, 1);
        }
        socket.leave(666);
        updateOnlineParticipants();
    });
    function updateOnlineParticipants() {
        io.to(666).emit('OnlineParticipants', onlineParticipants.length);
    }
});
app.use('/allroutes', thegameRoute);
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/offline', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/offline.html'));  
});
app.get('/getInformationOfUser/:id', async (req, res) => {
    try {   
        const { id } = req.params;
        console.log(id);
        const isFetched = await users.findById(id);
        if (isFetched) {
            res.status(200).send(isFetched);
        } else {
            res.status(201).send(isFetched);
            console.log(isFetched);
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: "Server error" });
    }
});

app.post('/updateInfos', async(req, res)=>{
    try{
        const {id, fullName, username, picturePath} = req.body;
        const isUpdated = await users.findByIdAndUpdate(id, {
            fullName : fullName, 
            username : username, 
            picturePath : picturePath
        });
        if(isUpdated){
            res.status(200).send(isUpdated);
        }
        else{
            res.status(202).send('Not Updated...');
        }
    }
    catch(e){
        console.log(e.message);
    }
});

app.get('/getAllUsers', async(req, res)=>{
    try{
        const areFound = await users.find();
        if(areFound){
            res.status(200).send(areFound);
        }
        else{
            res.status(202).send('Not Updated...');
        }
    }
    catch(e){
        console.log(e.message);
    }
});