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
     
     const sort =req.query.sort
     const recent=req.query.recent
     const categories=req.query.categories
     const brand=req.query.brand
    
     
      let query = { 
        ProductName: { $regex: search , $options: 'i' },
        Category:categories==="All"?{ $in: ['Phone', 'Laptop', 'camera', 'Smartwatch', 'HeadPhone','Speaker'] }:categories,
        BrandName:{ $regex: brand , $options: 'i' },
        // sort:{}

       };
    //    const option = {
    //     sort: {
    //         Price: sort === 'asc' ? 1 : -1, // Sort by Price (ascending or descending)
    //         ProductCreationDateTime: recent === 'new' ? -1 : 1 // Sort by ProductCreationDateTime (newest first or oldest first)
    //     }
    // };
    const sortFields = {};
if (sort) {
    sortFields.Price = sort === 'asc' ? 1 : -1;
}
else  {
    sortFields.ProductCreationDateTime = recent === 'new' ? -1 : 1;
}
    
        const result =await productsCollection.find(query).sort(sortFields).skip(page*size).limit(size).toArray()
        res.send(result)

    })
    app.get('/productsCount',async(req,res)=>{
      const result=await productsCollection.find().toArray()
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
