const express = require('express');
const { MongoClient } = require('mongodb')
const assert = require('assert')
const bodyParser = require('body-parser')
const { ObjectID } = require('bson');

const app = express();
const port = 3000;

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'lunchBot';
const client = new MongoClient(mongoUrl);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function getBots(req, res){
    client.connect((err, client) => {
        assert.equal(null, err);
        const db = client.db(dbName);

        db.collection('bots').find({}).toArray((err, docs) => {
            assert.equal(null, err);
            res.send(JSON.stringify(docs))
        })
    })
};

function getBotById(req, res){
    client.connect((err, client) => {
        assert.equal(null, err);
        const db = client.db(dbName);
        
        db.collection('bots').find(
            {id:req.params.id}
            ).toArray((err, docs) => {
                assert.equal(null, err);
                res.send(JSON.stringify(docs));
        });
    });
};

function postMessage(req, res){
    client.connect((err, client) => {
        assert.equal(null, err);
        const db = client(dbName);

        let message = req.body.message;
        let conversationId = req.body.conversationId;

        if (message === undefined) {
            res.send({status:'missing message'})
        };

        if (conversationId === undefined) {
            conversationId = new ObjectID();
        };
        const sender = new ObjectID();

        db.collection('messages').insertOne({
            from: sender,
            to: 'bot',
            content: message,
            conversationId: conversationId
        }, (err, r) => {
            assert.equal(null, err);
        });
        res.send({status: 'OK'})
    });
};

function getMessages(req, res){
    client.connect((err, client) => {
        assert.equal(null, err);
        const db = client(dbName);

        db.collection('messages').find({}).toArray((err, docs) => {
            assert.equal(null, err);
            res.send(JSON.stringify(docs));
        });
    });
};

function getMessageById(req, res){
    client.connect((err, client) => {
        assert.equal(null, err);
        const db = client(dbName);

        db.collection('messages').find({id:req.params.id}).toArray((err, docs) => {
            assert.equal(null, err);
            res.send(JSON.stringify(docs));
        });
    });
};

function getMessagesInConversationId(req, res){
    client.connect((err, client) => {
        assert.equal(null, err);
        const db = client(dbName);

        db.collection('messages').find({conversationId: req.params.conversationId}).toArray((err, docs) => {
            assert.equal(null, err);
            res.send(JSON.stringify(docs));
        });
    });
};

app.get('/', (req, res) => {res.send('Hello World')});

app.get('/bots', getBots);
app.get('/bot/:id', getBotById);

app.get('/messages', getMessages);
app.post('/messages', postMessage);
app.get('/messages/:id', getMessageById);
app.get('/messages?conversationId=:conversationId', getMessagesInConversationId);

app.listen(port, () => console.log('Assignment'))