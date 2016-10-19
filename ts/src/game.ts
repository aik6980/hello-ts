class SimpleGame
{
    game : Phaser.Game;

    constructor()
    {
        this.game = new Phaser.Game( 256, 256, Phaser.AUTO, 'phaser_id')
    }
}