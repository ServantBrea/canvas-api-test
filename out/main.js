var _this = this;
window.onload = function () {
    var context = document.getElementById("myCanvas");
    var context2D = context.getContext("2d");
    var background = new DisplayObjectContainer();
    var container = new DisplayObjectContainer();
    container.x = 0;
    container.y = 0;
    container.alpha = 1;
    container.addEventListener("onMouseMove", function (e) {
        var dy = currentY - tempY;
        console.log("dy =" + dy);
        container.y += dy;
    }, _this, false);
    /*
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
    */
    var bitmap = new Bitmap();
    bitmap.x = 0;
    bitmap.y = 0;
    bitmap.alpha = 0.8;
    bitmap.scaleX = 1;
    bitmap.scaleY = 1;
    bitmap.src = "codmw.png";
    bitmap.addEventListener("onClick", function () {
        console.log("You have clicked me");
    }, _this, false);
    background.addChild(container);
    //container.addChild(text2);
    //background.addChild(text1);
    container.addChild(bitmap);
    background.draw(context2D);
    setInterval(function () {
        context2D.clearRect(0, 0, context.width, context.height);
        background.draw(context2D);
    }, 30);
    //CLICK API USING
    var clickResult;
    var currentX;
    var currentY;
    var tempX;
    var tempY;
    var ifMouseDown = false;
    window.onmousedown = function (e) {
        ifMouseDown = true;
        var targetList = EventObserver.getInstance().targetList;
        targetList.splice(0, targetList.length);
        clickResult = background.getClick(new math.Point(e.offsetX, e.offsetY));
        currentX = e.offsetX;
        currentY = e.offsetY;
        console.log("Click position" + currentX + " / " + currentY);
    };
    window.onmouseup = function (e) {
        ifMouseDown = false;
        var targetList = EventObserver.getInstance().targetList;
        targetList.splice(0, targetList.length);
        var anotherClickResult = background.getClick(new math.Point(e.offsetX, e.offsetY));
        for (var i = 0; i < targetList.length - 1; i++) {
            for (var _i = 0, _a = targetList[i].eventList; _i < _a.length; _i++) {
                var temp = _a[_i];
                if (temp.eventType.match("onClick") && anotherClickResult == clickResult) {
                    temp.func(e);
                }
            }
        }
    };
    window.onmousemove = function (e) {
        var targetList = EventObserver.getInstance().targetList;
        tempX = currentX;
        tempY = currentY;
        currentX = e.offsetX;
        currentY = e.offsetY;
        if (ifMouseDown) {
            for (var i = 0; i < targetList.length - 1; i++) {
                for (var _i = 0, _a = targetList[i].eventList; _i < _a.length; _i++) {
                    var temp = _a[_i];
                    if (temp.eventType.match("onMouseMove") && temp.ifGet == true) {
                        temp.func(e);
                    }
                }
            }
            for (var i = 0; i < targetList.length - 1; i++) {
                for (var _b = 0, _c = targetList[i].eventList; _b < _c.length; _b++) {
                    var temp = _c[_b];
                    if (temp.eventType.match("onMouseMove") && temp.ifGet == false) {
                        temp.func(e);
                    }
                }
            }
        }
    };
};
//# sourceMappingURL=main.js.map