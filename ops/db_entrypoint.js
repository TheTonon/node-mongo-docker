const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'lunchBot'
client.connect((err, client) => {
    const db = client.db(dbName)

    db.createCollection("bots", {validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "Name for the bot"
                }
            }
        }
    }});

    db.createCollection("messages", {validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["to", "from", "content", "conversationId"],
            properties: {
                to: {
                    bsonType: "objectId",
                    description: "Recipient ObjectID"
                },
                from: {
                    bsonType: "objectId",
                    description: "Sender ObjectID"
                },
                content: {
                    bsonType: "string",
                    description: "Contents of the message"
                },
                timestamp: {
                    bsonType: "timestamp",
                    description: "Message save time"
                },
            }
        }
    }});
});