const express = require('express');
const app = express();
const cors = require('cors')
const data = require("./data/data.json");
app.use(cors());

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


