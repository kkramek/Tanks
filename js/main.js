
var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game');

var PhaserGame = function (game) {

    this.map = null;
    this.layer = null;
    this.player = null;

    this.gridsize = 32;

    this.speed = 150;
    this.threshold = 3;
    this.turnSpeed = 150;

    this.marker = new Phaser.Point();
    this.turnPoint = new Phaser.Point();

    this.directions = [ null, null, null, null, null ];
    this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];

    this.current = Phaser.RIGHT;
    this.turning = Phaser.NONE;

};

PhaserGame.prototype = {

    init: function () {

        this.physics.startSystem(Phaser.Physics.ARCADE);

    },

    preload: function () {

        this.load.image('map', 'images/grass.png');
        this.load.image('player', 'images/tank.png');

    },

    create: function () {

        this.map = this.add.image('map');

        this.player = this.add.sprite(46, 46, 'player');
        this.player.anchor.set(0.5);

        this.physics.arcade.enable(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();

    },

    checkKeys: function () {

        if (this.cursors.left.isDown && this.current !== Phaser.LEFT)
        {
            this.checkDirection(Phaser.LEFT);
        }
        else if (this.cursors.right.isDown && this.current !== Phaser.RIGHT)
        {
            this.checkDirection(Phaser.RIGHT);
        }
        else if (this.cursors.up.isDown && this.current !== Phaser.UP)
        {
            this.checkDirection(Phaser.UP);
        }
        else if (this.cursors.down.isDown && this.current !== Phaser.DOWN)
        {
            this.checkDirection(Phaser.DOWN);
        }
        else
        {
            this.turning = Phaser.NONE;
        }

    },

    checkDirection: function (turnTo) {

        if (this.current === this.opposites[turnTo])
        {
            this.move(turnTo);
        }
        else
        {
            this.turning = turnTo;

            this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
            this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
        }

    },

    turn: function () {

        var cx = Math.floor(this.player.x);
        var cy = Math.floor(this.player.y);

        if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold))
        {
            return false;
        }

        this.player.x = this.turnPoint.x;
        this.player.y = this.turnPoint.y;

        this.player.body.reset(this.turnPoint.x, this.turnPoint.y);

        this.move(this.turning);

        this.turning = Phaser.NONE;

        return true;

    },

    move: function (direction) {

        var speed = this.speed;

        if (direction === Phaser.LEFT || direction === Phaser.UP)
        {
            speed = -speed;
        }

        if (direction === Phaser.LEFT || direction === Phaser.RIGHT)
        {
            this.player.body.velocity.x = speed;
        }
        else
        {
            this.player.body.velocity.y = speed;
        }

        this.add.tween(this.player).to( { angle: this.getAngle(direction) }, this.turnSpeed, "Linear", true);

        this.current = direction;

    },

    getAngle: function (to) {

        if (this.current === this.opposites[to])
        {
            return "180";
        }

        if ((this.current === Phaser.UP && to === Phaser.LEFT) ||
            (this.current === Phaser.DOWN && to === Phaser.RIGHT) ||
            (this.current === Phaser.LEFT && to === Phaser.DOWN) ||
            (this.current === Phaser.RIGHT && to === Phaser.UP))
        {
            return "-90";
        }

        return "90";

    },

    update: function () {

        this.marker.x = this.math.snapToFloor(Math.floor(this.player.x), this.gridsize) / this.gridsize;
        this.marker.y = this.math.snapToFloor(Math.floor(this.player.y), this.gridsize) / this.gridsize;

        this.checkKeys();

        if (this.turning !== Phaser.NONE)
        {
            this.turn();
        }

    },

    render: function () {

    }

};

game.state.add('Game', PhaserGame, true);


