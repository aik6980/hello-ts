module Objects{

    export class Player extends Phaser.Sprite{

        constructor(game : Phaser.Game, x: number, y: number){
            super(game, x, y, game.cache.getBitmapData('unit_white'));
        }

        update(){

        }
    }
}