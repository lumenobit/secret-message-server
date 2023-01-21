const AppDbUtil = require("../util/db.util");
const { ObjectId } = require("mongodb")

async function saveMessage(req, res) {
    const username = req.body.username;
    const message = req.body.message;

    if (username && message) {
        const client = await AppDbUtil.getMongoDbClient();
        const usersCollection = client.db("secretmessage").collection("users");
        const users = await usersCollection.find({ username: username }).toArray();

        const user = users && users[0];
        if (user) {
            const messagesCollection = client.db("secretmessage").collection("messages");
            const messageToStore = {
                message: message,
                userId: ObjectId(user._id)
            }
            const result = await messagesCollection.insertOne(messageToStore)
            if (result.acknowledged) {
                res.send({ "message": "Your message is saved sucessfully!" });
            } else {
                res.status(500).send({ "message": "Some error occurred while saving your message." });
            }
        } else {
            res.status(404).send({ "message": "Invalid username entered." });
        }
        client.close();
    } else {
        res.status(400).send({ "message": "Please provide valid username and message." });
    }
}

async function getAllMessages(req, res) {
    const userId = req.body.tokenDecoded.userId;
    const client = await AppDbUtil.getMongoDbClient();
    const collection = client.db("secretmessage").collection("messages");
    const result = await collection.find({ userId: ObjectId(userId) }).toArray();
    client.close();
    res.send(result);
}

async function deleteMessage(req, res) {
    const userId = req.body.tokenDecoded.userId;
    const messageId = req.params['id'];
    const client = await AppDbUtil.getMongoDbClient();
    const collection = client.db("secretmessage").collection("messages");
    const result = await collection.deleteOne({ _id: ObjectId(messageId), userId: ObjectId(userId) })
    client.close();
    if (result.deletedCount > 0) {
        res.send({ message: "Message Deleted Successfully!" });
    } else {
        res.status(500).send({ message: "Message couldn't be deleted." })
    }
}

module.exports = {
    saveMessage,
    getAllMessages,
    deleteMessage
}