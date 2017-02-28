var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventObserver = (function () {
    function EventObserver() {
    }
    EventObserver.getInstance = function () {
        if (EventObserver.eventObserver) {
            return EventObserver.eventObserver;
        }
        else {
            EventObserver.eventObserver = new EventObserver();
            EventObserver.eventObserver.targetList = new Array();
            return EventObserver.eventObserver;
        }
    };
    return EventObserver;
}());
var Events = (function () {
    function Events(eventType, func, target, ifGet) {
        this.eventType = "";
        this.ifGet = false;
        this.eventType = eventType;
        this.func = func;
        this.target = target;
        this.ifGet = ifGet;
    }
    return Events;
}());
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.alpha = 1;
        this.globalAlpha = 1;
        this.matrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();
        this.parent = null;
        this.eventList = [];
    }
    //模版draw方法
    DisplayObject.prototype.draw = function (context2D) {
        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {
            this.globalAlpha =
                this.parent.globalAlpha * this.alpha;
            this.globalMatrix =
                math.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);
        }
        else {
            this.globalAlpha = this.alpha;
            this.globalMatrix = this.matrix;
        }
        context2D.globalAlpha = this.globalAlpha;
        context2D.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        //console.log(this.globalMatrix.toString());       
        this.render(context2D);
    };
    DisplayObject.prototype.addEventListener = function (eventType, func, target, ifGet) {
        var evt = new Events(eventType, func, target, ifGet);
        this.eventList.push(evt);
    };
    return DisplayObject;
}());
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        _super.call(this);
        this.children = new Array();
    }
    DisplayObjectContainer.prototype.render = function (context2D) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.draw(context2D);
        }
    };
    DisplayObjectContainer.prototype.addChild = function (child) {
        if (this.children.indexOf(child) == -1) {
            this.children.push(child);
            child.parent = this;
        }
    };
    DisplayObjectContainer.prototype.removeChild = function (child) {
        var tempChildren = this.children.concat();
        for (var _i = 0, tempChildren_1 = tempChildren; _i < tempChildren_1.length; _i++) {
            var element = tempChildren_1[_i];
            if (element == child) {
                var index = this.children.indexOf(element);
                tempChildren.splice(index, 1);
                this.children = tempChildren;
                return;
            }
        }
    };
    DisplayObjectContainer.prototype.getClick = function (point) {
        var eventObserver = EventObserver.getInstance();
        if (this.eventList.length > 0) {
            eventObserver.targetList.push(this);
        }
        for (var i = 0; i < this.children.length - 1; i++) {
            var child = this.children[i];
            var childMatrix = new math.Matrix();
            childMatrix = math.invertMatrix(child.matrix);
            var invertPoint = math.pointAppendMatrix(point, childMatrix);
            var clickResult = child.getClick(invertPoint);
            if (clickResult) {
                return clickResult;
            }
        }
    };
    return DisplayObjectContainer;
}(DisplayObject));
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.call(this);
        this.image = null;
        this.hasLoaded = false;
        this._src = "";
        this.image = new Image();
    }
    Object.defineProperty(Bitmap.prototype, "src", {
        set: function (src) {
            this._src = "/resource/assets/" + src;
            this.hasLoaded = false;
        },
        enumerable: true,
        configurable: true
    });
    Bitmap.prototype.render = function (context2D) {
        var _this = this;
        if (this.hasLoaded) {
            context2D.drawImage(this.image, 0, 0, this.image.width, this.image.height);
        }
        else {
            this.image.src = this._src;
            this.image.onload = function () {
                context2D.drawImage(_this.image, 0, 0, _this.image.width, _this.image.height);
                _this.hasLoaded = true;
            };
        }
    };
    Bitmap.prototype.getClick = function (point) {
        if (this.image) {
            var rect = new math.Rectangle(0, 0, this.image.width, this.image.height);
            if (rect.ifPointBelong(point)) {
                var eventObserver = EventObserver.getInstance();
                if (this.eventList.length > 0) {
                    eventObserver.targetList.push(this);
                }
                return this;
            }
            else {
                return null;
            }
        }
    };
    return Bitmap;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.call(this);
        this.text = "";
        this.color = "";
        this.fontSize = 10;
        this.font = "Georgia";
    }
    TextField.prototype.render = function (context2D) {
        context2D.fillStyle = this.color;
        context2D.font = this.fontSize.toString() + "px " + this.font.toString();
        context2D.fillText(this.text, this.x, this.y + this.fontSize);
    };
    TextField.prototype.getClick = function (point) {
        var rect = new math.Rectangle(0, 0, this.text.length * 10, 40);
        if (rect.ifPointBelong(point)) {
            var eventObserver = EventObserver.getInstance();
            if (this.eventList.length > 0) {
                eventObserver.targetList.push(this);
            }
            return this;
        }
        else {
            console.log("Click nothing");
            return null;
        }
    };
    return TextField;
}(DisplayObject));
//# sourceMappingURL=api-for-canvas.js.map