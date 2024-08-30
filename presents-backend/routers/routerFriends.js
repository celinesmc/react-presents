const express = require('express');

const routerFriends= express.Router();
const database = require("../database")

const activeApiKeys = require("../activeApiKeys")
const jwt = require("jsonwebtoken"); 

routerFriends.post("/", async (req,res)=>{ // Para agregar un amigo
    let emailFriend = req.body.emailFriend
    let emailUser = req.infoInApiKey.email
    let errors = []

    database.connect();
    let usersInList = await database.query("SELECT emailFriend FROM friends WHERE emailMainUser = ?",
        [emailUser])
    let friendsList = usersInList.map(row => row.emailFriend);

    let usersReg = await database.query("SELECT email FROM users");
    let usersList = usersReg.map(row => row.email);
    database.disConnect();
    
    if (friendsList.includes(emailFriend)){
        errors.push("friend already added")
    }
    if (emailFriend == emailUser){
        errors.push("you can't add yourself")
    }
    if ( emailFriend == undefined ){
        errors.push("no email in body")
    }
    if (usersList.includes(emailFriend) == false) {
        errors.push("that user does not exist")
    }
    if ( errors.length > 0){
        return res.status(400).json({error: errors})
    }


    database.connect();

    let insertedFriend = null;
    try {
        insertedFriend = await database.query('INSERT INTO friends VALUES (?, ?)',
            [emailUser, emailFriend])

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    if ( insertedFriend.length == 0){
        return res.status(401).json({error: "invalid email"})
    }

    database.disConnect();
    res.json({inserted: insertedFriend})
})

module.exports=routerFriends