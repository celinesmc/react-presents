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

routerUsers.post("/login", async (req,res)=>{ // Para conectarte
    let email = req.body.email
    let password = req.body.password 
    let errors = []

    if ( email == undefined ){
        errors.push("no email in body")
    }
    if ( password == undefined ){
        errors.push("no password in body")
    }
    if ( errors.length > 0){
        return res.status(400).json({error: errors})
    }

    database.connect();

    let selectedUsers = null;
    try {
        selectedUsers = await database.query('SELECT id, email FROM users WHERE email = ? AND password = ?',
            [email, password])

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    if ( selectedUsers.length == 0){
        return res.status(401).json({error: "invalid email or password"})
    }

    database.disConnect();

    // Genera la apiKey

    let apiKey = jwt.sign(
		{ 
			email: selectedUsers[0].email,
			id: selectedUsers[0].id,
            name: selectedUsers[0].name 
		},
		"secret");
	activeApiKeys.push(apiKey) // La guarda en activeApiKeys


    res.json({
        apiKey: apiKey,
        id: selectedUsers[0].id,
        email: selectedUsers[0].email
    })
})

routerUsers.get("/disconnect", async (req,res)=>{ // Para desconectarte. 
    // Elimina la apiKey de la lista de apiKeys activas
    const index = activeApiKeys.indexOf(req.query.apiKey);
    if (index > -1) { 
        activeApiKeys.splice(index, 1); 
        res.json({removed: true})
    } else {
        return res.status(400).json({error: "user not found"})
    }
})

routerUsers.get("/checkLogin", async (req,res)=>{ // Para checkear si un usuario está conectado
    // Se debe ejecutar el middleware
    return res.status(400).json({message: "ok"})
})

module.exports=routerUsers