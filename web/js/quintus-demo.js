document.onkeydown = function(event) {
//            console.log(event.keyCode);
};

function setPlayerLocation(obj) {
    Q("Player").items[0].p = obj;
}

function getPlayerLocation() {
    var loc = Q("Player").items[0].p;

    return loc;
}

function doAPugBomb() {
    stage = Q.stage(0);
    for(i=300;i<1700;i++)
    {
        if(i % 10 == 0) {
            stage.insert(new Q.FakePug({x: i, y: 0}));
        }
    }
}

var reversed = false;

var gamepad = new Gamepad();
gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
    // a new gamepad connected
});

gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
    // gamepad disconnected
});

gamepad.bind(Gamepad.Event.UNSUPPORTED, function(device) {
    // an unsupported gamepad connected (add new mapping)
});

gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
    if (e.control == "START_FORWARD") {
        Q.clearStages();
        Q.stageScene('level1');
    }

    if (e.control == "LEFT_TOP_SHOULDER") {
        doAPugBomb();
    }
    // e.control of gamepad e.gamepad pressed down
    if (e.control.substring(0, 4) == "FACE") {
        Q.inputs['up'] = true;
    }
});

gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
    if (e.control.substring(0, 4) == "FACE") {
        Q.inputs['up'] = false;
    }
});

gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
    /////////////////////////////
    /// left

    if( ! reversed) {

        if (e.axis == "LEFT_STICK_X" && e.value == -1) {
            Q.inputs['left'] = true;
        }

        if (e.axis =="LEFT_STICK_X" && e.value == 0) {
            Q.inputs['left'] = false;
        }
        /////////////////////////////
        // right
        if (e.axis == "LEFT_STICK_X" && e.value == 1) {
            Q.inputs['right'] = true;
        }

        if (e.axis =="LEFT_STICK_X" && e.value == 0) {
            Q.inputs['right'] = false;
        }
    }
    else
    {
        if (e.axis == "LEFT_STICK_X" && e.value == -1) {
            Q.inputs['right'] = true;
        }

        if (e.axis =="LEFT_STICK_X" && e.value == 0) {
            Q.inputs['right'] = false;
        }
        /////////////////////////////
        // right
        if (e.axis == "LEFT_STICK_X" && e.value == 1) {
            Q.inputs['left'] = true;
        }

        if (e.axis =="LEFT_STICK_X" && e.value == 0) {
            Q.inputs['left'] = false;
        }
    }
});

gamepad.bind(Gamepad.Event.TICK, function(gamepads) {
    //console.log('tick');
    // gamepads were updated (around 60 times a second)
});

if (!gamepad.init()) {
    alert('your browser are teh suck');
    // Your browser does not support gamepads, get the latest Google Chrome or Firefox
}


var Q = Quintus({ audioSupported: [ 'mp3' ] })
    .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
    .setup({ maximize: true })
    .controls()
    .touch()
    .enableSound();

Q.Sprite.extend("Player",{
    init: function(p) {
        this._super(p, {
            sheet: "player",
            sprite: "player",
            x: 20,
            y: 460,
            score: 0,
            health: 100,
            type: Q.SPRITE_PLAYER,
            collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_COLLECTABLE | Q.SPRITE_ENEMY
        });
        this.add('2d, platformerControls, animation, tween');

        this.on("hit.sprite",function(collision) {
            if(collision.obj.isA("Tower")) {
                Q.audio.play('success.mp3');
                Q.stageScene("endGame",1, { label: "You Won!" });
                this.destroy();
            }
        });

        this.on("enemy.hit","enemyHit");
        this.on("watermelon.hit", "watermelonHit");
        this.on("evilmelon.hit", "evilmelonHit");
    },

    step: function(dt) {
        if (this.p.immune) {
            // Swing the sprite opacity between 50 and 100% percent when immune.
            if ((this.p.immuneTimer % 12) == 0) {
                var opacity = (this.p.immuneOpacity == 1 ? 0 : 1);
                this.animate({"opacity":opacity}, 0);
                this.p.immuneOpacity = opacity;
            }
            this.p.immuneTimer++;
            if (this.p.immuneTimer > 144) {
                // 3 seconds expired, remove immunity.
                this.p.immune = false;
                this.animate({"opacity": 1}, 1);
            }
        }
        if(this.p.vx > 0) {
            this.play("walk_right");
        } else if(this.p.vx < 0) {
            this.play("walk_left");
        } else {
            Q.audio.stop('run.mp3');
            this.play("stand_" + this.p.direction);
        }

        if(this.p.y > 500 ) {
            Q.audio.play('whimper-long.mp3');
            this.resetLevel();
        }
    },

    resetLevel: function() {
        Q.stageScene("level1");
            this.p.health = 100;
            this.p.score = 0;
            this.animate({opacity: 1});
            Q.stageScene('hud', 3, this.p);
    },

    enemyHit: function(data) {
        var col = data.col;
        var damage = data.damage;
        this.p.vy = -150;
        if (col.normalX == 1) {
          // Hit from left.
            this.p.x -=15;
            this.p.y -=15;
        }
        else {
          // Hit from right;
            this.p.x +=15;
            this.p.y -=15;
        }
        this.p.immune = true;
        this.p.immuneTimer = 0;
        this.p.immuneOpacity = 1;
        this.p.health -= damage;
        Q.audio.play('whimper-long.mp3');
        Q.stageScene('hud', 3, this.p);
        if (this.p.health <= 0) {
            this.resetLevel();
        }
    },

    watermelonHit: function (data) {
        this.p.score += data.value;
        Q.audio.play('happy-melone.mp3');
        Q.stageScene('hud', 3, this.p);
    },

    evilmelonHit: function (data) {
        this.p.score -= data.value;
        Q.audio.play('whimper-short.mp3');
        Q.stageScene('hud', 3,  this.p);
    }


});

Q.Sprite.extend("Tower", {
    init: function(p) {
        this._super(p, { sheet: 'tower' });
    }
});

Q.Sprite.extend("Enemy",{
    init: function(p) {
        this._super(p, {
            sheet: 'enemy',
            vx: 100,
            damage: 25,
            type: Q.SPRITE_ENEMY,
            collisionMask: Q.SPRITE_DEFAULT
        });
        this.add('2d, aiBounce');

        this.on("bump.top",this, "die");
        this.on("hit.sprite",this,"hit");
    },

    hit: function(col) {
        if(col.obj.isA("Player") && !col.obj.p.immune && !this.p.dead) {
            col.obj.trigger('enemy.hit', {"damage":this.p.damage,"col":col});
        }
    },

    die: function (col) {
        if(col.obj.isA("Player")) {
            Q.audio.play('happy-melone.mp3');
            this.p.vx=this.p.vy=0;
            this.p.dead = true;
            col.obj.p.vy = -300;
            this.p.deadTimer = 0;
        }
    },

    step: function (dt) {
        if(this.p.dead) {
            this.del('2d, aiBounce');
            this.p.deadTimer++;
            if (this.p.deadTimer > 24) {
            // Dead for 24 frames, remove it.
                this.destroy();
            }
        }
    }
});

Q.Sprite.extend("Watermelon", {
    init: function(p) {
        this._super(p,{
            sheet: 'watermelon',
            type: Q.SPRITE_COLLECTABLE,
            collisionMask: Q.SPRITE_PLAYER,
            sensor: true,
            vx: 0,
            vy: 0,
            gravity: 0,
            value: 1
        });
        this.add("animation");
        this.on("sensor");
    },

    //  When a Collectable is hit.
    sensor: function(colObj) {
        console.log('Collision');
        // Increment the score.
        colObj.p.score += this.p.value;
        Q.stageScene('hud', 3, colObj.p);
        Q.audio.play('happy-melone.mp3');
        this.destroy();
    }
});

Q.Sprite.extend("Evilmelon",{
    init: function(p) {
        this._super(p, {
            sheet: 'evilmelon',
            vx: 100,
            value: 1,
            type: Q.SPRITE_ENEMY,
            collisionMask: Q.SPRITE_DEFAULT
        });
        this.add('2d, aiBounce');

        this.on("hit.sprite", this, "hit")
    },

    hit: function (col) {
        if(col.obj.isA("Player")) {
            this.destroy();
            col.obj.trigger('evilmelon.hit', {"value":this.p.value});
        }
    }
});

Q.Sprite.extend("FakePug", {
    init: function (p) {
        this._super(p, {
            sheet: "player",
            sprite: "player",
            vx: 100,
            type: Q.SPRITE_PLAYER,
            collisionMask: Q.SPRITE_DEFAULT,
            jumpTimer: 0
        });

        this.add('2d, aiBounce, animation')

    },

    step: function (dt) {
         if(this.p.vx > 0) {
            this.play("walk_right");
        } else if(this.p.vx < 0) {
            this.play("walk_left");
        } else {
            this.play("stand_" + this.p.direction);
        }

        this.p.jumpTimer++;
        if (this.p.jumpTimer > 96) {
            var action = randomIntFromInterval(1, 100);
            if (action % 2 == 0) {
                // 3 seconds expired, remove immunity.
                this.p.jumpTimer = 0;
                //this.p.y -= 52;
                this.p.vy = -20;
                this.p.vy += dt * 9.8;
                this.p.y += this.p.vy * dt;
            } else {
                this.p.direction = 'left';
            }
        }

    }
});

Q.scene("level1",function(stage) {
    stage.insert(new Q.Repeater({ asset: "background-wall.jpg", speedX: 0.1, speedY: 0.1 }));
    stage.collisionLayer(new Q.TileLayer({ dataAsset: 'level.json', sheet: 'watermelone-tiles' }));
    var player = stage.insert(new Q.Player());

    stage.add("viewport").follow(player);

    stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    stage.insert(new Q.Evilmelon({ x: 900, y: 0 }));
    stage.insert(new Q.Evilmelon({ x: 300, y: 0 }));
    stage.insert(new Q.Watermelon({ x: 100, y: 460 }));
    stage.insert(new Q.Watermelon({ x: 400, y: 0 }));

    stage.insert(new Q.Tower({ x: 180, y: 50 }));

    channel.bind('fuck-shit-up', function(data) {
        switch (data.sentiment) {
            case "pos":
                stage.insert(new Q.Watermelon({ x: randomIntFromInterval(100, 900), y: randomIntFromInterval(100, 900) }));
                break;
            case "neg":
                stage.insert(new Q.Enemy({x: randomIntFromInterval(100, 900), y: 0}));
                break;
            case "neu":
                break;
        }
    });

    channel.bind('pug-bomb', function (data) {
        doAPugBomb();
    })
});

Q.scene('hud',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: 50, y: 0
  }));

  var label = container.insert(new Q.UI.Text({x:200, y: 20,
    label: "Score: " + stage.options.score, color: "white" }));

  var strength = container.insert(new Q.UI.Text({x:50, y: 20,
    label: "Health: " + stage.options.health + '%', color: "white" }));

  container.fit(20);
});

Q.scene('endGame',function(stage) {
    var box = stage.insert(new Q.UI.Container({
        x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
    }));

    var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
        label: "Play Again" }))
    var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h,
        label: stage.options.label }));
    button.on("click",function() {
        Q.clearStages();
        Q.stageScene('level1');
    });
    box.fit(20);
});

Q.load("player.png, player.json, sprites.png, sprites.json, level.json, tiles.png, watermelon.png, watermelon.json, watermelone-tiles.png, happy-melone.mp3, mob-death.mp3, run.mp3, success.mp3, whimper-short.mp3, whimper-long.mp3, background-wall.jpg", function() {
    Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });
    Q.sheet("watermelone-tiles","watermelone-tiles.png", { tilew: 32, tileh: 32 });
    Q.compileSheets("sprites.png","sprites.json");
    Q.compileSheets("player.png", "player.json");
    Q.animations("player", {
        walk_right: { frames: [0,1,2], flip: false, rate:1/3, loop: true },
        walk_left: { frames:  [0,1,2], flip:"x", rate:1/3, loop: true },
        stand_right: { frames:[3,4,5], flip: false, rate:1/3, loop:true },
        stand_left: { frames: [3,4,5], flip:"x", rate:1/3, loop:true }
    });
    Q.compileSheets("watermelon.png", "watermelon.json");
    Q.stageScene("level1");
    Q.stageScene('hud', 3, Q('Player').first().p);
});

/*
 pusher stuff

 */
Pusher.log = function(message) {
    if (window.console && window.console.log) {
        window.console.log(message);
    }
};

var pusher = new Pusher('b6ac1ee705e196be3e27', {
    cluster: 'eu',
    encrypted: true
});

var channel = pusher.subscribe('test_channel');
var switched = false;

channel.bind('fuck-shit-up', function(data) {
    // console.log(data.message);
    // console.log(data.sentiment);
    // console.log(Q.stage);
});


channel.bind('reverse-it', function(data) {
    reversed = !reversed;
    console.log('reversed: ' + reversed);
});

var position;
var positionCaptured = false;

channel.bind('handle-position', function(data) {
    if( ! positionCaptured) {
        position = getPlayerLocation();
        console.log('Capturing Player Position');
        console.log(position);
    }
    else
    {
        console.log('Restoring Player Position');
        setPlayerLocation(position);
    }
    positionCaptured = !positionCaptured;
});

channel.bind('my_event', function(data) {
    if(data.switch == 'true') {
        if( ! switched) {
            Q.input.keyboardControls({
                RIGHT: "left",
                LEFT: "right",
                UP: "down",
                DOWN: "up"
            });
            switched = true;
        }
        else
        {
            Q.input.keyboardControls({
                RIGHT: "right",
                LEFT: "left",
                UP: "up",
                DOWN: "down"
            });
            switched = false;
        }
    }
});

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}