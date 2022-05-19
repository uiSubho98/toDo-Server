const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config()
app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qwlt9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        console.log('db connected')
        const taskCollection = client.db('ToDoList').collection("task");
        app.get('/task',async(req,res)=>{
            const query={};
            const cursor = taskCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/task',async(req,res)=>{
          const newTask = req.body
          const result = await taskCollection.insertOne(newTask)
          res.send(result)
        })
        app.delete('/task/:id',async(req,res)=>{
              const id = req.params.id
              const query = {_id: ObjectId(id)}
              const result = await taskCollection.deleteOne(query)
              res.send(result)
        })

    }
    finally{

    }
}
run().catch(console.dir)
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })