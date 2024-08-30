const express = require('express');

const routerPresents= express.Router();
const database = require("../database")

routerPresents.get("/", async (req,res)=>{ // Ver los regalos de un usuario
    let emailInApikey = req.infoInApiKey.email
    database.connect();

    let presents = await database.query('SELECT presents.* , users.email FROM presents JOIN users ON presents.userId = users.id WHERE users.email = ?', 
        [emailInApikey])

    database.disConnect();
    res.send(presents)
})

routerPresents.post("/", async (req,res)=>{ // Crear un regalo
    let idUser = req.infoInApiKey.id
    let name = req.body.name
    let description = req.body.description
    let url = req.body.url
    let price = parseFloat(req.body.price)

    if ( name == undefined ){
        return res.status(400).json({error: "no name in body"})
    }
    if ( description == undefined ){
        return res.status(400).json({error: "no description in body"})
    }
    if ( url == undefined ){
        return res.status(400).json({error: "no url in body"})
    }
    if ( price == undefined ){
        return res.status(400).json({error: "no price in body"})
    }

    database.connect();

    let insertedPresent = null;
    try {
        insertedPresent = await database.query(
            'INSERT INTO presents (userId, name, description, url, price) VALUES (?,?,?,?,?)',
            [idUser, name, description, url, price])
    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    database.disConnect();
    res.json({inserted: insertedPresent})
})

module.exports=routerPresents