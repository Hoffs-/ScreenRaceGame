/**
 * Created by Hoffs-Laptop on 2016-10-15.
 */

var express = require('express');
var router = express.Router();
var emoteobj;


var io = require('../io');
io.on('connection', function(socket) {
    socket.on('joinroom', function join(room) {
        console.log('Joined room: ' + room);
        socket.join('' + room + '');
        //io.to('' + room + '').emit('message', 'Hello ' + room);
    });
    socket.on('prepare', function sendPrepare(data) {
        console.log('Got data: ' + data);
        var json = JSON.parse(data);
        var room = json.channel;
        io.to('' + room + '').emit('prepare');
    });
    socket.on('join', function sendJoin(data) {
        var data = JSON.parse(data);
        var room = data.channel;
        var user = data.user;
        getIcon(user, function sendEmote(data) {
            io.to('' + room + '').emit('join', data);
        });
    });
    socket.on('start', function sendStart(data) {
        var data = JSON.parse(data);
        var room = data.channel;
        io.to('' + room + '').emit('start');
    });
    socket.on('results', function relayResults(data) {
        var inf = JSON.stringify(data);
        socket.broadcast.emit('results', inf);
    });
});

router.get('/:user', function(req, res) {
    console.log('Request URL:', req.originalUrl);
    res.render('game', { title: req.params.user });
});


function getJson(url, callback) {
    var https = require('https');
    https.get(url, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var response = JSON.parse(body);
            callback(response);
        });
    });
}

function getIcon(us, cb) {
    var curruser = us;
    if (typeof emoteobj === "undefined") {
        getJson("https://twitchemotes.com/api_cache/v2/global.json", function (resp) {
            emoteobj = resp;
            var size = Object.keys(resp.emotes).length;
            var rNum = Math.floor((Math.random() * size));
            var url = "https://static-cdn.jtvnw.net/emoticons/v1/"+ resp.emotes[Object.keys(resp.emotes)[rNum]].image_id +"/1.0";
            cb({username: curruser, emote: url});
        });
    } else {
        var size = Object.keys(emoteobj.emotes).length;
        var rNum = Math.floor((Math.random() * size));
        var url = "https://static-cdn.jtvnw.net/emoticons/v1/"+ emoteobj.emotes[Object.keys(emoteobj.emotes)[rNum]].image_id +"/1.0";
        cb({username: curruser, emote: url});
    }
}

module.exports = router;
