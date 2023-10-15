const express = require("express");
const courses = require("./courses.json");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

// Middleware========

// for taking
app.use(cors());
// for posting
app.use(express.json());

// Connect with MongoDB
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.49jhv2u.mongodb.net/?retryWrites=true&w=majority`;

  // const uri = "mongodb+srv://learnCode:usqDpQKYaSv6faXI@cluster0.49jhv2u.mongodb.net/?retryWrites=true&w=majority";




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const courseCollection = client.db("coursesDB").collection("courses");

    app.post('/courses', async(req, res)=>{
        const course = req.body;
        // console.log('new course', course);
        const result = await courseCollection.insertOne(course)
        res.send(result)
    })

    app.get('/courses', async(req, res)=>{
        const cursor = courseCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
 
    // Read API with ID
    app.get('/courses/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const user = await courseCollection.findOne(query)
      res.send(user)

   })

    app.put('/courses/:id', async(req, res)=>{
      const id = req.params.id;
      const course = req.body;
      // console.log(id, course);
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedCourseBody = {
        $set:{
          course_name: course.course_name, 
          image: course.image, 
          expert_name: course.expert_name, 
          card_bg_color: course.card_bg_color
        }
      }
      const result = await courseCollection.findOne(filter,updatedCourseBody , options )
      console.log(result);
      res.send(result)
    })


    

    


    app.delete('/courses/:id', async(req, res)=>{
        const id = req.params.id;
        console.log('Pelese deleted id from database', id);
        const query = {_id: new ObjectId(id)}
        const result = await courseCollection.deleteOne(query)
        res.send(result)
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Hello World My First API with Server");
  });


app.listen(port);
