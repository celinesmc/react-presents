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

routerPresents.get("/:id", async (req,res)=>{
    let idInApikey = req.infoInApiKey.id
    let presentId = parseInt(req.params.id)
    database.connect();

    let presentUser = await database.query("SELECT userId FROM presents WHERE id = ?", [presentId])
    presentUser = presentUser[0].userId

    let present = []

    if (idInApikey != presentUser) {
        return res.status(400).json({error: "this present is not yours"})
    } else {
        present = await database.query ("SELECT * FROM presents WHERE id = ?", [presentId])
    }

    database.disConnect();
    res.send(present)
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

routerPresents.delete("/:id", async (req,res)=>{ // Para borrar un regalo
    let id = req.params.id
    let idInApikey = req.infoInApiKey.id;

    if ( id == undefined ){
        return res.status(400).json({error: "no id "})
    }
    database.connect();
    try {
    
        let presents = await database.query('SELECT * FROM presents WHERE id = ? AND userId = ?', 
            [id, idInApikey])

        if (presents.length == 0) {
            return res.status(404).json({ error: "Present not found or unauthorized" });
        }

        if ( presents.length > 0){
            await database.query('DELETE FROM presents WHERE id = ?', 
                [id])
        }
    } catch (e){
        res.status(400).json({error: e })
        return
    }
    
    database.disConnect();
    res.json({deleted: true})
})

routerPresents.put("/:id", async (req,res)=>{
    let idUser = req.infoInApiKey.id
    let idPresent = parseInt(req.params.id)

    let name = req.body.name
    let description = req.body.description
    let url = req.body.url;
    let price = req.body.price;

    database.connect();

    let updatedPresent = null;
    try {
        let presents = await database.query('SELECT * FROM presents WHERE id = ? AND userId = ?',[idPresent, idUser])

            if (presents.length == 0) {
                return res.status(404).json({ error: "Present not found or unauthorized" });
            }
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
            updatedPresent = await database.query(
                'UPDATE presents SET name = ?, description = ?, url = ?, price = ? WHERE id = ? ', 
                [name, description, url, parseInt(price), idPresent])
    } catch (e) {
        database.disConnect();
        return res.status(400).json({error: e})
    }

    database.disConnect();
    res.json({modifiyed: updatedPresent})
})

module.exports=routerPresents