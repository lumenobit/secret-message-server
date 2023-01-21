const AppDbUtil = require("../util/db.util");
const { logger } = require("../util/logger");

async function saveUser(req, res) {

    const user = req.body;

    try {
        if (user.name && user.email && user.password) {
            // SAVE THIS DATA TO MONGO DB
            const client = await AppDbUtil.getMongoDbClient();
            const collection = client.db('secretmessage').collection('users');
            const result = await collection.insertOne(user);
            client.close();
            if (result.acknowledged) {
                res.send({ message: "User Registered Successfully!" })
            } else {
                res.status(500).send({ message: "An unexpected error has occurred. Please try again later." })
            }
        } else {
            res.status(400).send({ message: "Please provide valid details." })
        }
    } catch (ex) {
        logger.error(ex);
        res.status(500).send({ message: "An unexpected error has occurred. Please try again later." })
    }

}

function getUser(req, res) {
    res.send("Get User");
}

function updateUser(req, res) {
    res.send("Update User");
}

function deleteUser(req, res) {
    res.send("Delete User");
}

module.exports = {
    saveUser,
    getUser,
    updateUser,
    deleteUser
}