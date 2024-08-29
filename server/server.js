const http = require('http');
const port = 3000;
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const {MongoClient} = require('mongodb');


const server = http.createServer((req, res) => {

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
    else if(parsed_url.pathname === '/submit' && req.method === 'POST'){
        console.log('reached here...');

        let body = '';
        req.on('data',(chunks) => {
            console.log("chunks : ",chunks);

            body += chunks.toString();
        });

        req.on('end',() => {

            let db = client.db("dms");
            let collection = db.collection("users");

            console.log('body : ',body);
            let datas = querystring.parse(body);
            console.log("datas : ",datas);

            console.log("name : ",datas.name);
            console.log("email : ",datas.email);
            console.log("password : ",datas.password);

            collection.insertOne({
                name : datas.name,
                email : datas.email,
                password : datas.password
            }).then((message) => {
                console.log('message : ',message);
                res.writeHead(201, {'Content-Type' : "text/plain"});
                res.end("users created succesfully");
            }).catch((error) => {
                console.log("error : ",error);
                res.writeHead(400, {'Content-Type' : 'text/plain'});
                res.end(error.message ? error.message : "user creation failed");
            })

        });

    }

});

server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});