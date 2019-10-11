/*
    require module
 */

var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var http = require('http')
var app = express();

var io = require('socket.io').listen(server);


const Message = mongoose.model('Message',{ name : String, message : String})

/*
    middle ware
 */
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap


app.get('/messages', (req, res) => {
    Message.find({}, (err,messages) => {
        res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if(err) sendStatus(500)
        io.emit('message', req.body)
        res.sendStatus(200);
    })
})

io.on('connection', () => {
    console.log('a user is connected')
})

//db name nodestudy
mongoose.connect("mongodb://localhost/nodestudy",  { useNewUrlParser: true });


var server = app.listen(3000, ()=> {
    console.log('server is running on port', server.address().port)
})