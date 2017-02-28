class EventObserver {
    static eventObserver: EventObserver;
    targetList: DisplayObject[];

    constructor() { }

    static getInstance() {
        if (EventObserver.eventObserver) {
            return EventObserver.eventObserver;
        } else {
            EventObserver.eventObserver = new EventObserver();
            EventObserver.eventObserver.targetList = new Array();
            return EventObserver.eventObserver;
        }
    }
}

class Events {
    eventType = "";
    func: Function;
    target: DisplayObject;
    ifGet = false;

    constructor(eventType: string, func: Function, target: DisplayObject, ifGet: boolean) {
        this.eventType = eventType;
        this.func = func;
        this.target = target;
        this.ifGet = ifGet;
    }
}

interface Drawable {
    draw(context2D: CanvasRenderingContext2D);
}

abstract class DisplayObject implements Drawable {

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

    eventList: Events[] = [];

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

    addEventListener(eventType: string, func: Function, target: DisplayObject, ifGet: boolean) {
        let evt = new Events(eventType, func, target, ifGet);
        this.eventList.push(evt);
    }

    //子类重载渲染
    abstract render(context2D: CanvasRenderingContext2D);
    abstract getClick(point: math.Point);
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

    getClick(point: math.Point) {
        let eventObserver = EventObserver.getInstance();

        if (this.eventList.length != 0) {
            eventObserver.targetList.push(this);
        }

        for (var i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            let childMatrix = new math.Matrix();
            childMatrix = math.invertMatrix(child.matrix);

            let invertPoint = math.pointAppendMatrix(point, childMatrix);
            let clickResult = child.getClick(invertPoint);

            if (clickResult) {
                return clickResult;
            }
        }
        return null
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

    getClick(point: math.Point) {
        if (this.image) {
            let rect = new math.Rectangle(0, 0, this.image.width, this.image.height);
            if (rect.ifPointBelong(point)) {
                let eventObserver = EventObserver.getInstance();
                if (this.eventList.length != 0) {
                    eventObserver.targetList.push(this);
                }
                return this;
            } else {
                return null;
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

    getClick(point: math.Point) {
        let rect = new math.Rectangle(0, 0, this.text.length * 10, 40);

        if (rect.ifPointBelong(point)) {
            let eventObserver = EventObserver.getInstance();
            if (this.eventList.length != 0) {
                eventObserver.targetList.push(this);
            }
            return this; 
        } else {
            return null;
        }
    }
}