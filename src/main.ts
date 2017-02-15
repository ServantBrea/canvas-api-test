interface drawable {
    draw();
}

class DisplayObjectContainer implements drawable {
    x:number = 0;
    y:number = 0;
    scaleX:number = 1;
    scaleY:number = 1;
    movespeedX:number = 0;
    movespeedY:number = 0;
    rotateangle:number = 0;
    protected canvas:HTMLCanvasElement;
    protected context:CanvasRenderingContext2D;

    protected children:DisplayObjectContainer[] = new Array();
    
    constructor() {
        this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d');
    }

    addChild(child:DisplayObjectContainer) {
        this.children.push(child);
        this.draw();
    }

    draw() {
        setInterval(() => {
            this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
            this.children.forEach(element => {
                element.draw(); 
            });   
        },30);
    }
}

class Bitmap extends DisplayObjectContainer {

    filename:string;

    constructor(name?:string) {
        super();
        this.filename = name;
    }

    draw() {
        var x = this.x + this.movespeedX;
        var y = this.y + this.movespeedY;

        var canvas = this.canvas;
        var context = this.context;

        var img = new Image();
        img.src = "/resource/assets/" + this.filename;

        context.scale(this.scaleX,this.scaleY);
        context.rotate(this.rotateangle*Math.PI/180);

        context.drawImage(img,x,y);
        /*
        img.onload = function() {
            setInterval(() => {
                context.clearRect(0,0,canvas.width,canvas.height);
                context.drawImage(img,x + msX,y + msY);
            },30);
        } */
    }
}

class TextField extends DisplayObjectContainer {

    text:string = "";
    color:string = "";
    font:string = "20px Georgia";

    constructor() {
        super();
    }

    draw() {
        var canvas = this.canvas;
        var context = this.context;
        var x = this.x;
        var y = this.y;
        var text = this.text;

        var img = new Image();

        context.fillStyle = this.color;

        context.scale(this.scaleX,this.scaleY);
        context.rotate(this.rotateangle*Math.PI/180);
        context.font = this.font;

        context.fillText(this.text,this.x,this.y + 18);
        /*
        setInterval(() => {
                context.clearRect(0,0,canvas.width,canvas.height);
                context.fillText(this.text,20,20);
        },30);  
        */
    }
}

window.onload = () => {
    
    var ground = new DisplayObjectContainer();
    var pic = new Bitmap("codmw.png");
    ground.addChild(pic);
    
    var text = new TextField();
    text.text = "Hello World!";
    text.color = "#FF0000";
    //text.scaleX = text.scaleY = 1.5;
    ground.addChild(text);
};