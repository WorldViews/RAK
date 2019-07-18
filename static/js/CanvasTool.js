// Class for 2D visualization for Kinect skeletons

class CanvasTool {
    constructor(canvasName) {
        canvasName = canvasName || "canvas";
        console.log('Creating CanvasTool', canvasName);
        this.canvas = document.getElementById(canvasName);
        if (!this.canvas) {
            alert("No canvas named "+canvasName);
            return;
        }
        //this.elements = elements;
        this.graphics = {};
        this.sx = 1;
        this.sy = 1;
        this.tx = 0;
        this.ty = 0;
        this.context = this.canvas
    }

    zoom(zf) {
        zf = zf || .9;
        this.sx *= zf;
        this.sy *= zf;
    }

    draw(){
        var ctx = this.canvas.getContext('2d');
        var canvas = this.canvas;
        ctx.resetTransform();
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 5;
        ctx.strokeStyle = '#bbb';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.scale(this.sx, this.sy);
        ctx.translate(this.tx, this.ty);
        for (var id in this.graphics){
            //console.log("draw id", id);
            var graphics = this.graphics[id];
            if (graphics !== undefined)
            {
                graphics.draw(canvas, ctx);
            }
        }
    }

    resize(){
        console.log("resizing the canvas...");
        let canvasWidth = this.canvas.clientWidth;
        let maxCanvasSize = 800;
        if (canvasWidth > maxCanvasSize) {
            canvasWidth = maxCanvasSize;
        }
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasWidth;
        this.draw();
    }

    setXY(id, x, y){
        this.graphics[id].x = x;
        this.graphics[id].y = y;
        this.draw();
    }

    getGraphic(id) {
        return this.graphics[id];
    }

    getNumGraphics() {
        return Object.keys(this.graphics).length;
    }

    addGraphic(graphic){
        this.graphics[graphic.id] = graphic;       
    }

    removeGraphic(id) {
        console.log('removing graphic with id ' + id);
        delete this.graphics[id];
        this.draw();
    }

    tick() {
        console.log("tick...");
        this.draw();
    }

    start() {
        this.tick();
        let inst = this;
        setInterval(() => inst.tick(), 1000);
    }

}

CanvasTool.Graphic = class {
    constructor(id, x, y) {
        this.id = id;
        this.x =x;
        this.y = y;
        this.lineWidth = 1;
        this.strokeStyle = '#000';
        this.fillStyle = '#900';
        this.radius = 10; 
        this.alpha = 0.333;
        this.clickable =  false;
    }

    draw(canvas, ctx) {
        let r = this.radius;
        let x = this.x;
        let y = this.y;
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

CanvasTool.IconGraphic = class extends CanvasTool.Graphic {
    constructor(id, iconName, x,y) {
        super(id, x, y);
        this.iconName = iconName;
        this.icon = document.getElementById(iconName);
        if (!this.icon) {
            alert("Unable to get icon " + iconName);
        }
        this.radius = 0.04; 
        this.alpha = 0.333;
    }

    draw(canvas, ctx) {
        let radiusInPixels = this.radius * canvas.width;
        let x = this.x * canvas.width - radiusInPixels;
        let y = this.y * canvas.height - radiusInPixels;
        ctx.drawImage(
            this.icon, x, y, radiusInPixels * 2, radiusInPixels * 2);
    }
}

