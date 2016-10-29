module SimpleGame{

    export class Game extends Phaser.Game{

        constructor(){
            super(256,256, Phaser.AUTO, 'content', null);

            // add states
            this.state.add('game', new State.Game_state);
            this.state.start('game');
        }
    }
}

var ws: WebSocket;
window.onload = function(){
    //var game = new SimpleGame.Game();

    // connection info
    // https://github.com/sugendran/webrtc-tanks/blob/master/js/game.js
    var host = document.location.hostname;
    var port = document.location.port;
    var path = "/api";


    var peer = new Peer({
        host: host,
        //port: port,
        path: path
    });

    peer.on('open', function(id){
        var wss_url = 'ws://' + host + ':' + port + path + '/peerjs/' + id;
        console.log(wss_url);
        console.log(id);
        ws = new WebSocket(wss_url);

        // websocket
        ws.onopen = function(){
            console.log('ws connection');
        }

        ws.onclose = function(){
            console.log('ws disconnection');
        }

        ws.onmessage = function(evt){
            var data = JSON.parse(evt.data);
            console.log(data);
        }
    });
}

window.create_game = function(){
    console.log("create_game");
    ws.send("client msg");
}