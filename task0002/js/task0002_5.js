/**
 * Created by Neo on 2016/2/4.
 */

//   获取id节点
function dom(id){
    return document.getElementById(id)
}

//    绑定事件
function addEvent(element,type,listener){
    type = type.replace(/^on/i,"").toLowerCase();
    var realListener = function (e) {
        if(typeof listener === "function") {
            e = e || window.event;
            listener.call(element, event);
        };
    };
    if(element.addEventListener){
        element.addEventListener(type,realListener,false);
    }
    else if(element.attachEvent){
        element.attachEvent("on"+type,realListener)
    }
    return element
};

//    事件代理
function delegateEvent(element, className, eventName, listener) {
    addEvent(element, eventName, function (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (target.className === className) {
            listener.call(target, event)
        }
    });
};

//  dragenter事件
var dragenter = function(e){
    e.preventDefault()
    this.style.border = "2px dashed red"
}

//  dragleave事件
var dragleave = function(e){
    e.preventDefault()
    this.style.border = "2px solid black"
}

//  dragover事件
var dragover = function(e){
    e.preventDefault()
}

//  drop事件
var drop = function(e){
    e.preventDefault()
    //读取该节点的的cell类型，这里是这个元素的id，所以能获得该节点
    var cell = dom(e.dataTransfer.getData("cell"))
    // 防止子节点也继承
    if(e.target.className !== "cell"){
        // 将cell添加到box中
        e.target.appendChild(cell)
        this.style.border = "2px solid black"
    }
    else{
        e.target.parentNode.insertBefore(cell, e.target)
        this.style.border = "2px solid black"
    }

}

//获取随机颜色
var getRandomColor = function(){
    return '#'+(Math.random()*0xffffff<<0).toString(16);
}


window.onload=function(){

    var box = document.getElementsByClassName("box")
    var cells = document.getElementsByClassName("cell")

    for(var i= 0,j=cells.length;i<j;i++){
        //设置为可拖拽
        cells[i].draggable = "true"
        cells[i].id = "cell"+i
        cells[i].style.backgroundColor = getRandomColor()

    }

    function dragstart(e){
        //为一个给定的类型设置数据，这里把这个对象的id设置为cell类型，然后在drop时读取
        e.dataTransfer.setData("cell",this.id)
    }


//        遍历box绑定事件
    for(var i= 0,j=box.length;i<j;i++){
//            事件代理，给cell绑定事件
        delegateEvent(box[i],"cell","ondragstart",dragstart)
        delegateEvent(box[i],"cell","ondragenter",dragenter)
        delegateEvent(box[i],"cell","ondragleave",dragleave)
        delegateEvent(box[i],"cell","ondrop",drop)

        addEvent(box[i],"ondragenter",dragenter)
        addEvent(box[i],"ondragleave",dragleave)
        addEvent(box[i],"ondragover",dragover)
        addEvent(box[i],"ondrop",drop)
    }
}
