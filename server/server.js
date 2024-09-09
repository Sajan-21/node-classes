const http = require('http');
const port = 3000;
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const {MongoClient, ObjectId} = require('mongodb');

const server = http.createServer(async (req, res) => {

    const client = new MongoClient('mongodb://localhost:27017');

    async function connect(){
        try {

            await client.connect();
            console.log('database connected');
            
        } catch (error) {

            console.log('error : ',error);
            
        }
    }

    connect();

    let db = client.db("dms");
    let collection = db.collection("users");

    const req_url = req.url;
    console.log("req_url : ",req_url);

    const parsed_url = url.parse(req_url);
    console.log("parsed_url : ",parsed_url);

    if(parsed_url.pathname === '/'){
        res.writeHead(200, {'content-Type' : 'text/html'});
        res.end(fs.readFileSync('../client/index.html'));
    }
    else if(parsed_url.pathname === '/style.css'){
        res.writeHead(200, {'content-Type' : 'text/css'});
        res.end(fs.readFileSync('../client/style.css'));
    }
    else if(parsed_url.pathname === '/addUser.html'){
        res.writeHead(200, {'content-Type' : 'text/html'});
        res.end(fs.readFileSync('../client/addUser.html'));
    }
    else if(parsed_url.pathname === '/script.js'){
        res.writeHead(200, {'content-Type' : 'text/javascript'});
        res.end(fs.readFileSync('../client/script.js'));
    }
    else if(parsed_url.pathname === '/viewData.html'){
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(fs.readFileSync("../client/viewData.html"));
    }
    else if(parsed_url.pathname === '/single.html'){
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(fs.readFileSync("../client/single.html"));
    }
    else if(parsed_url.pathname === '/addUser.css'){
        res.writeHead(200, {'content-Type' : 'text/css'});
        res.end(fs.readFileSync('../client/addUser.css'));
    }
    else if(parsed_url.pathname === '/single.css'){
        res.writeHead(200, {'content-Type' : 'text/css'});
        res.end(fs.readFileSync('../client/single.css'));
    }
    else if(parsed_url.pathname === '/submit' && req.method === 'POST'){
        console.log('reached here...');

        let body = '';
        req.on('data',(chunks) => {
            console.log("chunks : ",chunks);

            body += chunks.toString();
        });

        req.on('end',async() => {

            console.log('body : ',body);
            let datas = JSON.parse(body);
            console.log("datas : ",datas);

            console.log("name : ",datas.name);
            let name = datas.name;
            console.log("name : ",name);
            let regExpName = /^[a-z]+[a-z]$/i;
            let resultName = regExpName.test(name);
            if(resultName === false){
                console.log("enter valid name");
            }

            console.log("email : ",datas.email);
            let email = datas.email;
            console.log("email : ",email);
            let regExpemail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            let resultemail = regExpemail.test(email);
            if(resultemail === false){
                console.log("enter valid email");
            }

            console.log("password : ",datas.password);
            let password = datas.password;
            console.log("password : ",password);

            if(resultName === true && resultemail === true){
                if(!(email === await collection.findOne({email}))){

                    collection.insertOne({
                        name,
                        email,
                        password
                    }).then((message) => {
                        console.log('message : ',message);
                        res.writeHead(201, {'Content-Type' : "text/plain"});
                        res.end("users created succesfully");
                    }).catch((error) => {
                        console.log("error : ",error);
                        res.writeHead(400, {'Content-Type' : 'text/plain'});
                        res.end(error.message ? error.message : "user creation failed");
                    });

                }else{

                    console.log("email already exists...");
                    res.writeHead(400, {'Content-Type' : 'text/plain'});
                    res.end("email already exists...");

                }

            }else{

                res.writeHead(400, {'Content-Type' : 'text/plain'});
                res.end("validation failed");

            }

        });

    }
    else if(parsed_url.pathname === '/submit' && req.method === 'GET'){

        let dbData = await collection.find().toArray();
        console.log("dbData : ",dbData);

        let stringifiedData = JSON.stringify(dbData);
        console.log("stringifiedData : ",stringifiedData);

        res.writeHead(200, {'Content-Type' : 'text/json'});
        res.end(stringifiedData);
    }
    else if(parsed_url.pathname === '/user' && req.method === 'GET'){
        
        let query = parsed_url.query;
        console.log("query : ",query);

        let parsed_query = querystring.parse(query);
        console.log("parsed_query : ",parsed_query);

        let id = parsed_query.id;
        console.log("id : ",id);

        let _id = new ObjectId(id);
        console.log("_id : ",_id);

        let userData = await collection.findOne({_id});
        console.log("userData : ",userData);

        let strUserData = JSON.stringify(userData);
        console.log("strUserData : ",strUserData);

        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(strUserData);

    }
    else if(parsed_url.pathname === '/user' && req.method === 'PUT'){

        let query = parsed_url.query;
        console.log("query : ",query);

        let parsed_query = querystring.parse(query);
        console.log("parsed_query : ",parsed_query);

        let id = parsed_query.id;
        console.log("id : ",id);

        let _id = new ObjectId(id);
        console.log("_id : ",_id);

        let body = '';
        req.on('data',(chunks) => {
            console.log("chunks : ",chunks);

            body += chunks.toString();
        });

        req.on('end',async () => {

            console.log("body : ",body);
            let parsed_body = JSON.parse(body);
            console.log("parsed_body : ",parsed_body);

            console.log("name : ",parsed_body.name);
            let name = parsed_body.name;
            console.log("name : ",name);
            let regExpName = /^[a-z]+[a-z]$/i;
            let resultName = regExpName.test(name);
            if(resultName === false){
                console.log("enter valid name");
            }

            console.log("email : ",parsed_body.email);
            let email = parsed_body.email;
            console.log("email : ",email);
            let regExpemail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            let resultemail = regExpemail.test(email);
            if(resultemail === false){
                console.log("enter valid email !");
            }

            console.log("password : ",parsed_body.password);
            let password = parsed_body.password;
            console.log("password : ",password);

            if(resultName === true && resultemail === true){
                

                    let updatedDatas = {
                        name,
                        email,
                        password
                    }
        
                    await collection.updateOne({_id},{$set : updatedDatas});
        
                    res.writeHead(200, {'Content-Type' : 'text/plain'});
                    res.end("user updated successfully");

                

            }else{

                res.writeHead(400, {'Content-Type' : 'text/plain'});
                res.end("user updation failed");

            }

        })

    }

    else if(parsed_url.pathname === '/user' && req.method === 'DELETE'){

        let query = parsed_url.query;
        console.log("query : ",query);

        let parsed_query = querystring.parse(query);
        console.log("parsed_query : ",parsed_query);

        let id = parsed_query.id;
        console.log("id : ",id);

        let _id = new ObjectId(id);
        console.log("_id : ",_id);

        await collection.deleteOne({_id});

        res.writeHead(200, {'Content-Type' : 'text/plain'});
        res.end("user deleted succesfully");

    }

});

server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});