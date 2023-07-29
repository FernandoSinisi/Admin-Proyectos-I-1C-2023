require("dotenv").config();
const express = require('express')
const bodyParser = require('body-parser')
const serverless = require('serverless-http')
const app = express()
const router = express.Router()
const cors = require('cors')
const crypto = require('crypto')
const { MongoClient } = require("mongodb")
const logger = require('./utils').logger;
const ObjectId = require('mongodb').ObjectId;

const mongoClient = new MongoClient( process.env.MONGODB_URI)
const ClientPromise = mongoClient.connect()


app.use(bodyParser.json())
app.use(cors({
    origin: '*',
    methods: ["POST","GET","PUT","DELETE"]
}));

/* Rating */
router.post('/rating', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_RATING)
    const coll = database.collection(collName)

    const doc = {
      publicationId: req.body.publicationId,
      rater: req.body.rater,
      ratee: req.body.ratee,
      role: req.body.role,
      comment: req.body.comment,
      rating: req.body.rating,
      public: req.body.public
  }

    const result = await coll.insertOne(doc)
    logger.info(collName,' info ',JSON.stringify(doc).substring(0,50));
    
    res.status(201)
    res.json(result)

  } catch(error){
    logger.error(error)
    res.status(500)
    res.json({error_code: 7, error_msg: "RATING_ERR"})
  }
})

router.get('/ratings', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_RATING)
    const coll = database.collection(collName)

    const result = await coll.find({}).toArray()

    logger.info(collName," retrieved: ", JSON.stringify(result).substring(0,50))
    res.json(result)

  } catch(error){
    console.log(error)
    res.status(500)
    res.json({error_code: 7, error_msg: "RATING_ERR"})
  }
})

router.get('/rating/:hashId', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_RATING)
    const coll = database.collection(collName)

    const hashId = req.params.hashId
    logger.info('Get ',collName,' with hash ',hashId)

    const o_id = new ObjectId(hashId);
    const result = await coll.findOne({"_id":o_id});

    logger.info(collName," retrieved: ",JSON.stringify(result).substring(0,50))
    res.json(result)
  } catch(error){
    logger.error(error)
    res.status(500)
    res.json({error_code: 7, error_msg: "RATING_ERR - "+error})
  }
})

router.get('/rating/publication/:hashPublicationId', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_RATING)
    const coll = database.collection(collName)

    const hashPublicationId = req.params.hashPublicationId
    logger.info('Get ',collName,' with hash ',hashPublicationId)

    const result = await coll.find({"publicationId": hashPublicationId}).toArray();

    logger.info(collName," retrieved: ",JSON.stringify(result).substring(0,50))
    res.json(result)
  } catch(error){
    logger.error(error)
    res.status(500)
    res.json({error_code: 7, error_msg: "RATING_ERR - "+error})
  }
})

router.put('/rating/:hashId', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_RATING)
    const coll = database.collection(collName)

    const hashId = req.params.hashId
    const o_id = new ObjectId(hashId);
    logger.info("Update ",collName," with hash ",hashId)

    const result = await coll.updateOne({"_id":o_id},{$set:req.body});

    logger.info(collName," retrieved: ",JSON.stringify(result).substring(0,50))
    res.json(result)
  } catch(error){
    console.log(error)
    res.status(500)
    res.json({error_code: 7, error_msg: "RATING_ERR"})
  }
})

router.delete('/rating/:hashId', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_RATING)
    const coll = database.collection(collName)

    const hashId = req.params.hashId
    const o_id = new ObjectId(hashId);
    logger.info("Delete ",collName," with hash " ,hashId)

    const result = await coll.deleteOne({"_id":o_id});

    res.json(result)
  } catch(error){
    console.log(error)
    res.status(500)
    res.json({error_code: 7, error_msg: "RATING_ERR"})
  }
})

/* Profile */
router.post('/profile', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_PROFILE)
    const coll = database.collection(collName)

    const doc = {
      userId: req.body.userId,
      name: req.body.name,
      lastName: req.body.lastName,
      email:req.body.email,
      age: req.body.age,
      country: req.body.country,
      sitterDescription: req.body.sitterDescription,
      ownerDescription: req.body.ownerDescription,
      picture: req.body.picture,
      pets: req.body.pets,
      amount: req.body.amount,
      sitterRating: req.body.sitterRating,
      ownerRating: req.body.ownerRating,
      subscription: req.body.subscription
    }

    const result = await coll.insertOne(doc)
    logger.info(collName,' info ',JSON.stringify(doc).substring(0,50));
    
    res.status(201)
    res.json(result)

  } catch(error){
    logger.error(error)
    res.status(500)
    res.json({error_code: 6, error_msg: "PROFILE_ERR"})
  }
})

router.post('/profiles', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_PROFILE)
    const coll = database.collection(collName)
    
    let filter = req.body.filters === undefined ? {} : req.body.filters
    let sort = req.body.sorts === undefined ? {} : req.body.sorts
    
    let result
    logger.info("Get profiles with filter:",filter," and sort:", sort)

    result = await coll.find(filter).sort(sort).toArray()

    logger.info(collName," retrieved: ",JSON.stringify(result).substring(0,50))
    res.json(result)
  } catch(error){
    logger.error(error)
    res.status(500)
    res.json({error_code: 6, error_msg: "PROFILE_ERR - "+error})
  }
})

router.get('/profile/:userId', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_PROFILE)
    const coll = database.collection(collName)

    const userId = req.params.userId
    logger.info('Get ',collName,' with hash ',userId)

    const result = await coll.findOne({"userId":userId});

    logger.info(collName," retrieved: ",+JSON.stringify(result).substring(0,50))
    res.json(result)
  } catch(error){
    console.log(error)
    res.status(500)
    res.json({error_code: 6, error_msg: "PROFILE_ERR"})
  }
})

router.put('/profile/:userId', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_PROFILE)
    const coll = database.collection(collName)

    const userId = req.params.userId
    logger.info("Update ",collName," with userId ",userId, " body update ", req.body)

    const result = await coll.updateOne({"userId":userId},{$set:req.body})

    logger.info(collName," retrieved: ",+JSON.stringify(result).substring(0,50))
    res.json(result)
  } catch(error){
    console.log(error)
    res.status(500)
    res.json({error_code: 6, error_msg: "PROFILE_ERR"})
  }
})

router.delete('/profile/:userId', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_PROFILE)
    const coll = database.collection(collName)

    const userId = req.params.userId
    
    logger.info("Delete ",collName," with userId " ,userId)

    const result = await coll.deleteOne({"userId":userId});

    res.json(result)
  } catch(error){
    console.log(error)
    res.status(500)
    res.json({error_code: 6, error_msg: "PROFILE_ERR"})
  }
})

/* Publication */
router.post('/publication', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_PUBLICATIONS)
    const coll = database.collection(collName)

    const doc = {
      postulationIds: req.body.postulationIds,
      imgs: req.body.imgs,
      title: req.body.title,
      dateFrom: req.body.dateFrom,
      dateTo: req.body.dateTo,
      place: req.body.place,
      type: req.body.type,
      pets: req.body.pets,
      userId: req.body.userId,
      description: req.body.description,
      open: req.body.open,
      role: req.body.role
    }
    logger.info(collName,' info ',JSON.stringify(doc).substring(0,50));
    const result = await coll.insertOne(doc)
    logger.info(collName,' info ',JSON.stringify(result).substring(0,50));
        
    res.status(200)
    return res.json({id: result.insertedId})

  } catch(error){
    logger.error(error)
    res.status(500)
    res.json({error_code: 5, error_msg: "PUBLICATION_ERR"})
  }
})

router.get('/publication/:hashId', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_PUBLICATIONS)
    const coll = database.collection(collName)

    const hashId = req.params.hashId
    logger.info('Get ',collName,' with hash ',hashId)

    const o_id = new ObjectId(hashId);
    const result = await coll.findOne({"_id":o_id});

    logger.info(collName," retrieved: ",JSON.stringify(result).substring(0,50))
    res.json(result)
  } catch(error){
    logger.error(error)
    res.status(500)
    res.json({error_code: 5, error_msg: "PUBLICATION_ERR - "+error})
  }
})

router.get('/publications', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_PUBLICATIONS)
    const coll = database.collection(collName)

    const result = await coll.find({}).toArray()

    logger.info(collName," retrieved: ",JSON.stringify(result).substring(0,50))
    res.json(result)
  } catch(error){
    console.log(error)
    res.status(500)
    res.json({error_code: 5, error_msg: "PUBLICATION_ERR"})
  }
})

router.put('/publication/:hashId', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_PUBLICATIONS)
    const coll = database.collection(collName)

    const hashId = req.params.hashId
    const o_id = new ObjectId(hashId);
    logger.info("Update ",collName," with hash ",hashId)

    const result = await coll.updateOne({"_id":o_id},{$set:req.body});

    logger.info(collName," retrieved: ", JSON.stringify(result).substring(0,50))
    res.json(result)
  } catch(error){
    console.log(error)
    res.status(500)
    res.json({error_code: 5, error_msg: "PUBLICATION_ERR"})
  }
})

router.delete('/publication/:hashId', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_PUBLICATIONS)
    const coll = database.collection(collName)

    const hashId = req.params.hashId
    const o_id = new ObjectId(hashId);
    logger.info("Delete ",collName," with hash " ,hashId)

    const result = await coll.deleteOne({"_id":o_id});

    res.json(result)
  } catch(error){
    console.log(error)
    res.status(500)
    res.json({error_code: 5, error_msg: "PUBLICATION_ERR"})
  }
})

router.delete('/publication/:pubId/postulation/:postId', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collName = String(process.env.MONGODB_COLL_PUBLICATIONS)
    const coll = database.collection(collName)

    const postId = req.params.postId
    const pubId = req.params.pubId
    const o_id = new ObjectId(pubId)
    logger.info("Delete postulation ",postId," for publication ",pubId)

    
    const result = await coll.updateOne({"_id":o_id}, {
      $pullAll: {
          postulations: [req.params.postId],
      },
    });
    if(result.modifiedCount === 0 ) throw new Error(`Publication was not modified`)
    res.json(result)
  } catch(error){
    console.log(error)
    res.status(500)
    res.json({error_code: 5, error_msg: "PUBLICATION_ERR"})
  }
})

/* Postulation */
router.post('/postulation', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collPostulations = database.collection(process.env.MONGODB_COLL_POSTULATIONS)

    const postulation = {
      comment: req.body.comment,
      ownerId: req.body.ownerId,
      publicationId: req.body.publicationId,
      role: req.body.role,
      state: req.body.state,
      userId: req.body.userId
    }

    // const postulation = {
    //   img: 0,
    //   date: new Date().toJSON(),
    //   title: req.body.title,
    //   place: req.body.place,
    //   userId: req.body.userId,
    //   state: req.body.state,
    //   comment: req.body.comment,
    //   userHouseId: req.body.userHouseId
    // }

    const result = await collPostulations.insertOne(postulation)
    logger.info("postulation info: "+JSON.stringify(postulation).substring(0,50))
    res.status(200)
    res.json({id: result.insertedId})

  } catch(error){
    res.status(500)
    res.json({error_code: 4, error_msg: "POSTULATION_ERR"})
  }
})

router.get('/postulation/:hashId', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collPostulations = database.collection(process.env.MONGODB_COLL_POSTULATIONS)
    const hashId = req.params.hashId
    console.log("get postulation:"+hashId)

    const o_id = new ObjectId(hashId);
    const result = await collPostulations.findOne({"_id":o_id});

    logger.info("postulation retrieved: "+JSON.stringify(result).substring(0,50))
    res.json(result)
  } catch(error){
    console.log(error)
    res.status(500)
    res.json({error_code: 4, error_msg: "POSTULATION_ERR"})
  }
})

router.get('/postulations', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collPostulations = database.collection(process.env.MONGODB_COLL_POSTULATIONS)

    const result = await collPostulations.find({}).toArray()

    logger.info("postulation retrieved: "+JSON.stringify(result).substring(0,50))
    res.json(result)
  } catch(error){
    console.log(error)
    res.status(500)
    res.json({error_code: 4, error_msg: "POSTULATION_ERR"})
  }
})

router.put('/postulation/:hashId', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collPostulations = database.collection(process.env.MONGODB_COLL_POSTULATIONS)

    const hashId = req.params.hashId
    const o_id = new ObjectId(hashId);
    logger.info("update postulation: "+hashId)

    const result = await collPostulations.updateOne({"_id":o_id},{$set:req.body});

    logger.info("postulation retrieved: "+JSON.stringify(result).substring(0,50))
    res.json(result)
  } catch(error){
    console.log(error)
    res.status(500)
    res.json({error_code: 4, error_msg: "POSTULATION_ERR"})
  }
})

router.delete('/postulation/:hashId', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collPostulations = database.collection(process.env.MONGODB_COLL_POSTULATIONS)

    const hashId = req.params.hashId
    const o_id = new ObjectId(hashId);
    logger.info("update postulation:"+hashId)

    const result = await collPostulations.deleteOne({"_id":o_id});

    logger.info("postulation retrieved: "+JSON.stringify(result).substring(0,50))
    res.json(result)
  } catch(error){
    console.log(error)
    res.status(500)
    res.json({error_code: 4, error_msg: "POSTULATION_ERR"})
  }
})

/* Auth */
const handlerId = async() => {
    try {
      const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
      const collection = database.collection(process.env.MONGODB_COLL_ID)
  
      const results = await collection.findOneAndUpdate({coll_name:"id"},{ $inc: {last_id: 1}})
      const newId = results.value.last_id + 1
      logger.info("Result of new id: "+newId)
      
      return {new_id:newId}
  
    } catch(error){
      return {statusCode: 500, body: error.toString() }
    }
}

router.get('/user/:email/validation/:password',cors(), async (req, res) => {
  try {
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collUsers = database.collection(process.env.MONGODB_COLL_USERS)
    logger.info("Search user for email: "+req.params.email)
    const result = await collUsers.findOne({email: req.params.email})
    logger.info("User retrieved: "+ JSON.stringify(result))
    if(result != null){
      const passToCheck = crypto.createHash('sha256', process.env.SECRET).update(req.params.password).digest('hex')
      logger.info("pass to  check: "+passToCheck)
      logger.info("pass retrieved: "+result.password)
      if(passToCheck == result.password){
        return res.json(result)
      }
    }
  } catch(error){
    res.status(500)
    res.json({error_code: 0, error_msg: "USER_BAD"})
  }
  res.status(400)
  res.json({error_code: 2, error_msg: "USER_BAD"})
})

router.get('/user/:email',cors(), async (req, res) => {
  try {
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collUsers = database.collection(process.env.MONGODB_COLL_USERS)
    logger.info("Search user for email: "+req.params.email)
    const result = await collUsers.findOne({email: req.params.email})
    logger.info("User retrieved: "+ JSON.stringify(result).substring(0,50))
    if(result != null){
      res.json(result)
    } else {
      res.status(400)
      res.json({error_code: 1, error_msg: "USERS_ERR"})
    }
    
  } catch(error){
    return {statusCode: 500, body: error.toString() }
  }
})

router.post('/user',cors(), async (req, res) => {
  try {
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collection = database.collection(process.env.MONGODB_COLL_ID)
  
    const results = await collection.findOneAndUpdate({coll_name:"id"},{ $inc: {last_id: 1}})
    const newId = results.value.last_id + 1

    const collUsers = database.collection(process.env.MONGODB_COLL_USERS)
    
    const hashPassword = crypto.createHash('sha256', process.env.SECRET).update(req.body.password).digest('hex')

    logger.info("New hash password created: "+hashPassword)

    const user = {
      date: new Date().toJSON(),
      userId: String(newId),
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    }

    const result = await collUsers.insertOne(user)

    res.status(201)
    res.json(user)

  } catch(error){
    logger.error(error)
    res.status(500)
    res.json({error_code: 1, error_msg: "USERS_ERR"})
  }
})


router.get('/users', cors(), async(req, res) => {
  try{
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collUsers = database.collection(process.env.MONGODB_COLL_USERS)

    const result = await collUsers.find({}).toArray()

    logger.info("postulation retrieved: "+JSON.stringify(result).substring(0,50))
    res.json(result)
  } catch(error){
    logger.error(error)
    res.status(500)
    res.json({error_code: 1, error_msg: "USERS_ERR"})
  }
})

router.get('/user/id',cors(), async (req, res) => { res.json(handlerId())})

router.get('/message/:userIdFrom', async (req,res) => {
  try {
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collection = database.collection(process.env.MONGODB_COLL_MESSAGES)
    console.log("userInFrom: "+req.params.userIdFrom)

    const results = await collection.find({
      userIdFrom: parseInt(req.params.userIdFrom)
    }).sort( {date:1}).toArray()
    
    console.log("Results find messages: "+results)
    
    res.json(results)

  } catch(error){
    return {statusCode: 500, body: error.toString() }
  }
})

router.post('/message', async (req,res) => {
  try {
    
    const database = (await ClientPromise).db(process.env.MONGODB_DATABASE)
    const collection = database.collection(process.env.MONGODB_COLL_MESSAGES)

    let date = new Date().toJSON();
        console.log("date: "+date+",userIdFrom:"+req.body.userIdFrom);
        let msjObj = {
            date: date,
            userIdFrom: req.body.userIdFrom,
            userIdTo: req.body.userIdTo,
            message: req.body.message,
            read: false,
    }

    const result = await collection.insertOne(msjObj)
    console.log("results: "+result)
    
    res.json(result)

  } catch(error){
    return {statusCode: 500, body: error.toString() }
  }
})

app.use(function(req, res, next) {
  logger.info("Checking authorization...")
  if (!req.headers.authorization ||
    req.headers.authorization.split(" ")[1] != process.env.API_SECRET
     ) {
    logger.error("Authorization denied!")
    return res.status(403).json({ error: 'No credentials sent!' });
  }
  
  logger.info("Authorization success!")
  next();
});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);