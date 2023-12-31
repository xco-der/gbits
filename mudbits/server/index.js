const express = require('express');
const cors =  require('cors'); 
const { MongoClient } = require("mongodb");
const bodyParser = require('body-parser');
const {generateRandomString} = require('./random')
require('dotenv').config()


const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


async function getDashBoard(_id){
    const uri = process.env.uri;
    
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Globalbits";
  const collectionName = "Dashboard";

  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  const findOneQuery = { username: _id };

  try {
    const findOneResult = await collection.findOne(findOneQuery);
    if (findOneResult === null) {
      console.log(
        `Couldn't find any package that contain ${_id} as an name.\n`
      );
    } else {
      console.log(`Found a recipe with 'potato' as an ingredient:\n${JSON.stringify(findOneResult) }\n`)
      return(JSON.stringify(findOneResult))
      ;
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  // Make sure to call close() on your client to perform cleanup operations
  await client.close(); 
}   

async function login(username,password) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Globalbits";
  const collectionName = "Users";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const findOneQuery = { username: username };

  try {
    const findOneResult = await collection.findOne(findOneQuery);
    if (findOneResult !== null) {
      if (findOneResult.password === password) {
        await client.close();
        return true;

      } else {
        await client.close();
        return false;
      }
    } else {
      await client.close();
      return false;
      
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one user: ${err}\n`);
  }
  // Make sure to call close() on your client to perform cleanup operations
  await client.close();
}


async function register(_username, _password, _code, _email, _fullname, _btc, _eth) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);  
  await client.connect();
  const dbName = "Globalbits";
  const collectionName = "Users";
  const database = client.db(dbName);
  const user_collection = database.collection(collectionName);
  const dashboard_collection = database.collection("Dashboard");


  const user = {
    username: _username,
    password: _password,
    email: _email,
    code: _code,
    fullname: _fullname,
    bitcoin_wallet: _btc,
    ether_wallet: _eth
  };

  const dashboard = {
    username:_username,
    balance : 0,
    deposits: 0,
    earnings: 0,
    withdrawals:0,
    pending:0
  }


  try {
    const insertOneUser = await user_collection.insertOne(user);
    const insertManyDashboard = await dashboard_collection.insertOne(dashboard);
    console.log(`${user.username} successfully inserted.\n`);
    console.log(`${dashboard.balance} successfully inserted.\n`);
    await client.close();
    return true;
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  }
  await client.close();

}

app.get('/dashboard/:user', (req,res)=>{
    async function getMyDashboard(){
        const { user } = req.params;
        const data = await getDashBoard(user);
        res.send({data:data})
    }getMyDashboard()
})

app.post('/register',(req,res)=>{
  async function create_account() {
    console.log(req.body)
    const { username, password, code, email, fullname, bitcoin_wallet,ether_wallet } = req.body;
    const success = await register(username,password,code,email,fullname,bitcoin_wallet,ether_wallet);
    if (success) {
        res.send(success)
    }else{
      res.status(400).send("unable to save to database");
      }
  } create_account()
})

app.post("/login", (req, res) => {
  async function approve() {
    console.log(req.body)
    const { username, password } = req.body;
    const response = await login(username, password)
    if(response){
      res.send(response)
    }else{
    res.status(400).send("wrong username or password");
    }
  }approve()
})


const port = 8000
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}!.`)
})
