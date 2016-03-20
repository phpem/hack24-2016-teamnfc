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
    console.log('button down');
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
    /////////////////////////////
    // up
    /*
    if (e.axis == "LEFT_STICK_Y" && e.value == -1) {
        Q.inputs['up'] = true;
    }

    if (e.axis =="LEFT_STICK_Y" && e.value == 0) {
        Q.inputs['up'] = false;
    }


    /////////////////////////////
    // down
    if (e.axis == "LEFT_STICK_Y" && e.value == 1) {
        Q.inputs['down'] = true;
    }

    if (e.axis =="LEFT_STICK_Y" && e.value == 0) {
        Q.inputs['down'] = false;
    }
    */



    // e.axis changed to value e.value for gamepad e.gamepad
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
            health: 100
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
            damage: 25
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

Q.Sprite.extend("Watermelon",{
    init: function(p) {
        this._super(p, {
            sheet: 'watermelon',
            value: 1
        });

        this.on("hit.sprite", this, "hit")
    },

    hit:function (col) {
        if(col.obj.isA("Player")) {
            this.destroy();
            col.obj.trigger('watermelon.hit', {"value":this.p.value});
        }
    }
});

Q.Sprite.extend("Evilmelon",{
    init: function(p) {
        this._super(p, {
            sheet: 'evilmelon',
            vx: 100,
            value: 1
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

Q.scene("level1",function(stage) {
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
    Q.audio.play('run.mp3', {loop:true});

    channel.bind('fuck-shit-up', function(data) {
        console.log(data.sentiment);
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
});

Q.scene('hud',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: 50, y: 0
  }));

  var label = container.insert(new Q.UI.Text({x:200, y: 20,
    label: "Score: " + stage.options.score, color: "black" }));

  var strength = container.insert(new Q.UI.Text({x:50, y: 20,
    label: "Health: " + stage.options.health + '%', color: "black" }));

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

Q.load("player.png, player.json, sprites.png, sprites.json, level.json, tiles.png, watermelon.png, watermelon.json, watermelone-tiles.png, happy-melone.mp3, mob-death.mp3, run.mp3, success.mp3, whimper-short.mp3, whimper-long.mp3", function() {
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

var position = {};
var positionCaptured = false;

channel.bind('handle-position', function(data) {
    if( ! positionCaptured) {
        position = getPlayerLocation();
    }
    else
    {
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