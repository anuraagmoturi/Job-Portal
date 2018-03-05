var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/marlabs');

var db = mongoose.connection;

db.on('error', function () {
    console.log("Error connecting to database");
});

db.on('open', function () {
    console.log('connection established');
});

var UserSchema = mongoose.Schema({
    "username": String,
    "password": String,
    "email": String,
    "location": String,
    "phone": Number,
    "userType": String
});

var User = mongoose.model('users', UserSchema);

var JobSchema = mongoose.Schema({
    "title":String,
    "description":String,
    "location":String
});

var Job = mongoose.model('jobs',JobSchema);


var loggedInSchema = mongoose.Schema({
    "logged":String
});

var checkLoggedIn = mongoose.model('checkLog',loggedInSchema);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/home.html');
});


app.post('/regUser', function (req, res) {
    console.log("inside regUser1");
    console.log(req.body);
    var user = req.body;
    var regUser = new User({
        "username": user.username,
        "password": user.password,
        "email": user.email,
        "location": user.location,
        "phone": user.phone,
        "userType": user.userType
    });
    regUser.save(function (err) {
        if (!err) {
            console.log("Document saved Successfully");
        }
        else {
            console.log(err.errors['description'].message);
        }
    });
});

app.post('/logInCheck',function (req,res) {
    console.log(req.body);

    var logObj = req.body;

    User.find(logObj,function (err,docs) {

        if(!err && docs.length>0){
            //console.log(docs[0].userType);
            var obj = {username:docs[0].username, userType: docs[0].userType};
            res.send(obj);
        }
        else{
           // console.log("error");
            res.send({flag:"Error"});
        }
    })
});

app.get('/setLog/:cuser',function (req,res) {
    //console.log(req.params.cuser);
    var checklog = new checkLoggedIn({
        "logged":req.params.cuser
    });

    checklog.save(function (err) {
        if (!err) {
            console.log("Document saved Successfully");
            res.send({flag:"success"});
        }
        else {
            console.log("Document set log not saved");
            console.log(err.errors['description'].message);
            res.send({flag:"error"});
        }
    });
});

app.get('/getLogged',function (req,res) {
    //console.log("inside get");
    //console.log(req.params.cname);
    // var cuserObj = {
    //     "logged":req.params.cname
    // };
    //console.log(cuserObj);

    checkLoggedIn.find({},function (err,docs) {
        console.log(docs);

        if(!err && docs.length>0){
            console.log("inside find");
            console.log(docs[0]);
            //var obj = {username:docs[0].username, userType: docs[0].userType};
            res.send({flag:"success"});
        }
        else{
            res.send({flag:"Error"});
        }
    });
});

app.get('/logOut/:cname',function (req,res) {
    console.log("inside get logout");
    console.log(req.params.cname);
    var cuserObj = {
        "logged":req.params.cname
    };
    console.log(cuserObj);
    checkLoggedIn.remove(cuserObj,function (err,docs) {
        console.log(docs);

        if(!err && docs.length>0){
            console.log("inside find");
            console.log(docs[0]);
            //var obj = {username:docs[0].username, userType: docs[0].userType};
            //res.send(obj);
        }
        else{
            res.send({flag:"Error"});
        }
    });
});



app.post('/postJob',function (req,res) {
    console.log(req.body);
    var job = req.body;
    var jobObj= new Job({
        "title":job.title,
        "description":job.description,
        "location":job.location
    });

    jobObj.save(function (err) {
        if (!err) {
            console.log("Document saved Successfully");
        }
        else {
            console.log(err.errors['description'].message);
        }
    });


});

app.get('/getJobs',function (req,res) {
    Job.find({},function (err,docs) {
        if(!err){
            console.log("Documents retrieved Successfully");
            res.send(docs);
        }
        else{
            console.log(err.errors['description'].message);
        }
    });
});

app.post('/search', function (req, res) {
    var searchObj = req.body;
    console.log(searchObj);
    Job.find(searchObj, function (err, docs) {
        if (!err && docs.length > 0) {
            console.log("inside find");
            console.log(docs);
            res.send(docs);

        }
        else {
            res.send({flag: "Error"});
        }
    });

});

app.listen(2000, function () {
    console.log("server running @localhost:2000");
});