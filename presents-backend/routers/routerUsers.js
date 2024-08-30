const express = require('express');

const routerUsers= express.Router();
const database = require("../database")

const activeApiKeys = require("../activeApiKeys")
const jwt = require("jsonwebtoken"); 

// CREAR USUARIO

routerUsers.post("/", async (req,res)=>{ 
    let email = req.body.email
    let password = req.body.password 
    let name = req.body.name

    let errors = []
    if ( email == undefined ){
        errors.push("no email in body")
    }
    if ( password == undefined ){
        errors.push("no password in body")
    }
    if ( password.length < 5 ){
        errors.push("password too short")
    }
    if ( name == undefined ){
        errors.push("no name in body")
    }
    if ( errors.length > 0){
        return res.status(400).json({error: errors})
    }

    database.connect();

    let insertedUser = null;
    try {

        userWithSameEmail = await database.query('SELECT email FROM users WHERE email = ?',
            [email])

        if ( userWithSameEmail.length > 0){
            database.disConnect();
            return res.status(400).json({error: "Already a user with that email"})
        }

        // ALMACENAR EN LA BBDD

        insertedUser = await database.query('INSERT INTO users (email,password,name) VALUES (?,?,?)',
            [email, password,name])

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    database.disConnect();
    res.json({inserted: insertedUser})
})

module.exports=routerUsers