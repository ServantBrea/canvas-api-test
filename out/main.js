var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObjectContainer = (function () {
    function DisplayObjectContainer() {
        this.children = new Array();
    }
    DisplayObjectContainer.prototype.addChild = function (child) {
        if (this.children.indexOf(child) == -1) {
            this.children.push(child);
        }
    };
    DisplayObjectContainer.prototype.draw = function (canvas) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.draw(canvas);
        }
    };
    DisplayObjectContainer.prototype.removeChild = function (child) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var element = _a[_i];
            if (element == child) {
                var index = this.children.indexOf(child);
                this.children.splice(index);
                return;
            }
        }
    };
    return DisplayObjectContainer;
}());
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.alpha = 1;
    }
    DisplayObject.prototype.draw = function (canvas) {
    };
    return DisplayObject;
}());
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.call(this);
        this.image = null;
        this.hasLoaded = false;
        this._src = "";
        this.image = document.createElement("image");
    }
    Object.defineProperty(Bitmap.prototype, "src", {
        set: function (src) {
            this._src = "/resource/assets/" + src;
            this.hasLoaded = false;
        },
        enumerable: true,
        configurable: true
    });
    Bitmap.prototype.draw = function (canvas) {
        var _this = this;
        canvas.globalAlpha = this.alpha;
        if (this.hasLoaded) {
            canvas.drawImage(this.image, this.x, this.y, this.image.width * this.scaleX, this.image.height * this.scaleY);
        }
        else {
            this.image.src = this._src;
            this.image.onload = function () {
                canvas.drawImage(_this.image, _this.x, _this.y, _this.image.width * _this.scaleX, _this.image.height * _this.scaleY);
                _this.hasLoaded = true;
            };
        }
    };
    return Bitmap;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
        this.text = "";
        this.color = "";
        this.fontSize = 10;
        this.font = "Georgia";
    }
    TextField.prototype.draw = function (canvas) {
        canvas.fillStyle = this.color;
        canvas.globalAlpha = this.alpha;
        canvas.font = this.fontSize.toString() + "px" + this.font.toString();
        canvas.fillText(this.text, this.x, this.y + this.fontSize);
    };
    return TextField;
}(DisplayObject));
window.onload = function () {
    var canvas = document.getElementById("myCanvas");
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
    text.text = "I lose my game of life!";
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
    setInterval(function () {
        canvas2D.clearRect(0, 0, canvas.width, canvas.height);
    }, 30);
};
//# sourceMappingURL=main.js.map