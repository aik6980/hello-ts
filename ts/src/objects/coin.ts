module Objects{

    export class Coin extends Phaser.Sprite{

        constructor(game : Phaser.Game, x: number, y: number){
            super(game, x, y, game.cache.getBitmapData('unit_white'));

            this.tint = Phaser.Color.getColor(215,215,0);
        }

        update(){
            
        }
    }
}