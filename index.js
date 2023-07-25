require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qulzvkz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("NEXT_LEVEL_ASSIGNMENT_5");
    const booktCollection = db.collection("books");

    // get all the books
    app.get("/books", async (req, res) => {
      const cursor = booktCollection.find({});
      const book = await cursor.toArray();

      res.send(book);
    });

    // add a book
    app.post("/book", async (req, res) => {
      const book = req.body;
      const result = await booktCollection.insertOne(book);
      res.send(result);
    });

    app.put("/book/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: data.title,
          author: data.author,
          genre: data.genre,
          review: data.publicationDate,
          image: data.image,
          review: data.review,
        },
      };
      const result = await booktCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await booktCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello Next Level Assignment!");
});

app.listen(port, () => {
  console.log(`Hello Next Level Assignment on port ${port}`);
});
