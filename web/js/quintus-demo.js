document.onkeydown = function(event) {
//            console.log(event.keyCode);
};

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
});

gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
    console.log('button up');
});

gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
    /////////////////////////////
    /// left
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

    /////////////////////////////
    // up
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


var Q = Quintus()
    .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
    .setup({ maximize: true })
    .controls().touch()

Q.Sprite.extend("Player",{
    init: function(p) {
        this._super(p, { sheet: "player", sprite: "player", x: 410, y: 90 });
        this.add('2d, platformerControls, animation, tween');

        this.on("hit.sprite",function(collision) {
            if(collision.obj.isA("Tower")) {
                Q.stageScene("endGame",1, { label: "You Won!" });
                this.destroy();
            } else if(collision.obj.isA("Watermelon")) {
                collision.obj.destroy();
                console.log("POINT FOR YOU");
            }
        });
    },

    step: function(dt) {
        if(this.p.vx > 0) {
            this.play("walk_right");
        } else if(this.p.vx < 0) {
            this.play("walk_left");
        } else {
            this.play("stand_" + this.p.direction);
        }
    }
});

Q.Sprite.extend("Tower", {
    init: function(p) {
        this._super(p, { sheet: 'tower' });
    }
});

Q.Sprite.extend("Enemy",{
    init: function(p) {
        this._super(p, { sheet: 'enemy', vx: 100 });
        this.add('2d, aiBounce');

        this.on("bump.left,bump.right,bump.bottom",function(collision) {
            if(collision.obj.isA("Player")) {
                Q.stageScene("endGame",1, { label: "You Died" });
                collision.obj.destroy();
            }
        });

        this.on("bump.top",function(collision) {
            if(collision.obj.isA("Player")) {
                this.destroy();
                collision.obj.p.vy = -300;
            }
        });
    }
});

Q.Sprite.extend("Watermelon",{
    init: function(p) {
        this._super(p, { sheet: 'watermelon' });
    }
});

Q.Sprite.extend("Evilmelon",{
    init: function(p) {
        this._super(p, { sheet: 'evilmelon', vx: 100 });
        this.add('2d, aiBounce');

        this.on("bump.left,bump.right,bump.bottom,bump.top",function(collision) {
            if(collision.obj.isA("Player")) {
                console.log("LOSE POINTS!!");
                this.destroy();
            }
        });
    }
});

Q.scene("level1",function(stage) {
    stage.collisionLayer(new Q.TileLayer({ dataAsset: 'level.json', sheet: 'tiles' }));
    var player = stage.insert(new Q.Player());

    stage.add("viewport").follow(player);

    stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    stage.insert(new Q.Evilmelon({ x: 900, y: 0 }));
    stage.insert(new Q.Evilmelon({ x: 300, y: 0 }));
    stage.insert(new Q.Watermelon({ x: 500, y: 0 }));
    stage.insert(new Q.Watermelon({ x: 400, y: 0 }));

    stage.insert(new Q.Tower({ x: 180, y: 50 }));
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

Q.load("player.png, player.json, sprites.png, sprites.json, level.json, tiles.png, watermelon.png, watermelon.json", function() {
    Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });
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
    console.log(data.message);
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