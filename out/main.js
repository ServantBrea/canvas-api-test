var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var context = document.getElementById("myCanvas");
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
    text1.text = "I lose my game of life!";
    var text2 = new TextField();
    text2.x = 0;
    text2.y = 20;
    text2.alpha = 1;
    text2.color = "#0000FF";
    text2.fontSize = 30;
    text2.font = "Arial";
    text2.text = "落命.....";
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
    setInterval(function () {
        context2D.clearRect(0, 0, context.width, context.height);
        background.draw(context2D);
    }, 30);
};
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
    //子类重载渲染
    DisplayObject.prototype.render = function (context2D) { };
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
    return TextField;
}(DisplayObject));
//# sourceMappingURL=main.js.map