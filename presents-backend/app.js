const express = require('express');
const jwt = require("jsonwebtoken");
const activeApiKeys = require("./activeApiKeys");
const port = 4000

const app = express();

const routerUsers= require("./routers/routerUsers")

var cors = require('cors');
app.use(cors());

app.use(express.json());

// MIDDLEWARE

app.use(["/"], (req,res,next) => {
    console.log("middleware execution");

    let apiKey = req.query.apiKey
	if ( apiKey == undefined ){
		res.status(401).json({ error: "no apiKey" });
		return 
	}
	let infoInApiKey = jwt.verify(apiKey, "secret");
	if ( infoInApiKey == undefined || activeApiKeys.indexOf(apiKey) == -1){
		res.status(401).json({ error: "invalid apiKey" });
		return 	
	}

	req.infoInApiKey = infoInApiKey;
    next();
})

// ROUTERS
app.use("/users", routerUsers)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})