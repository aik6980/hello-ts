module State{
    export class Game_state extends Phaser.State{

        unit = 12;
        bmd_unit_white : Phaser.BitmapData;
        
        level : Array<string>;
        starty = 50;

        cursors : Phaser.CursorKeys;

        // groups
        player : Objects.Player;

        spawn_point : Array<number>; 
        walls : Phaser.Group;
        coins : Phaser.Group;
        enemies : Phaser.Group; 

        preload(){
            // create a bitmap data
            // http://phaser.io/examples/v2/bitmapdata/cached-bitmapdata
            this.bmd_unit_white = this.game.add.bitmapData(this.unit, this.unit);
            this.bmd_unit_white.context.fillStyle = 'rgb(255,255,255)';
            this.bmd_unit_white.context.fillRect(0,0,24,24);
            
            this.game.cache.addBitmapData('unit_white', this.bmd_unit_white);
        }

        create(){
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
            
            for(var i=0; i<this.level.length; ++i){
                for(var j=0; j<this.level[i].length; ++j){

                    var obj = null;
                    if(this.level[i][j] == 's'){
                        this.spawn_point = [5+this.unit*j, this.starty+this.unit*i];
                    }

                    if(this.level[i][j] == 'x'){
                        obj = new Objects.Wall(this.game, 5+this.unit*j, this.starty+this.unit*i);
                        this.walls.add(obj);
                        this.game.physics.enable(obj, Phaser.Physics.ARCADE);
                        obj.body.immovable = true;
                    }

                    if(this.level[i][j] == 'o'){
                        obj = new Objects.Coin(this.game, 5+this.unit*j, this.starty+this.unit*i);
                        this.coins.add(obj);
                        this.game.physics.enable(obj, Phaser.Physics.ARCADE);
                        //obj.body.immovable = true;
                    }

                    if(this.level[i][j] == '!'){
                        obj = new Objects.Enemy(this.game, 5+this.unit*j, this.starty+this.unit*i);
                        this.enemies.add(obj);
                        this.game.physics.enable(obj, Phaser.Physics.ARCADE);
                    }
                }
            }

            this.spawn_player();
        }

        update(){
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
        }

        spawn_player(){
            this.player.position.set(this.spawn_point[0], this.spawn_point[1]);
        }

        take_coin( player : Objects.Player, coin : Objects.Coin){
            coin.kill();
        }

        restart(){
            this.spawn_player();
        }
    }
}