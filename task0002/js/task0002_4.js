search()

// 获取dom相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var x = 0;
    var y = 0;
    var current = element;
    var pre = null;

    while (current !== null) {
        x += current.offsetLeft;
        y += current.offsetTop;
        pre = current;
        current = current.offsetParent;
    }

    return {x: x, y: y};
}

// 给一个element绑定一个针对event事件的响应，响应函数为listener
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


//获取dom
function dom(id){
    return document.getElementById(id)
}
//获取下一个节点
function next(element){
    return element.nextElementSibling
}
//获取上一个节点
function prev(element){
    return element.previousElementSibling
}
//从json中读取信息
function infor(str){
    //如果字符串中有a,读取里面有a的信息到ul中
    dom("ul").innerHTML =""
    for(var k in str){
        if(k === "a" && dom("text").value.indexOf("a")!==-1){
            for(var i in str[k]){
                dom("ul").innerHTML += "<li>"+str.a[i]+"</li>"
            }
        }
        if(k === "b" && dom("text").value.indexOf("b")!==-1){
            for(var i in str[k]){
                dom("ul").innerHTML += "<li>"+str.b[i]+"</li>"
            }
        }
    }
}

function search() {
    //设置搜索内容样式
    dom("ul").style.position = "absolute"
    dom("ul").style.left = getPosition(dom("text")).x + "px"
    dom("ul").style.top = getPosition(dom("text")).y + 56 + "px"


    //按下相应li，将相应内容填到text中
    addEvent(dom("ul"), "click", function (e) {
        e = e || window.event
        var target = e.target || e.srcElement;
        dom("text").value = target.innerHTML
    })

    //移到哪个li就选中该li
    addEvent(dom("ul"), "mouseover", function (e) {
        e = e || window.event
        var li = document.getElementsByTagName("li")
        var target = e.target || e.srcElement;
        for (var i = 0, j = li.length; i < j; i++) {
            li[i].className = ""
        }
        target.className = "on"
    })

    //其他地方按下鼠标使列表消失
    addEvent(document, "click", function () {
            dom("ul").style.display="none"
    })


    //在搜索框里输入不同内容有不同反应
    addEvent(dom("text"), "keyup", function (e) {
        var event = e || window.event;
        var keyCode = event.keyCode || event.which;
        var li = document.getElementsByTagName("li")
        dom("ul").style.display="block"
        //通过ajax从json中读取信息
        if(keyCode!==38&&keyCode!==40&&keyCode!==13){
        ajax("date.json",{type:"GET",onsuccess:infor})
        }
        //遍历出那个选中的li
        function liOn(){
            for (var i = 0, j = li.length; i < j; i++) {
                if (li[i].className === "on")
                    var on = li[i]
                    if(on){
                        li[i].className = ""
                        on.index = i
                    }
            }
            return on
        }

        //如果有列表才能进行选择和enter确认操作
        if(dom("ul").style.display="block") {
            if(keyCode === 38){
                var on = liOn()
                if(on){
                    prev(on).className = "on"
                    li[on.index].className = ""
                }
            }
            if(keyCode === 40){
                var on = liOn()
                if(on){

                    next(on).className = "on"
                }
                else{
                    dom("ul").firstChild.className = "on"
                }
            }
            if (keyCode === 13) {
                var on = liOn()
                if (on) {
                    dom("text").value = on.innerHTML
                    dom("ul").style.display="none"
                }

            }
        }
    })

}
