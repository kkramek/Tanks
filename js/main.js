
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.image('p1', 'images/p1.png');
    game.load.image('p2', 'images/p2.png');
    game.load.image('logo', 'images/logo.png');
    game.load.image('bullet', 'images/bullet.png');
    game.load.image('searth', 'images/scorched_earth.png');
    game.load.image('sand', 'images/sand.png');
    game.load.image('lightsand', 'images/light_sand.png');
    game.load.image('grass', 'images/grass.png');
    game.load.image('house1', 'images/house1.png');
    game.load.image('house2', 'images/house2.png');
    game.load.image('house3', 'images/house3.png');
    game.load.image('house4', 'images/house4.png');
    game.load.image('forest', 'images/forest.png');
    game.load.image('forest2', 'images/forest2.png');
    game.load.image('water', 'images/water.png');
    game.load.spritesheet('smallkaboom', 'images/small_explosion.png', 64, 64, 8);
    game.load.spritesheet('kaboom', 'images/explosion.png', 64, 64, 23);

}

var land;

var p1;
var p2;

var explosions;

var logo;

var currentSpeedP1 = 0;
var currentSpeedP2 = 0;
var cursors;
var cursors2;

var bulletsP1;
var bulletsP2;
var nextFireP1 = 0;
var nextFireP2 = 0;
var fireRate = 500;

var bulletSpeed = 700;
var playerSpeedIncrement = 2;
var playerSpeedMax = 200;
var playerSpeedAngle = 2;

var weaponP1;

var live = 100;
var liveP1 = live;
var liveP2 = live;

var buildings;
var shelters;
var water;

var map;

function create () {

    game.world.setBounds(0, 0, 800, 600);

    map = Math.floor((Math.random() * 10)%2) + 1
    createMap(map);

    p1 = game.add.sprite(40, 35, 'p1');
    p1.anchor.setTo(0.5, 0.5);

    game.physics.enable(p1, Phaser.Physics.ARCADE);
    p1.body.drag.set(0.2);
    p1.body.maxVelocity.setTo(400, 400);
    p1.body.collideWorldBounds = true;
    p1.body.immovable = false;
    p1.body.bounce.setTo(1, 1);

    bulletsP1 = game.add.group();
    bulletsP1.enableBody = true;
    bulletsP1.physicsBodyType = Phaser.Physics.ARCADE;
    bulletsP1.createMultiple(30, 'bullet', 0, false);
    bulletsP1.setAll('anchor.x', 0.5);
    bulletsP1.setAll('anchor.y', 0.5);
    bulletsP1.setAll('outOfBoundsKill', true);
    bulletsP1.setAll('checkWorldBounds', true);

    p2 = game.add.sprite(760, 565, 'p2');
    p2.anchor.setTo(0.5, 0.5);
    p2.angle -= 180;

    game.physics.enable(p2, Phaser.Physics.ARCADE);
    p2.body.drag.set(0.2);
    p2.body.maxVelocity.setTo(400, 400);
    p2.body.collideWorldBounds = true;
    p2.body.immovable = false;
    p2.body.bounce.setTo(1, 1);

    bulletsP2 = game.add.group();
    bulletsP2.enableBody = true;
    bulletsP2.physicsBodyType = Phaser.Physics.ARCADE;
    bulletsP2.createMultiple(30, 'bullet', 0, false);
    bulletsP2.setAll('anchor.x', 0.5);
    bulletsP2.setAll('anchor.y', 0.5);
    bulletsP2.setAll('outOfBoundsKill', true);
    bulletsP2.setAll('checkWorldBounds', true);

    explosions = game.add.group();
    shotExplosions = game.add.group();

    for (var i = 0; i < 10; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');

        var shootExplosionAnimation = shotExplosions.create(0, 0, 'smallkaboom', [0], false);
        shootExplosionAnimation.anchor.setTo(0.5, 0.5);
        shootExplosionAnimation.animations.add('smallkaboom');
    }

    createBuildings(map);

    logo = game.add.sprite(0, 0, 'logo');
    game.input.onDown.add(removeLogo, this);

    cursors = game.input.keyboard.createCursorKeys();

    cursors2 = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D),
      fire1: game.input.keyboard.addKey(Phaser.Keyboard.P),
      fire2: game.input.keyboard.addKey(Phaser.Keyboard.C),
    };
}

function createMap(number) {

    switch (number) {
      case 1:
          land = game.add.tileSprite(0, 0, 800, 600, 'searth');
        break;

      case 2:
        land = game.add.tileSprite(0, 0, 800, 600, 'sand');
        water = game.add.physicsGroup();
        game.physics.enable(water, Phaser.Physics.ARCADE);
        water.create(250, 250, 'water');
        water.setAll('body.immovable', true);
        water.setAll('body.moves', false);
        break;
      default:

    }

}

function createBuildings(number) {

    switch (number) {
      case 1:
          buildings = game.add.physicsGroup();
          game.physics.enable(buildings, Phaser.Physics.ARCADE);
          buildings.create(80, 80, 'house1');
          buildings.create(630, 80, 'house2');
          buildings.create(80, 265, 'house3');
          buildings.create(450, 400, 'house4');
          buildings.setAll('body.immovable', true);
          buildings.setAll('body.moves', false);
        break;

      case 2:
        shelters = game.add.physicsGroup();
        shelters.create(0, 290, 'forest');
        shelters.create(290, 0, 'forest2');
        break;
      default:

    }

}

function update () {

    updateP1();
    updateP2();

    if(liveP1 <= 0 || liveP2 <=0) {
          logo.reset(0, 0);
          p1.reset(40, 35);
          p2.reset(760, 565);
    }
}

function removeLogo () {
    liveP1 = live;
    liveP2 = live;

    logo.kill();

}

function updateP1() {

    game.physics.arcade.overlap(bulletsP2, p1, bulletHitPlayerP1, null, this);
    game.physics.arcade.overlap(bulletsP2, buildings, bulletHitBuilding, null, this);
    game.physics.arcade.collide(p1, p2);
    game.physics.arcade.collide(p1, buildings);
    game.physics.arcade.collide(p1, water);

    if(liveP1 > 0) {

        if (cursors.left.isDown)
        {
            p1.angle -= playerSpeedAngle;
        }
        else if (cursors.right.isDown)
        {
            p1.angle += playerSpeedAngle;
        }

        if (cursors.up.isDown)
        {
            if(currentSpeedP1 <= playerSpeedMax) {
                currentSpeedP1 += playerSpeedIncrement;
            }

        } else {
            if (currentSpeedP1 > 0)
            {
                currentSpeedP1 -= playerSpeedIncrement;
            }
        }

        if (cursors.down.isDown)
        {
            if(currentSpeedP1 >= -playerSpeedMax) {
                currentSpeedP1 -= playerSpeedIncrement;
            }
        } else {
          if (currentSpeedP1 < 0)
          {
              currentSpeedP1 += playerSpeedIncrement;
          }
        }

        game.physics.arcade.velocityFromRotation(p1.rotation, currentSpeedP1, p1.body.velocity);


        if (cursors2.fire1.isDown)
        {
            fire('p1');
        }
    }
}

function updateP2() {
      game.physics.arcade.overlap(bulletsP1, p2, bulletHitPlayerP2, null, this);
      game.physics.arcade.overlap(bulletsP1, buildings, bulletHitBuilding, null, this);
      game.physics.arcade.collide(p2, p1);
      game.physics.arcade.collide(p2, buildings);
      game.physics.arcade.collide(p2, water);


      if(liveP2 > 0) {

          if (cursors2.left.isDown)
          {
              p2.angle -= playerSpeedAngle;
          }
          else if (cursors2.right.isDown)
          {
              p2.angle += playerSpeedAngle;
          }

          if (cursors2.up.isDown)
          {
            if(currentSpeedP2 <= playerSpeedMax) {
                currentSpeedP2 += playerSpeedIncrement;
            }
          } else {
            if (currentSpeedP2 > 0)
            {
                currentSpeedP2 -= playerSpeedIncrement;
            }
          }

          if (cursors2.down.isDown)
          {
              if(currentSpeedP2 >= -playerSpeedMax) {
                  currentSpeedP2 -= playerSpeedIncrement;
              }

          } else {
            if (currentSpeedP2 < 0)
            {
                currentSpeedP2 += playerSpeedIncrement;
            }
          }

          game.physics.arcade.velocityFromRotation(p2.rotation, currentSpeedP2, p2.body.velocity);

          if (cursors2.fire2.isDown)
          {
              fire();
          }

      }
}

function bulletHitPlayerP1 (tank, bullet) {

    bullet.kill();

    if(liveP1 > 0) {
      liveP1 -= 10;
    }

    if(liveP1 <= 0) {
      var destroyed = tank.damage();

      if (destroyed)
      {
          var explosionAnimation = explosions.getFirstExists(false);
          explosionAnimation.reset(tank.x, tank.y);
          explosionAnimation.play('kaboom', 30, false, true);
      }
    } else {
          var shooxplosionAnimation = shotExplosions.getFirstExists(false);
          shooxplosionAnimation.reset(tank.x, tank.y);
          shooxplosionAnimation.play('smallkaboom', 30, false, true);

    }
}

function bulletHitPlayerP2 (tank, bullet) {

    bullet.kill();

    if(liveP2 > 0) {
        liveP2 -= 10;
    }

    if(liveP2 <= 0) {
      var destroyed = tank.damage();

      if (destroyed)
      {
          var explosionAnimation = explosions.getFirstExists(false);
          explosionAnimation.reset(tank.x, tank.y);
          explosionAnimation.play('kaboom', 30, false, true);
      }
    } else {
          var shooxplosionAnimation = shotExplosions.getFirstExists(false);
          shooxplosionAnimation.reset(tank.x, tank.y);
          shooxplosionAnimation.play('smallkaboom', 30, false, true);

    }
}

function bulletHitBuilding(bullet) {
    bullet.kill();
}

function fire (player) {

    if(player == 'p1') {

      if (game.time.now > nextFireP1)
      {
          nextFireP1 = game.time.now + fireRate;
          var bullet = bulletsP1.getFirstExists(false);

          if (bullet)
          {
              bullet.reset(p1.x, p1.y);
              bullet.angle = p1.angle;
              game.physics.arcade.velocityFromRotation(bullet.rotation, bulletSpeed, bullet.body.velocity);
              bulletTime = game.time.now + 150;
          }
      }

    } else {

        if (game.time.now > nextFireP2)
        {
            nextFireP2 = game.time.now + fireRate;
            var bullet = bulletsP2.getFirstExists(false);

            if (bullet)
            {
                bullet.reset(p2.x, p2.y);
                bullet.angle = p2.angle;
                game.physics.arcade.velocityFromRotation(bullet.rotation, bulletSpeed, bullet.body.velocity);
                bulletTime = game.time.now + 150;
            }
        }

    }

}

function render () {

    game.debug.text('P1: ' + liveP1, 32, 32);
    game.debug.text('P2: ' + liveP2, 700, 32);

}
