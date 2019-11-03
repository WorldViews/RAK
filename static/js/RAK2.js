
var tool = null;

var Actor_num = 0;
class Actor extends CanvasTool.Graphic {
    constructor(opts) {
        opts.id = opts.id || Actor_num++;
        super(opts);
        this.fx = 0;
        this.fy = 0;
        this.vx = 0;
        this.vy = 0;
        this.radius = 5;
        this.happiness = 0.5;
    }

    static reset() {
        Actor_num = 0;
    }

    tick() {
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
            var m = 2.0;
            this.vx += s*(Math.random() - 0.5);
            this.vy += s*(Math.random() - 0.5);
            this.vx += this.fx/m;
            this.vy += this.fy/m;
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

    draw(canvas, ctx) {
        super.draw(canvas, ctx);
        this.drawShell(ctx, tool.egoDistThresh/2.0);
    }

    drawShell(ctx, r)
    {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, 2 * Math.PI);
        //ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

class RAKTool extends CanvasTool {
//class RAKTool  {
    constructor(canvasName) {
        super(canvasName);
        this.egoDistThresh = 40;
        this.groupDistThresh = 250;
        this.numActors = 0;
        this.grid = true;
        this.mobile = true;
        tool = this;
        this.setupDATGUI();
    }

    setupDATGUI()
    {
        var P = this;
        var gui = new dat.GUI();
        gui.add(P, 'numActors', 2, 1000);
        gui.add(P, 'egoDistThresh', 0, 200);
        gui.add(P, 'groupDistThresh', 0, 200);
        gui.add(P, 'mobile');
        gui.add(P, 'grid');
        gui.add(P, 'reset');
    }

    reset() {
        this.init();
    }

    add(x, y, id) {
         var actor = new Actor({x, y});
        this.actors[actor.id] = actor;
        this.addGraphic(actor);
    }

    connect(id1, id2, links, label) {
        links[[id1,id2]] = label;
    }

    distBetween(id1, id2) {
        var a1 = this.actors[id1];
        var a2 = this.actors[id2];
        var dx = a1.x-a2.x;
        var dy = a1.y-a2.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    init() {
        tool = this;
        super.init();
        this.setView(300, 300, 800)
        Actor.reset();
        this.stepNum = 0;
        this.numActors = 20;
        this.numLinks = 0;
        this.actors = {};
        this.egoLinks = {};
        this.groupLinks = {};
        this.initPositions();
        console.log("********* graphics:", this.graphics);
        //this.initInteractions();
        console.log("********* graphics:", this.graphics);
    }

    initPositions() {
        if (this.grid) {
            this.initGrid();
        }
        else {
            this.initRand();
        }
    }

    initGrid() {
        var n = Math.sqrt(this.numActors);
        n = Math.floor(n);
        var W = 600;
        var H = 600;
        var w = W / n;
        var h = H / n;
        for (var i=0; i<this.numActors; i++) {
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
        for (var i=0; i<this.numActors; i++) {
            var x = Math.random()*W;
            var y = Math.random()*H;
            this.add(x, y, i);
        }
    }

    adjustStates() {
        for (var id in this.actors)
            this.actors[id].adjustState();
    }

    computeForces(links) {
        for (var id in this.actors) {
            var a1 = this.actors[id];
            a1.fx = 0;
            a1.fy = 0;
            var k = -0.1;
            for (var i2 in this.actors) {
                if (!links[[id,i2]])
                    continue;
                var a2 = this.actors[i2];
                a1.fx = k* (a2.x - a1.x);
                a1.fy = k* (a2.y - a1.y);
           }
        }
    }

    adjustPositions() {
        this.computeForces(this.egoLinks);
        for (var id in this.actors) {
           this.actors[id].adjustPosition();
        }
    }

    computeLinks(links, distThresh) {
        for (var i1 in this.actors) {
            for (var i2 in this.actors) {
                if (this.distBetween(i1,i2) < distThresh)
                    this.connect(i1, i2, links, true);
           }
        }
    }

    drawLinks() {
        this.drawLinks_(this.egoLinks, 6, 'red');
        this.drawLinks_(this.groupLinks, 1, 'blue');
    }

    drawLinks_(links, width, strokeStyle) {
            var ctx = this.canvas.getContext('2d');
        this.setTransform(ctx);
        ctx.lineWidth = width;
        ctx.strokeStyle = strokeStyle;
        //ctx.fillStyle = this.fillStyle;
        ctx.fillStyle = this.null;
        ctx.beginPath();
        for (var id1 in this.actors) {
            var a1 = this.actors[id1];
            for (var id2 in this.actors) {
                var lab = links[[id1,id2]];
                if (!lab)
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

    getNumActors() {
        return Object.keys(this.actors).length;
    }


    tick() {
        //console.log("tick...");
        this.stepNum++;
        if (this.mobile)
            this.adjustPositions();
        this.adjustStates();
        this.egoLinks = {};
        this.computeLinks(this.egoLinks, this.egoDistThresh);
        this.groupLinks = {};
        this.computeLinks(this.groupLinks, this.groupDistThresh);
        this.draw();
        for (var id in this.actors)
            this.actors[id].tick();
        var str = sprintf("N: %3d NumActors: %3d",
                this.stepNum, this.getNumActors())
        $("#stats").html(str);
    }

    start() {
        console.log("HAK.start");
        this.init();
        this.tick();
        let inst = this;
        setInterval(() => inst.tick(), 20);
    }
 }

