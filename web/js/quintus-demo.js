document.onkeydown = function(event) {
//            console.log(event.keyCode);
};

var haveEvents = 'ongamepadconnected' in window;
var controllers = {};

function connecthandler(e) {
    addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
    controllers[gamepad.index] = gamepad;

    var d = document.createElement("div");
    d.setAttribute("id", "controller" + gamepad.index);

    var t = document.createElement("h1");
    t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
    d.appendChild(t);

    var b = document.createElement("div");
    b.className = "buttons";
    for (var i = 0; i < gamepad.buttons.length; i++) {
        var e = document.createElement("span");
        e.className = "button";
        //e.id = "b" + i;
        e.innerHTML = i;
        b.appendChild(e);
    }

    d.appendChild(b);

    var a = document.createElement("div");
    a.className = "axes";

    for (var i = 0; i < gamepad.axes.length; i++) {
        var p = document.createElement("progress");
        p.className = "axis";
        //p.id = "a" + i;
        p.setAttribute("max", "2");
        p.setAttribute("value", "1");
        p.innerHTML = i;
        a.appendChild(p);
    }

    d.appendChild(a);

    // See https://github.com/luser/gamepadtest/blob/master/index.html
    var start = document.getElementById("start");
    if (start) {
        start.style.display = "none";
    }

    document.body.appendChild(d);
    requestAnimationFrame(updateStatus);
}

function disconnecthandler(e) {
    removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
    var d = document.getElementById("controller" + gamepad.index);
    document.body.removeChild(d);
    delete controllers[gamepad.index];
}

function updateStatus() {
    if (!haveEvents) {
        scangamepads();
    }

    var i = 0;
    var j;

    for (j in controllers) {
        var controller = controllers[j];
        var d = document.getElementById("controller" + j);
        var buttons = d.getElementsByClassName("button");

        for (i = 0; i < controller.buttons.length; i++) {
            var b = buttons[i];
            var val = controller.buttons[i];
            var pressed = val == 1.0;
            if (typeof(val) == "object") {
                pressed = val.pressed;
                val = val.value;
            }

            var pct = Math.round(val * 100) + "%";
            b.style.backgroundSize = pct + " " + pct;

            if (pressed) {
                b.className = "button pressed";
            } else {
                b.className = "button";
            }
        }

        var axes = d.getElementsByClassName("axis");
        for (i = 0; i < controller.axes.length; i++) {
            var a = axes[i];
            a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
            a.setAttribute("value", controller.axes[i] + 1);

            var value = controller.axes[i].toFixed(4);

            if (i == 0 && value < -0.5) { // left
                console.log('left');
                Q.inputs['left'] = true;
                break;
            }

            if (i == 0 && value > 0.5) { // right
                console.log('right');
                Q.inputs['right'] = true;
                break;
            }

            if (i == 1 && value < -0.5) { // up
                console.log('up');
                Q.inputs['up'] = true;
                break;
            }

            if (i == 1 && value > 0.5) { // down
                console.log('down');
                Q.inputs['down'] = true;
                break;
            }

            // This will fuck up your enjoyment of the keyboard controls.
            Q.inputs['left'] = false;
            Q.inputs['right'] = false;
            Q.inputs['up'] = false;
            Q.inputs['down'] = false;
        }
    }

    requestAnimationFrame(updateStatus);
}

function scangamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            if (gamepads[i].index in controllers) {
                controllers[gamepads[i].index] = gamepads[i];
            } else {
                addgamepad(gamepads[i]);
            }
        }
    }
}


window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) {
    setInterval(scangamepads, 500);
}

var Q = Quintus()
    .include("Sprites, Scenes, Input, 2D, Touch, UI")
    .setup({ maximize: true })
    .controls().touch()

Q.Sprite.extend("Player",{
    init: function(p) {
        this._super(p, { sheet: "player", x: 410, y: 90 });
        this.add('2d, platformerControls');

        this.on("hit.sprite",function(collision) {
            if(collision.obj.isA("Tower")) {
                Q.stageScene("endGame",1, { label: "You Won!" });
                this.destroy();
            }
        });
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

Q.scene("level1",function(stage) {
    stage.collisionLayer(new Q.TileLayer({ dataAsset: 'level.json', sheet: 'tiles' }));
    var player = stage.insert(new Q.Player());

    stage.add("viewport").follow(player);

    stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));

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

Q.load("sprites.png, sprites.json, level.json, tiles.png", function() {
    Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });
    Q.compileSheets("sprites.png","sprites.json");
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