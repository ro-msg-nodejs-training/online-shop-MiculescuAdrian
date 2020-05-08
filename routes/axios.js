const axios = require('axios');
var singleton = require('../util/singleton');
var client = singleton.getInstance().client;


axios.post('/createOrder', function (req, res) {
    try {
        client.db("OnlineShop").collection("Order").insertOne(req.body)
            .then(result => {
                res.sendStatus(204);
            })
    }
    catch (err) {
        res.sendStatus(404);
    }
}).then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
 