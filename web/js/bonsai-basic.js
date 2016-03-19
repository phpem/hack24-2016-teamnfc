var stage = document.getElementById('stage');

var arrowUp = 38,
    arrowDown = 40,
    arrowLeft = 37,
    arrowRight = 39;

bonsai.run(stage, {
    code: function() {
        var rect = new Rect(100, 100, 100, 100).fill("red").addTo(stage);

        stage.on('keyup', function(e){

            switch (e.keyCode) {
                case 38:
                    console.log('Up');
                    break;
                case 40:
                    console.log('Down');
                    break;
                case 37:
                    console.log('Left');
                    break;
                case 39:
                    console.log('Right');
                    break;
            }
            //console.log('Key event: ' + e.keyCode);
        });
    },
    width: 500,
    height: 400
});