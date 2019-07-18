// Class for 2D visualization for Kinect skeletons

class CanvasTool {
    constructor(canvas){
        console.log('Creating CanvasApp');
        this.canvas = canvas;
        //this.elements = elements;
        this.elements = {};
        this.listenerId = null;
        this.sx = 0.2;
        this.sy = 0.2;
        this.tx = 1200;
        this.ty = 0;

        // Object.keys(object).length;

        this.context = this.canvas.getContext('2d');
    }

    zoom(zf) {
        zf = zf || .9;
        this.sx *= zf;
        this.sy *= zf;
    }

    draw(){
        var ctx = this.context;
        ctx.resetTransform();
        this.context.globalAlpha = 1;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.lineWidth = 5;
        this.context.strokeStyle = '#bbb';
        this.context.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.scale(this.sx, this.sy);
        ctx.translate(this.tx, this.ty);
        for (var id in this.elements){
            //console.log("draw id", id);
            var element = this.elements[id];
            //let icon = document.getElementById(this.elements[id].icon);
            if (element !== undefined)
            {
                /*
                let radiusInPixels = this.elements[id].radius * this.canvas.width;
                let x = this.elements[id].x * this.canvas.width - radiusInPixels;
                let y = this.elements[id].y * this.canvas.height - radiusInPixels;
                this.context.globalAlpha = this.elements[id].alpha;
                this.context.drawImage(
                icon, x, y, radiusInPixels * 2, radiusInPixels * 2);
                console.log('id', id,"x", x, "y", y, "radiusInPixels", radiusInPixels);
                */
               element.draw(this.canvas, ctx);
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
        this.elements[id].x = x;
        this.elements[id].y = y;
        this.draw();
    }

    getElement(id) {
        return this.elements[id];
    }

    getNumElements() {
        return Object.keys(this.elements).length;
    }

    addElement(element){
        this.elements[element.id] = element;       
    }

    removeElement(id){

        if (id == this.getListenerId()){
            this.setListenerId(null);
        }
        console.log('removing element with id ' + id);
        delete this.elements[id];
        this.draw();
    }

    setListenerId(id){
        this.listenerId = id;
    }

    getListenerId(){
        return this.listenerId;
    }

    updateIcon(id){
        this.elements[id].icon = document.getElementById(this.elements[id].iconName);
    }
   
}

CanvasTool.Element = class {
    constructor(id, iconName, x,y){
        this.iconName = iconName;
        this.icon = document.getElementById(iconName);
        if (!this.icon) {
            alert("Unable to get icon " + iconName);
        }
        this.id = id;
        this.x =x;
        this.y = y;
        this.radius = 0.04; 
        this.alpha = 0.333;
        this.clickable =  false;

    }

    draw(canvas, ctx) {
        let radiusInPixels = this.radius * canvas.width;
        let x = this.x * canvas.width - radiusInPixels;
        let y = this.y * canvas.height - radiusInPixels;
        ctx.drawImage(
            this.icon, x, y, radiusInPixels * 2, radiusInPixels * 2);
            //console.log('id', this.id,"x", x, "y", y, "radiusInPixels", radiusInPixels);
    }

}

CanvasTool.CameraElement = class extends CanvasTool.Element {
    constructor(id, x, y) {
        super(id, 'cameraIcon', x, y);
    }
}

CanvasTool.ListenerElement = class extends CanvasTool.Element {
    constructor(id, x, y) {
        super(id, 'listenerIcon', x, y);
    }
}

CanvasTool.SourceElement = class extends CanvasTool.Element {
    constructor(id, x, y) {
        super(id, 'sourceIcon', x, y);
    }
}

