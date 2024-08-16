const express=require('express')
require('dotenv').config()
const app=express()
const cors=require('cors')
const port = process.env.PORT || 5000;

app.use(cors());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jobsTask:TbXfeLpRMwSmPIMM@cluster0.u53e1so.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    const productsCollection = client.db("jobsTask").collection("electronic");
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    app.get('/products',async(req,res)=>{
      const page =parseInt(req.query.page)
      const size =parseInt(req.query.size)
      const search =req.query.search
      console.log('search ',search)
     
      let query = { ProductName: { $regex: search, $options: 'i' } };
    
        const result =await productsCollection.find(query).skip(page*size).limit(size).toArray()
        res.send(result)

    })
    app.get('/productsCount',async(req,res)=>{
      const count =await productsCollection.estimatedDocumentCount();
      res.send({count})
    })
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('ecommerce server is running   ')
})
app.listen(port,()=>{
    console.log('running port on :',port)
})
