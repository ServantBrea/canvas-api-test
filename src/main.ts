window.onload = () => {

    var context = document.getElementById("myCanvas") as HTMLCanvasElement;
    var context2D = context.getContext("2d");

    var background = new DisplayObjectContainer();
    
    var container = new DisplayObjectContainer();
    container.x = 0;
    container.y = 0;
    container.alpha = 0.5;
    
    var text1 = new TextField();
    text1.x = 0;
    text1.y = 0;
    text1.alpha = 0.8;
    text1.color = "#FF0000";
    text1.fontSize = 30;
    text1.font = "Arial";
    text1.text = "I lose my game of life!"
    

    var text2 = new TextField();
    text2.x = 0;
    text2.y = 20;
    text2.alpha = 1;
    text2.color = "#0000FF";
    text2.fontSize = 30;
    text2.font = "Arial";
    text2.text = "落命....."
    
    var bitmap = new Bitmap();
    bitmap.x = 0;
    bitmap.y = 0;
    bitmap.alpha = 0.8;
    bitmap.scaleX = 1;
    bitmap.scaleY = 1;
    bitmap.src = "codmw.png";
    
    background.addChild(container);
    container.addChild(text2);
    background.addChild(text1);
    background.addChild(bitmap);

    background.draw(context2D);

    setInterval(() => {
        context2D.clearRect(0, 0, context.width, context.height);
        background.draw(context2D);
    }, 30)
};

interface Drawable {
    draw(context2D: CanvasRenderingContext2D);
}

class DisplayObject implements Drawable {

    x = 0;
    y = 0;

    scaleX = 1;
    scaleY = 1;

    rotation = 0;

    alpha = 1;
    globalAlpha = 1;

    matrix: math.Matrix = new math.Matrix();
    globalMatrix: math.Matrix = new math.Matrix();

    parent: DisplayObject = null;

    //模版draw方法
    draw(context2D: CanvasRenderingContext2D) {

        this.matrix.updateFromDisplayObject(
            this.x, this.y, this.scaleX, this.scaleY, this.rotation);

        if (this.parent) {
            this.globalAlpha =
                this.parent.globalAlpha * this.alpha;
            this.globalMatrix =
                math.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);
        } else {
            this.globalAlpha = this.alpha;
            this.globalMatrix = this.matrix;
        }

        context2D.globalAlpha = this.globalAlpha;

        context2D.setTransform(this.globalMatrix.a,
            this.globalMatrix.b,
            this.globalMatrix.c,
            this.globalMatrix.d,
            this.globalMatrix.tx,
            this.globalMatrix.ty);
        //console.log(this.globalMatrix.toString());       
        this.render(context2D);
    }

    //子类重载渲染
    render(context2D: CanvasRenderingContext2D) { }
}

class DisplayObjectContainer extends DisplayObject {

    children: DisplayObject[] = new Array();

    constructor() {
        super();
    }

    render(context2D: CanvasRenderingContext2D) {
        for (var child of this.children) {
            child.draw(context2D);
        }
    }

    addChild(child: DisplayObject) {
        if (this.children.indexOf(child) == -1) {
            this.children.push(child);
            child.parent = this;
        }
    }

    removeChild(child: DisplayObject) {

        var tempChildren = this.children.concat();

        for (var element of tempChildren) {
            if (element == child) {
                var index = this.children.indexOf(element);
                tempChildren.splice(index, 1);
                this.children = tempChildren;
                return;
            }
        }
    }
}

class Bitmap extends DisplayObject {

    private image: HTMLImageElement = null;
    private hasLoaded = false;
    private _src = "";

    constructor() {
        super();
        this.image = new Image();
    }

    set src(src: string) {
        this._src = "/resource/assets/" + src;
        this.hasLoaded = false;
    }

    render(context2D: CanvasRenderingContext2D) {

        if (this.hasLoaded) {
            context2D.drawImage(
                this.image, 0, 0, this.image.width, this.image.height);
        } else {
            this.image.src = this._src;
            this.image.onload = () => {
                context2D.drawImage(
                    this.image, 0, 0, this.image.width, this.image.height);
                this.hasLoaded = true;
            }
        }
    }
}

class TextField extends DisplayObject {

    text = "";
    color = "";
    fontSize = 10;
    font = "Georgia";

    constructor() {
        super();
    }

    render(context2D: CanvasRenderingContext2D) {
        context2D.fillStyle = this.color;
        context2D.font = this.fontSize.toString() + "px " + this.font.toString();
        context2D.fillText(this.text, this.x, this.y + this.fontSize);
    }
}

