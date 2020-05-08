/* eslint-disable no-undef */
let dataBase = require('../data/database');
var singleton = require('../util/singleton');
var axios = require('axios');
var express = require('express');
var fs = require('fs');
var router = express.Router();
let CategoryModel = require('../data/models/category')
let cat = new CategoryModel({
    Name: 'Category',
    Description: 'CategoryDesc'
})

var client = singleton.getInstance().client;

cat.save()
    .then(doc => {
        console.log(doc)
    })
    .catch(err => {
        console.error(err)
    });


router.get('/', async (req, res, next) => {
    try {
        client.db("OnlineShop").collection("Product").find({}).toArray()
            .then(result => {
                console.log(result);
                res.send(result);
            })
    }
    catch (err) {
        next(err);
    }
})

router.get('/product/:id_prod', function (req, res) {
    try {
        client.db("OnlineShop").collection("Product").find({
            id_prod: parseInt(req.params.id_prod)
        }).toArray()
            .then(result => {
                console.log(result);
                res.send(result);
            })
    }
    catch (err) {
        next(err);
    }
})

router.get('/pbc/:category', async (req, res, next) => {
    try {
        client.db("OnlineShop").collection("Product").find({
            "Category.id_cat": parseInt(req.params.category)
        }).toArray()
            .then(result => {
                console.log(result);
                res.send(result);
            })
    }
    catch (err) {
        next(err);
    }
})


router.get('/category', async (req, res, next) => {
    try {
        client.db("OnlineShop").collection("Product").find({}, { projection: { _id: 0, Category: 1 } }).toArray()
            .then(result => {
                console.log(result);
                res.send(result);
            })
    }
    catch (err) {
        next(err);
    }
})

router.get('/supplier', async (req, res, next) => {
    try {
        client.db("OnlineShop").collection("Product").find({}, { projection: { _id: 0, Supplier: 1 } }).toArray()
            .then(result => {
                console.log(result);
                res.send(result);
            })
    }
    catch (err) {
        next(err);
    }
})

router.get('/orders/:orders_id', async (req, res, next) => {
    try {
        client.db("OnlineShop").collection("Order").find({
            "order_id": parseInt(req.params.orders_id)
        }).toArray()
            .then(result => {
                console.log(result);
                res.send(result);
            })
    }
    catch (err) {
        next(err);
    }
})

router.get('/orders', async (req, res, next) => {
    try {
        client.db("OnlineShop").collection("Order").find().toArray()
            .then(result => {
                console.log(result);
                res.send(result);
            })
    }
    catch (err) {
        next(err);
    }
       
})
router.post("/orders",(req,res,next)=>{
    try {
        client.db("OnlineShop").collection("Order").insertOne(req.body)
            .then(result => {
                res.sendStatus(204);
            })
    }
    catch (err) {
        res.sendStatus(404);
    }

})



router.get('/ordersAxios', async (req, res, next) => {
     axios.get("http://localhost:3000/orders")
    .then(data => 
    res.send(data.data))
    .catch(err => res.send(err));
       
});
axios.get('https://reqres.in/api/users')
    .then(res => {
        console.log(res.data.data);
    })
    .catch(err => {
        console.log(err);
    });



router.delete('/product/:id_prod', function (req, res) {
    try {
        client.db("OnlineShop").collection("Product").deleteOne({
            id_prod: parseInt(req.params.id_prod)
        })
            .then(result => {
                res.sendStatus(204);
            })
    }
    catch (err) {
        res.sendStatus(404);
    }
})

router.post('/', function (req, res) {
    try {
        client.db("OnlineShop").collection("Product").insertOne(req.body)
            .then(result => {
                res.sendStatus(204);
            })
    }
    catch (err) {
        res.sendStatus(404);
    }
});
router.post('/upload/:image/:id_prod',function(req,res)
{
fs.readFile(__dirname + "//tmp//" + req.param.img + ".jpg",function(err,data){
    if(err) throw err;
    console.log(data);
    try{
    client.db("OnlineShop").collection("Product").findOneAndUpdate(
       { id_prod: parseInt(req.param.id_prod)},
       {
           $set:{
               image:data
           }
       },
       {
           upsert: true
       }
    ).then(result =>{
        res.sendStatus(204);
    })
    }
    catch(err)
    {
    res.sendStatus(404)
    }
})
})
router.post('/removeImage/:id_prod',function(req,res)
{
    //dirname => current folder, routes for example
fs.readFile(__dirname + "//tmp//" + req.param.img + ".jpg",function(err,data){
    if(err) throw err;
    console.log(data);
    try{
    client.db("OnlineShop").collection("Product").findOneAndUpdate(
       { id_prod: parseInt(req.param.id_prod)},
       {
           $set:{
               image:""
           }
       },
       {
           upsert: true
       }
    ).then(result =>{
        res.sendStatus(204);
    })
    }
    catch(err)
    {
    res.sendStatus(404)
    }
})
})
router.put('/product/:id_prod', function (req, res) {
    try {
        client.db("OnlineShop").collection("Product").findOneAndUpdate(
            { id_prod: parseInt(req.params.id_prod) },
            {
                $set: {
                    id_prod: req.body.id_prod,
                    Name: req.body.Name,
                    Description: req.body.Description,
                    Price: req.body.Price,
                    Weight: req.body.Weight,
                    Category: req.body.Category,
                    Supplier: req.body.Supplier,
                    ImageUrl: req.body.ImageUrl
                }
            },
            {
                upsert: true
            })
            .then(result => {
                res.sendStatus(204);
            })
    }
    catch (err) {
        res.sendStatus(404);
    }
});
router.put('/orders/:order_id', function (req, res) {
    try {
        client.db("OnlineShop").collection("Order").findOneAndUpdate(
            { order_id: parseInt(req.params.order_id) },
            {
                $set: {
                    order_id:req.body.order_id,
                    order_timestamp: req.body.order_timestamp,
                    delivery_address: req.body.delivery_address,
                    products: {
                        id: req.body.product.id,
                        quantity: req.body.product.quantity
                        },
                }
            },
            {
                upsert: true
            })
            .then(result => {
                res.sendStatus(204);
            })
    }
    catch (err) {
        res.sendStatus(404);
    }
});

module.exports = router;