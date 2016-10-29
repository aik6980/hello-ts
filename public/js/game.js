var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SimpleGame;
(function (SimpleGame) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 256, 256, Phaser.AUTO, 'content', null);
            // add states
            this.state.add('game', new State.Game_state);
            this.state.start('game');
        }
        return Game;
    }(Phaser.Game));
    SimpleGame.Game = Game;
})(SimpleGame || (SimpleGame = {}));
var ws;
window.onload = function () {
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
    peer.on('open', function (id) {
        var wss_url = 'ws://' + host + ':' + port + path + '/peerjs/' + id;
        console.log(wss_url);
        console.log(id);
        ws = new WebSocket(wss_url);
        // websocket
        ws.onopen = function () {
            console.log('ws connection');
        };
        ws.onclose = function () {
            console.log('ws disconnection');
        };
        ws.onmessage = function (evt) {
            var data = JSON.parse(evt.data);
            console.log(data);
        };
    });
};
window.create_game = function () {
    console.log("create_game");
    ws.send("client msg");
};
var Objects;
(function (Objects) {
    var Coin = (function (_super) {
        __extends(Coin, _super);
        function Coin(game, x, y) {
            _super.call(this, game, x, y, game.cache.getBitmapData('unit_white'));
            this.tint = Phaser.Color.getColor(215, 215, 0);
        }
        Coin.prototype.update = function () {
        };
        return Coin;
    }(Phaser.Sprite));
    Objects.Coin = Coin;
})(Objects || (Objects = {}));
var Objects;
(function (Objects) {
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(game, x, y) {
            _super.call(this, game, x, y, game.cache.getBitmapData('unit_white'));
            this.tint = Phaser.Color.getColor(215, 0, 0);
        }
        Enemy.prototype.update = function () {
        };
        return Enemy;
    }(Phaser.Sprite));
    Objects.Enemy = Enemy;
})(Objects || (Objects = {}));
var Objects;
(function (Objects) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            _super.call(this, game, x, y, game.cache.getBitmapData('unit_white'));
        }
        Player.prototype.update = function () {
        };
        return Player;
    }(Phaser.Sprite));
    Objects.Player = Player;
})(Objects || (Objects = {}));
var Objects;
(function (Objects) {
    var Wall = (function (_super) {
        __extends(Wall, _super);
        function Wall(game, x, y) {
            _super.call(this, game, x, y, game.cache.getBitmapData('unit_white'));
            this.tint = Phaser.Color.getColor(0, 0, 64);
        }
        Wall.prototype.update = function () {
        };
        return Wall;
    }(Phaser.Sprite));
    Objects.Wall = Wall;
})(Objects || (Objects = {}));
var State;
(function (State) {
    var Game_state = (function (_super) {
        __extends(Game_state, _super);
        function Game_state() {
            _super.apply(this, arguments);
            this.unit = 12;
            this.starty = 50;
        }
        Game_state.prototype.preload = function () {
            // create a bitmap data
            // http://phaser.io/examples/v2/bitmapdata/cached-bitmapdata
            this.bmd_unit_white = this.game.add.bitmapData(this.unit, this.unit);
            this.bmd_unit_white.context.fillStyle = 'rgb(255,255,255)';
            this.bmd_unit_white.context.fillRect(0, 0, 24, 24);
            this.game.cache.addBitmapData('unit_white', this.bmd_unit_white);
        };
        Game_state.prototype.create = function () {
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.world.enableBody = true;
            this.game.stage.backgroundColor = '#3598db';
            this.level = [
                'xxxxxxxxxxxxxxxxxxxx',
                'x        !         x',
                'x                  x',
                'x s      o      o  x',
                'x                  x',
                '!    o ! x         x',
                'xxxxxxxxxx!!!xxx!xxx',
            ];
            // create level
            this.walls = this.game.add.group();
            this.coins = this.game.add.group();
            this.enemies = this.game.add.group();
            // create player
            obj = new Objects.Player(this.game, -this.unit, -this.unit);
            this.game.add.existing(obj);
            this.game.physics.enable(obj, Phaser.Physics.ARCADE);
            obj.body.gravity.y = 300;
            this.player = obj;
            for (var i = 0; i < this.level.length; ++i) {
                for (var j = 0; j < this.level[i].length; ++j) {
                    var obj = null;
                    if (this.level[i][j] == 's') {
                        this.spawn_point = [5 + this.unit * j, this.starty + this.unit * i];
                    }
                    if (this.level[i][j] == 'x') {
                        obj = new Objects.Wall(this.game, 5 + this.unit * j, this.starty + this.unit * i);
                        this.walls.add(obj);
                        this.game.physics.enable(obj, Phaser.Physics.ARCADE);
                        obj.body.immovable = true;
                    }
                    if (this.level[i][j] == 'o') {
                        obj = new Objects.Coin(this.game, 5 + this.unit * j, this.starty + this.unit * i);
                        this.coins.add(obj);
                        this.game.physics.enable(obj, Phaser.Physics.ARCADE);
                    }
                    if (this.level[i][j] == '!') {
                        obj = new Objects.Enemy(this.game, 5 + this.unit * j, this.starty + this.unit * i);
                        this.enemies.add(obj);
                        this.game.physics.enable(obj, Phaser.Physics.ARCADE);
                    }
                }
            }
            this.spawn_player();
        };
        Game_state.prototype.update = function () {
            this.game.physics.arcade.collide(this.player, this.walls);
            this.game.physics.arcade.overlap(this.player, this.coins, this.take_coin, null, this);
            this.game.physics.arcade.overlap(this.player, this.enemies, this.restart, null, this);
            // handle input
            if (this.cursors.left.isDown)
                this.player.body.velocity.x = -100;
            else if (this.cursors.right.isDown)
                this.player.body.velocity.x = 100;
            else
                this.player.body.velocity.x = 0;
            // Make the player jump if he is touching the ground
            // this.player.body.touching => this flag is reset every frames
            if (this.cursors.up.isDown && this.player.body.touching.down)
                this.player.body.velocity.y = -125;
        };
        Game_state.prototype.spawn_player = function () {
            this.player.position.set(this.spawn_point[0], this.spawn_point[1]);
        };
        Game_state.prototype.take_coin = function (player, coin) {
            coin.kill();
        };
        Game_state.prototype.restart = function () {
            this.spawn_player();
        };
        return Game_state;
    }(Phaser.State));
    State.Game_state = Game_state;
})(State || (State = {}));
//# sourceMappingURL=game.js.map