const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middlewar
app.use(cors({
  origin: ["http://localhost:5173", 'https://art-and-craft-b10.web.app'],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  withCredentials: true,
}))
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9jgyd7l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const craftCollection = client.db("art&craftDB").collection('crafts')
    const subcategoryCollection = client.db("art&craftDB").collection('subcategory')

    app.get('/crafts', async(req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result)
  })

  app.get('/crafts/:id', async(req, res) => {
    const id = req.params.id
    const query = { _id: new ObjectId(id) };
    const craft = await craftCollection.findOne(query);
    res.send(craft)
  })


  app.get("/myCrafts/:email", async (req, res) => {
    console.log(req.params.email);
    const result = await craftCollection.find({ userEmail: req.params.email }).toArray();
    res.send(result)
  })

  app.get('/singleCrafts/:id', async(req, res)=>{
    const id = req.params.id
    const query = { _id: new ObjectId(id) };
    const result = await craftCollection.findOne(query);
    res.send(result)
  })


  app.put('/updateCrafts/:id', async(req, res) => {
    const id = req.params.id;
    const craft = req.body;
    console.log(id , craft)
    const filter = { _id: new ObjectId(id)};
    const options = { upsert: true };
    const udatedUser = {
      $set: {
        itemName: craft.itemName,
        subcategoryName: craft.subcategoryName,
        shortDescription: craft.shortDescription,
        price: craft.price,
        rating: craft.rating,
        customization: craft.customization,
        processingTime: craft.processingTime,
        stockStatus: craft.stockStatus,
        photoUrl: craft.photoUrl
      },
    };
    const result = await craftCollection.updateOne(filter, udatedUser, options);
    res.send(result)
  })

    app.post('/crafts', async(req, res)=>{
      const craft = req.body
      console.log(craft);
      const result = await craftCollection.insertOne(craft);
      res.send(result)
      })

      app.delete('/delete/:id', async(req, res) => {
        const id = req.params.id
       console.log(id);
        const query = { _id: new ObjectId(id)};
        const result = await craftCollection.deleteOne(query);
        res.send(result)
    })

    app.get('/subcategory', async(req, res) => {
      const cursor = subcategoryCollection.find();
      const result = await cursor.toArray();
      res.send(result)
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('B9a10 ar 02 server is running')
  })
  
  app.listen(port, () => {
    console.log(`b9a2 ar 02 server is running on port : ${port}`)
  })