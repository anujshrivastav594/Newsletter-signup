const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // console.log("first name = " + firstName + ", last name = " + lastName + ", email = " + email);

    const data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
                
            }
        ]
    };

    const JsonData = JSON.stringify(data);

    //note:: for getting data from url use https.get() but for post data to url use https.request providing option section to post ntead of ge(by default)
    const url = "https://us21.api.mailchimp.com/3.0/lists/a2b470fe3f";
    const options = {
        method : "POST",
        auth : "key:101c9729883b0ed0415f60a510ab182a-us21"
    }
    const request = https.request(url, options, function(response) {

        if(response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
        res.sendFile(__dirname + "/failure.html");
       }
        console.log(response.statusCode);  
        // response.on("data", function(data) {
        //      console.log(JSON.parse(data));  //unexpected error .dont know 
        // })
    })
    request.write(JsonData);
    request.end();
})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(req, res) {
    console.log("Server is running on port 3000.");
})


//Api key = 101c9729883b0ed0415f60a510ab182a-us21
//audience id or list id =  a2b470fe3f