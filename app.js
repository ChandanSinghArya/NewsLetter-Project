const express= require("express");
const bodyParser=require("body-parser");
const request= require("request");
const https= require("https");

const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname+"/sighup.html");
});

app.post("/",function(req, res){
  const firstNames=req.body.firstName;
  const lastNames=req.body.lastName;
  const email= req.body.email;
  const phoneNumber= req.body.mobileNumber;

  const data= {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: firstNames,
          LNAME: lastNames,
          PHONE: phoneNumber
        }

      }
    ]
  };

  const jsonData=JSON.stringify(data);

  const url="https://us17.api.mailchimp.com/3.0/lists/2889353b56";
  const options={
    method: "POST",
    auth: "Chandan5:98f920f18c3dc37db090fb324f41e5da-us17"
  }


  const request = https.request(url, options, function(response){
    response.on("data", function(data){
      console.log(JSON.parse(data));
      var status=response.statusCode;

      if (status==200) {
        res.sendFile(__dirname+"/successs.html");
      }
      else {
        res.sendFile(__dirname+"/failure.html")
      }

    });

  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000");
});


// const key="98f920f18c3dc37db090fb324f41e5da-us17";
// const listId="2889353b56";
