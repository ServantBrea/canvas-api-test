window.onload = () => {

    var context = document.getElementById("myCanvas") as HTMLCanvasElement;
    var context2D = context.getContext("2d");

    var background = new DisplayObjectContainer();
    
    var container = new DisplayObjectContainer();
    container.x = 0;
    container.y = 0;
    container.alpha = 1;

    container.addEventListener("onMouseMove",(e:MouseEvent) => {
        let dy = currentY - tempY;
        let dx = currentX - tempX;
        container.x += dx;
        container.y += dy;
    },this,false);
    
    var text1 = new TextField();
    text1.x = 0;
    text1.y = 0;
    text1.alpha = 0.8;
    text1.color = "#FF0000";
    text1.fontSize = 30;
    text1.font = "Arial";
    text1.text = "I lose my game of life!";

    text1.addEventListener("onClick",()=> {
        console.log("Text is clicked");
    },this,false);

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
    bitmap.scaleX = 0.5;
    bitmap.scaleY = 0.5;
    bitmap.src = "codmw.png";

    bitmap.addEventListener("onClick",()=> {
        console.log("Bitmap is clicked");
    },this,false);

    container.addChild(bitmap);
    container.addChild(text2);
    background.addChild(container);
    background.addChild(text1);
    
    background.draw(context2D);

    setInterval(() => {
        context2D.clearRect(0, 0, context.width, context.height);
        background.draw(context2D);
    }, 30)

    //CLICK API USING

    let clickResult:DisplayObject;
    let currentX:number;
    let currentY:number;
    let tempX:number;
    let tempY:number;
    let ifMouseDown = false;

    window.onmousedown = (e) => {
        ifMouseDown = true;

        let targetList = EventObserver.getInstance().targetList;
        targetList.splice(0,targetList.length);
        
        clickResult = background.getClick(new math.Point(e.offsetX,e.offsetY));

        currentX = e.offsetX;
        currentY = e.offsetY;

        console.log("Click position : " + currentX + " / " +currentY);
    }

    window.onmousemove = (e) => {
        let targetList = EventObserver.getInstance().targetList;

        tempX = currentX;
        tempY = currentY;

        currentX = e.offsetX;
        currentY = e.offsetY;

        if(ifMouseDown) {
            for(var i = 0;i < targetList.length;i++) {
                for(let temp of targetList[i].eventList) {
                    if(temp.eventType.match("onMouseMove") && temp.ifGet == true) {
                        temp.func(e);
                    }
                }
            }
            for(var i = 0;i < targetList.length - 1;i++) {
                for(let temp of targetList[i].eventList) {
                    if(temp.eventType.match("onMouseMove") && temp.ifGet == false) {
                        temp.func(e);
                    }
                }
            }
        }
    }

    window.onmouseup = (e) => {    
        ifMouseDown = false;

        let targetList = EventObserver.getInstance().targetList;
        targetList.splice(0,targetList.length);

        let anotherClickResult = background.getClick(new math.Point(e.offsetX,e.offsetY));
        
        for (var i = 0;i < targetList.length;i++) {
            for (let temp of targetList[i].eventList) {
                if(temp.eventType.match("onClick") && anotherClickResult == clickResult) {
                    temp.func(e);
                }
            }
        }
    }
};
