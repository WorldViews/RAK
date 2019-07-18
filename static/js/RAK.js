
class RAKTool extends CanvasTool {
//class RAKTool  {
    constructor(canvasName) {
        super(canvasName);
        this.numActors = 0;
    }

    add(x, y, id) {
        id = id || this.numActors++;
        this.addGraphic(new CanvasTool.Graphic(id, x, y));
    }

    init() {
        var W = 500;
        var H = 500;
        this.numAgents = 100;
        for (var i=0; i<this.numAgents; i++) {
            var x = Math.random()*W;
            var y = Math.random()*H;
            this.add(x, y, i);
        }
    }

    adjust() {
        var s = 2;
        for (var i=0; i<this.numAgents; i++) {
            var g = this.getGraphic(i);
            g.x += s*(Math.random() - 0.5);
            g.y += s*(Math.random() - 0.5);
        }
    }

    tick() {
        //console.log("tick...");
        this.adjust();
        this.draw();
    }

    start() {
        console.log("HAK.start");
        this.init();
        this.tick();
        let inst = this;
        setInterval(() => inst.tick(), 20);
    }
 }

