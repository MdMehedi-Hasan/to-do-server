const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://dev:vGbRLmLifGeMrwT8@cluster0.bbuqy.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const taskCollection = client.db("job-placement-task").collection("to-do-list");



async function run() {
    try {
        await client.connect();
        app.get("/tasks", async (req, res) => {
            const query = {};
            const tasks = taskCollection.find(query);
            const result = await tasks.toArray();
            res.send(result)
        })
        app.post("/tasks", async (req, res) => {
            const doc = {
                taskTitle: req.body.taskName,
                description: req.body.description
            }
            const result = await taskCollection.insertOne(doc);
            res.send(result)
        })
        app.delete("/tasks/:id", async (req, res) => {
            const id = req.params;
            const query = { _id: ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result)
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})