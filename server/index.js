const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

var url = `mongodb://${keys.mongoHost}:${keys.mongoPort}/${keys.mongoDatabase}`;

const mongoose = require('mongoose');

var valueSchema = mongoose.Schema({
    num: Number
})

Value = mongoose.model('Value', valueSchema);

mongoose.connect(url);
console.log("Trying to connect to " + url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, "Connectiong error in DB"));
db.once('open', function() {
    console.log("We are connected to DB");
    // addRandomValue();
})

var addRandomValue = function(){
    var n = Math.random()
    var v = new Value({
        num: n
    });

    v.save(function(err, number){
        if(err) return console.error(err);
        console.log("NUMBER ADDED "+n);
    })
}

var addValue = function(val){
    var v = new Value({
        num: val
    });

    v.save(function(err, number){
        if(err) return console.error(err);
        console.log("NUMBER ADDED "+number , "  VAL "+val);
    })
}

// var MongoClient = require('mongodb').MongoClient;

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Switched to "+db.databaseName+" database");
//     // create 'users' collection in newdb database
//     db.createCollection("users", function(err, result) {
//         if (err) throw err;
//         console.log("Collection is created!");
//         // close the connection to db when you are done with it
//         db.close();
//     }); 
// });


// Postgres Client Setup
const { Pool } = require('pg');

// const connectionString = `postgresql://${keys.pgUser}:${keys.pgPassword}@${keys.pgHost}:${keys.pgPort}/${keys.pgDatabase}`

// console.log("STRING", connectionString);

// const pgClient = new Pool({
//   connectionString: connectionString
// })

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

// const pgClient = new Pool({
//     user: 'postgres',
//     host: 'db',
//     database: 'postgres',
//     password: 'postgres_password',
//     port: 5432
// });

console.log("GETTING KEYS", keys.pgUser,
keys.pgHost,
keys.pgDatabase,
keys.pgPassword,
keys.pgPort);

pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)', (err, res) => {
        if (!err) {
            console.log("TABLE CREATES SUCCESSFULLY", res);
        }
        else {
            console.log(err)
        }
    })

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

console.log("INSIDE EXPRESS");

app.get('/api', (req, res) => {
    console.log("GETTING HOME");
    pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)', (err, res) => {
        if (!err) {
            console.log("TABLE CREATES SUCCESSFULLY", res);
        }
        else {
            console.log(err)
        }
    })
    console.log("SENT RES");
    res.send('Hi');
});

app.get('/api/values/all', async (req, res) => {

    Value.find(function(err, number){
        if(err) return res.error(err);
        console.log("GOT NUMBERS");
        res.json(number);
    })
    //   const values = await pgClient.query('SELECT * FROM values');

    // res.status(200).send(values);
});

app.get('/api/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/api/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    addValue(parseInt(index));
    // pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({ working: true });
});

app.listen(5000, err => {
    console.log('Listening');
});