var socket = io('/');
socket.emit('joinroom', room);
var players = [];
var finish = [];
var isRunning = 0;

// isRunning = 0, game ready to start
// isRunning = 1, prepare state
// isRunning = 2, race state
// isRunning = 3, end state

socket.on('message', function message(data) {
    console.log('Received message: ' + data);
});

socket.on('prepare', function prepareGame() {
    if (isRunning == 0) {
        cleanup();
        isRunning = 1;
        var finishLine = document.getElementById("finish");
        finishLine.style.visibility = 'visible';
        var text = document.getElementById("game-text");
        text.innerHTML = "Game is about to start. To join write !race join.";
    }
});

socket.on('join', function addPlayer(data) {
    if (isRunning == 1) {
        console.log('Player joined: ' + data.username);
        players.push(data.username);
        drawEmote(data);
        var text = document.getElementById("game-text");
        text.innerHTML = "Join the game by writing '!race join'. Currently " + players.length + " joined.";
    }
});

socket.on('start', function startGame() {
    if (isRunning == 1) {
        isRunning = 2;
        console.log('Game starting!');
        game();
    }
});

function drawEmote(obj) {
    var c = document.getElementById("race");
    var img = new Image;
    var li = document.createElement("li");
    li.id = obj.username;
    li.marginLeft = Math.floor((Math.random() * 15)) + "px";
    img.src = obj.emote;
    li.appendChild(img);
    c.appendChild(li);
}

function game() {
    checkFit();
    var text = document.getElementById("game-text");
    text.innerHTML = 'Go!';
    var li = document.getElementsByTagName("li");
    for (var i = 0; i < li.length; i++) {
        raceStart(li[i]);
    }
}

function raceStart(obj) {
    var name = obj.id;
    var width = screen.width - obj.getBoundingClientRect().width;
    var slice = width / 40;
    var j = 1;
    var speed = 0;
    obj.addEventListener("webkitTransitionEnd", next);
    function next() {
        if (++j >= 40) {
            obj.removeEventListener("webkitTransitionEnd", next);
            addToFinish(name);
        }
        start();
    }
    function start() {
        speed = (Math.random() * (2 - 1 + 1)) + 1;
        obj.style.webkitTransition = 'transform linear ' + speed + 's';
        obj.style.WebkitTransform = 'translate(' + slice * j + 'px, 0)';
    }
    start();
}

function cleanup() {
    text.innerHTML = '';
    var el = document.getElementById("race");
    var finishLine = document.getElementById("finish");
    finishLine.style.visibility = 'hidden';
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
    isRunning = 0;
    finish.length = 0;
    players.length = 0;
}

function addToFinish(name) {
    var text = document.getElementById("game-text");
    finish.push(name);
    text.innerHTML = 'Winner: ' + finish[0] + '!';
    if (finish.length == players.length) {
        text.innerHTML = 'Race finished! 1st ' + finish[0] + ', 2nd ' + finish[1] + ', 3rd ' + finish[2] + '!';
        socket.emit('results', {channel: room, results: JSON.stringify(finish)});
        isRunning = 3;
        setTimeout(cleanup(), 15000);
    }
}

function checkFit() {
    var mbot = -25;
    console.log(document.getElementById("race").offsetHeight);
    while (document.getElementById("race").offsetHeight > 200) {
        var li = document.getElementsByTagName("li");
        mbot--;
        for (var i = 0; i < li.length; i++) {
            li[i].style.marginBottom = mbot + 'px';
            if (document.getElementById("race").offsetHeight < 200) break;
        }
    }
}