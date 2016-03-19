

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
