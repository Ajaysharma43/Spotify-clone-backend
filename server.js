const express = require('express');
const app = express();
const cors = require('cors');
const axios  = require('axios');
const data = require("./data/data.json");
const mongoose = require('mongoose')
const mongodata = require('./Mongodb module/Users-module')
const bodyParser = require('body-parser');
mongoose.set('strictQuery',true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());



try {
    
const connectWithRetry = () => {
    console.log('Attempting to connect to MongoDB...');

    mongoose.connect("mongodb+srv://ajaysharma445446:powerhouseajay6556@cluster0.jjqpew8.mongodb.net/database1?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Connected successfully");
    }).catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    });
};

connectWithRetry(); 
} catch (error) {
    
    console.log(error);
}

const connectwithretry = () => {
    mongoose.connect("mongodb+srv://ajaysharma445446:powerhouseajay6556@cluster0.jjqpew8.mongodb.net/database1?retryWrites=true&w=majority",{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>console.log("connected successfully"))
    .catch((connectwithretry)=>{
        connectwithretry();
    })
}


function shuffle(data2) {
    let extra = []
    let result;
    let shuffleddata = [];
    for(i = 0;i<=data2-1;i++)
        {
           result =  Math.floor(Math.random() * data2)
           extra[i] = result
           shuffleddata[i] = data.find(data => data.id === extra[i])
        }

        let uniquearray = [ ...new Set(shuffleddata)]
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve(uniquearray)
            })
        })
        
}

app.post('/SignUp',async (req,res)=>{
    try
    {
        const name = req.body.Name;
        const Password = req.body.password;
        const email = req.body.email;

        console.log(name,Password,email);

        const data = {"UserName":name,"Password":Password,"Email":email};
        const std = new mongodata(data);
        const result = std.save();
        console.log(result);
    }
    catch(error)
    {
        console.log(error);
    }
})

app.post('/Login',async(req,res)=>{
    try {
        const name = req.body.name;
        const password = req.body.password;

        const data = await mongodata.findOne({UserName:name,Password:password})
        console.log(data);
        if(!data)
        {
            res.send('not verified')
        }
        else
        {
            res.send('verified');
        }
        
        
    } 
    catch (error) {
        console.log(error);
    }
})

app.post('/LikedSongs', async(req,res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const Song = req.body.data;
    const Username = req.body.Username;
    const Password = req.body.Password;

    const data = await mongodata.findOne({UserName:Username,Password:Password});
    const existingsong = data.Likedsongs.find(Song => Song.id === id);
    if(existingsong)
    {
        console.log("data already existed");
    }
    else
    {
        data.Likedsongs.push({id,name,Song});
        await data.save();
        console.log(data);
    }
    

})

app.post('/RemoveLikedSongs',async(req,res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const Song = req.body.data;
    const Username = req.body.Username;
    const Password = req.body.Password;

    const data = await mongodata.findOne({UserName:Username,Password:Password});
    const existingsong = data.Likedsongs.find(Song => Song.id === id);
    if(!existingsong)
    {
        console.log("data not existed");
    }
    else
    {
        data.Likedsongs.pull({id,name,Song});
        await data.save();
        console.log(data);
        console.log("Song removed");
        res.send("removed");
    }

})

app.post('/GetUserData', async(req,res)=>{
    const Username = req.body.Username;
    const Password = req.body.Password;

    const data = await mongodata.findOne({UserName:Username,Password:Password});
    console.log(data);

    res.send(data);
})

app.get('/data',async (req,res)=>{
    const data1 = data
    const length = data.length
    const data2 =await shuffle(length);
    console.log(data2);
    res.send(data2)
})

app.get('/data/:id',async(req,res)=>{
    const num = parseInt(req.params.id)
    const data1 = data.find(data => data.id === num);
    
    res.send(data1)
})

app.get('/data/:name', async(req,res)=>{
    const String = req.params.name
    const data1 = data.find(data => data.name == String)
    res.send(data1)
})

app.listen(3000)


