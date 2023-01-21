const AppDbUtil = require("../util/db.util");
const TokenUtil = require("../util/jwt.util");
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require("mongodb");

async function attemptLogin(req, res) {

    const body = req.body;

    try {
        if (body.email && body.password) {
            const client = await AppDbUtil.getMongoDbClient();
            const collection = client.db("secretmessage").collection("users");
            const result = await collection.find({ email: body.email }).toArray();
            client.close();

            if (result && result[0] && result[0].password === body.password) {
                const user = result[0];
                const token = TokenUtil.sign({ userId: user._id })
                res.send({ token: token })
            } else {
                res.status(401).send({ message: "Invalid email and password." })
            }
        } else {
            res.status(400).send({ message: "Please provide valid email and password." })
        }
    } catch (ex) {
        logger.error(ex);
        res.status(500).send({ message: "An unexpected error has occurred. Please try again later." })
    }

}

async function forgotPassword(req, res) {

    const emailId = req.body.emailId;

    const client = await AppDbUtil.getMongoDbClient();
    const collection = client.db("secretmessage").collection("users");

    const result = await collection.find({ email: emailId }).toArray();

    if (result && result[0]) {
        const currentUser = result[0];
        const token = uuidv4();
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 1)
        const resetPasswordBody = {
            userId: ObjectId(currentUser._id),
            token: token,
            validTill: expiry
        }
        const resetPasswordCollection = client.db("secretmessage").collection("resetPasswords");
        resetPasswordCollection.insertOne(resetPasswordBody);
        res.send({ token: token })
    } else {
        res.status(404).send({ message: "Not a valid user." })
    }

}

async function resetPassword(req, res) {
    const token = req.body.token;
    const newPassword = req.body.newPassword;

    const client = await AppDbUtil.getMongoDbClient();
    const resetPasswordCollection = client.db("secretmessage").collection("resetPasswords");

    const result = await resetPasswordCollection.find({ token: token }).toArray();
    if (result && result[0]) {
        const userId = result[0].userId;
        const userCollection = client.db("secretmessage").collection("users");
        const finalResult = await userCollection.updateOne({ _id: ObjectId(userId) }, { $set: { password: newPassword } })
        await resetPasswordCollection.deleteOne({ token: token });
        res.send({ message: "Password updated successfully!" })
    } else {
        res.status(404).send({ message: "Not a valid user." })
    }

}

module.exports = {
    attemptLogin,
    forgotPassword,
    resetPassword
}