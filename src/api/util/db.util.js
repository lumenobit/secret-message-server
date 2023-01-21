const { MongoClient } = require("mongodb");

class AppDbUtil {

    static connectionString = process.env['MONGODB_CONNETION_STRING'];

    static async getMongoDbClient() {
        return await MongoClient.connect(
            this.connectionString,
            { useNewUrlParser: true, useUnifiedTopology: true });
    }

}

module.exports = AppDbUtil