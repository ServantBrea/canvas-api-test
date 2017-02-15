var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObjectContainer = (function () {
    function DisplayObjectContainer() {
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.movespeedX = 0;
        this.movespeedY = 0;
        this.rotateangle = 0;
        this.children = new Array();
        this.canvas = document.getElementById('myCanvas');
        this.context = this.canvas.getContext('2d');
    }
    DisplayObjectContainer.prototype.addChild = function (child) {
        this.children.push(child);
        this.draw();
    };
    DisplayObjectContainer.prototype.draw = function () {
        var _this = this;
        setInterval(function () {
            _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            _this.children.forEach(function (element) {
                element.draw();
            });
        }, 30);
    };
    return DisplayObjectContainer;
}());
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap(name) {
        _super.call(this);
        this.filename = name;
    }
    Bitmap.prototype.draw = function () {
        var x = this.x + this.movespeedX;
        var y = this.y + this.movespeedY;
        var canvas = this.canvas;
        var context = this.context;
        var img = new Image();
        img.src = "/resource/assets/" + this.filename;
        context.scale(this.scaleX, this.scaleY);
        context.rotate(this.rotateangle * Math.PI / 180);
        context.drawImage(img, x, y);
        /*
        img.onload = function() {
            setInterval(() => {
                context.clearRect(0,0,canvas.width,canvas.height);
                context.drawImage(img,x + msX,y + msY);
            },30);
        } */
    };
    return Bitmap;
}(DisplayObjectContainer));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.call(this);
        this.text = "";
        this.color = "";
        this.font = "20px Georgia";
    }
    TextField.prototype.draw = function () {
        var canvas = this.canvas;
        var context = this.context;
        var x = this.x;
        var y = this.y;
        var text = this.text;
        var img = new Image();
        context.fillStyle = this.color;
        context.scale(this.scaleX, this.scaleY);
        context.rotate(this.rotateangle * Math.PI / 180);
        context.font = this.font;
        context.fillText(this.text, this.x, this.y + 18);
        /*
        setInterval(() => {
                context.clearRect(0,0,canvas.width,canvas.height);
                context.fillText(this.text,20,20);
        },30);
        */
    };
    return TextField;
}(DisplayObjectContainer));
window.onload = function () {
    var ground = new DisplayObjectContainer();
    var pic = new Bitmap("codmw.png");
    ground.addChild(pic);
    var text = new TextField();
    text.text = "Hello World!";
    text.color = "#FF0000";
    //text.scaleX = text.scaleY = 1.5;
    ground.addChild(text);
};
//# sourceMappingURL=main.js.map