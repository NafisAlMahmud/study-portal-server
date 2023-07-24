const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const ObjectID = require("mongodb").ObjectId;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://studyPortalUser:lJz9LeEH6sVGBUtg@cluster0.qiitqce.mongodb.net/?retryWrites=true&w=majority";

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
    // await client.connect();

    const usersCollection = client.db("sPortalDb").collection("users");
    const collageCollection = client.db("sPortalDb").collection("collage");
    const cartCollection = client.db("sPortalDb").collection("cart");
    // Send a ping to confirm a successful connection

    // users related apis
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "user already exists" });
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/collage", async (req, res) => {
      const result = await collageCollection.find().toArray();
      res.send(result);
    });
    // api start
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.get("/detailCollage/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectID(id) };
      const result = await collageCollection.findOne(query);
      res.send(result);
    });

    // cart collection apis
    app.get("/cart", async (req, res) => {
      const email = req.query.email;

      if (!email) {
        res.send([]);
      }

      // const decodedEmail = req.decoded.email;
      // if (email !== decodedEmail) {
      //   return res
      //     .status(403)
      //     .send({ error: true, message: "porviden access" });
      // }

      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const item = req.body;
      const result = await cartCollection.insertOne(item);
      res.send(result);
    });

    app.get("/collage/myCollage/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await collageCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("s portal is running");
});

app.listen(port, () => {
  console.log(`listening on port ${port} `);
});
