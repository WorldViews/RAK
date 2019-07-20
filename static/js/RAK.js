
var tool = null;

class Actor extends CanvasTool.Graphic {
    constructor(id, x, y) {
        super(id, x, y);
        this.vx = 0;
        this.vy = 0;
        this.happiness = 0.5;
    }

    onClick(e) {
        this.happiness = 0;
        if (e.shiftKey)
            this.happiness = 1;
    }

    adjustPosition() {
        if (0) {
            var s = 6;
            this.x += s*(Math.random() - 0.5);
            this.y += s*(Math.random() - 0.5);
        }
        else {
            var s = 1;
            this.vx += s*(Math.random() - 0.5);
            this.vy += s*(Math.random() - 0.5);
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= .9;
            this.vy *= .9;
        }
    }

    adjustState() {
        var s = .1;
        this.happiness += s*(Math.random() - 0.5);
        if (this.happiness > .8)
            this.fillStyle = "#0a0";
        if (this.happiness < .3) {
            this.fillStyle = "#a00";
        }
    }
}

class Link extends CanvasTool.Graphic {
    constructor(id, id1, id2) {
        super(id, 0, 0);
        this.id1 = id1;
        this.id2 = id2;
    }

    draw(canvas, ctx) {
        console.log("Link.draw");
        var a1 = tool.getGraphic(this.id1);
        var a2 = tool.getGraphic(this.id2);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
       ctx.beginPath();
       ctx.moveTo(a1.x, a1.y);
       ctx.lineTo(a2.x, a2.y);
       ctx.fill();
        ctx.stroke();
    }
}


class RAKTool extends CanvasTool {
//class RAKTool  {
    constructor(canvasName) {
        super(canvasName);
        this.distThresh = 50;
        this.numAgents = 500;
        this.grid = true;
        this.mobile = true;
        tool = this;
        this.setupDATGUI();
    }

    setupDATGUI()
    {
        var P = this;
        var gui = new dat.GUI();
        gui.add(P, 'numAgents', 2, 1000);
        gui.add(P, 'distThresh', 0, 200);
        gui.add(P, 'mobile');
        gui.add(P, 'grid');
        gui.add(P, 'reset');
    }

    reset() {
        this.init();
    }

    add(x, y, id) {
        id = id || this.numActors++;
        var actor = new Actor(id, x, y);
        this.actors[id] = actor;
        this.addGraphic(actor);
    }

    addLink(id1, id2) {
        var link = new Link("link"+this.numLinks++, id1, id2);
        this.links[[id1,id2]] = link;
        this.addGraphic(link);
    }

    connect(id1, id2) {
        this.links[[id1,id2]] = true;
    }

    dist(id1, id2) {
        var a1 = this.actors[id1];
        var a2 = this.actors[id2];
        var dx = a1.x-a2.x;
        var dy = a1.y-a2.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    init() {
        super.init();
        this.numActors = 0;
        this.numLinks = 0;
        this.actors = {};
        this.links = {};
        this.initPositions();
    }

    initPositions() {
        if (this.grid) {
            this.initGrid();
        }
        else {
            this.initRand();
        }
        //this.connect(1,2);
        //this.connect(2,3);
    }

    initGrid() {
        var n = Math.sqrt(this.numAgents);
        n = Math.floor(n);
        var W = 600;
        var H = 600;
        var w = W / n;
        var h = H / n;
        for (var i=0; i<this.numAgents; i++) {
            var j = Math.floor(i/n);
            var k = i % n;
            var x = j * w;
            var y = k * h;
            this.add(x,y,i);
        }
    }

    initRand() {
        var W = 600;
        var H = 600;
        for (var i=0; i<this.numAgents; i++) {
            var x = Math.random()*W;
            var y = Math.random()*H;
            this.add(x, y, i);
        }
    }

    adjustStates() {
        for (var id in this.actors)
            this.actors[id].adjustState();
    }

    adjustPositions() {
        for (var id in this.actors)
            this.actors[id].adjustPosition();
    }

    computeLinks(maxDist) {
        this.links = {};
        for (var i1 in this.actors) {
            for (var i2 in this.actors) {
                if (this.dist(i1,i2) < maxDist)
                    this.connect(i1,i2);
           }
        }
    }

    drawLinks() {
        var ctx = this.canvas.getContext('2d');
        this.setTransform(ctx);
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.strokeStyle;
        //ctx.fillStyle = this.fillStyle;
        ctx.fillStyle = this.null;
        ctx.beginPath();
        for (var id1 in this.actors) {
            var a1 = this.actors[id1];
            for (var id2 in this.actors) {
                if (!this.links[[id1,id2]])
                    continue;
                var a2 = this.actors[id2];
                ctx.moveTo(a1.x, a1.y);
                ctx.lineTo(a2.x, a2.y);
            }
        }
        ctx.stroke();
    }

    draw() {
        super.clearCanvas();
        this.drawLinks();
        super.drawGraphics();
    }

    tick() {
        //console.log("tick...");
        if (this.mobile)
            this.adjustPositions();
        this.adjustStates();
        this.computeLinks(this.distThresh);
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

