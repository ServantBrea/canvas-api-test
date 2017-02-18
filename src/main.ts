interface Drawable {

    draw(canvas: CanvasRenderingContext2D);

}

class DisplayObjectContainer implements Drawable {

    children: Drawable[] = new Array();

    addChild(child: Drawable) {
        if (this.children.indexOf(child) == -1) {
            this.children.push(child);
        }
    }

    draw(canvas: CanvasRenderingContext2D) {
        for (var child of this.children) {
            child.draw(canvas);
        }
    }

    removeChild(child: Drawable) {
        for (var element of this.children) {
            if (element == child) {
                var index = this.children.indexOf(child);
                this.children.splice(index);
                return;
            }
        }
    }
}

class DisplayObject implements Drawable {

    x = 0;
    y = 0;
    scaleX = 1;
    scaleY = 1;
    alpha = 1;

    draw(canvas: CanvasRenderingContext2D) {

    }
}

class Bitmap extends DisplayObject {

    private image: HTMLImageElement = null;
    private hasLoaded = false;
    private _src = "";

    constructor() {
        super();
        this.image = document.createElement("image") as HTMLImageElement;
    }

    set src(src: string) {
        this._src = "/resource/assets/" + src;
        this.hasLoaded = false;
    }

    draw(canvas: CanvasRenderingContext2D) {
        canvas.globalAlpha = this.alpha;

        if (this.hasLoaded) {
            canvas.drawImage(this.image, this.x, this.y,
                this.image.width * this.scaleX,
                this.image.height * this.scaleY);
        } else {
            this.image.src = this._src;
            this.image.onload = () => {
                canvas.drawImage(this.image, this.x, this.y,
                    this.image.width * this.scaleX,
                    this.image.height * this.scaleY);
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

    draw(canvas: CanvasRenderingContext2D) {
        canvas.fillStyle = this.color;
        canvas.globalAlpha = this.alpha;
        canvas.font = this.fontSize.toString() + "px" + this.font.toString();
        canvas.fillText(this.text, this.x, this.y + this.fontSize);
    }
}

window.onload = () => {

    var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    var canvas2D = canvas.getContext("2d");
    var background = new DisplayObjectContainer();

    var text = new TextField();
    text.x = 0;
    text.y = 0;
    text.scaleX = 3;
    text.scaleY = 3;
    text.alpha = 0.5;
    text.color = "#FF0000";
    text.fontSize = 30;
    //text.font = "Arial";
    text.text = "I lose my game of life!"

    var bitmap = new Bitmap();
    bitmap.x = 0;
    bitmap.y = 0;
    bitmap.alpha = 0.8;
    bitmap.scaleX = 1.5;
    bitmap.scaleY = 1.5;
    bitmap.src = "codmw.png";

    background.addChild(bitmap);
    background.addChild(text);
    background.draw(canvas2D);

    setInterval(() => {
        canvas2D.clearRect(0, 0, canvas.width, canvas.height);
    }, 30)
};