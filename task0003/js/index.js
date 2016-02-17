/**
 * Created by Neo on 2016/2/15.
 */



//判断是否有className
function hasClass(element,className){
    var classArray = element.className.split(" ")
    for(var i= 0,j=classArray.length;i<j;i++){
        if(className == classArray[i]){
            return true
        }
    }
    return false
}
//增加className
function addClass(element,className){
    if(!hasClass(element,className)){
        element.className += " "+className
    }
}
//删除className
function removeClass(element,className) {
    if (hasClass(element,className)) {
        var newClass = null
        var classArray = element.className.split(" ")
        for(var i= 0,j=classArray.length;i<j;i++){
            if(className == classArray[i]){
                classArray.splice(i,1)
            }
        }
        newClass = classArray.join(" ")
        element.className = newClass
    }
}

//整个系统的命名空间
var system = {}
//本地存储
system.mainContent = document.getElementById("mainContent")
system.save = function(){
    if(localStorage.text){
        system.mainContent.innerHTML = localStorage.text
    }
    return
}
system.save()
//状态重置
system.reset = function(){
    var tasksLi = document.getElementById("taskLists").getElementsByTagName("li")
    for(var i= 0,j=tasksLi.length;i<j;i++){
        var doTime = tasksLi[i].getElementsByTagName("p")
        doTime[0].className = "do-time"
    }
    var edit = document.getElementById("edit")
    edit.innerHTML = ""
}
system.reset()

//存储第一栏点击时的节点
system.activeNode = null;

//第一栏的删除按钮
system.cancel = function() {
    var cancelNode = document.getElementsByClassName("cancel")
    for(var i= 0,j=cancelNode.length;i<j;i++){
        cancelNode[i].onclick = function(e){
            e = e || window.event
            e.stopPropagation()
            e.cancelable = true
            var input = confirm("你是否要删除 ?")
            if(input == true){
                var taskList = document.getElementById("taskLists").getElementsByTagName("ul")
                //如果删除的是整个文件夹
                if(e.target.parentNode.nodeName == "P"){
                    if(e.target.parentNode.id == "defaultTask"){
                        alert("默认分类不能删除")
                        return
                    }

                    var allList =  e.target.parentNode.parentNode.getElementsByTagName("li")
                    //删除第二栏所有任务
                    for(var i= 0,j=taskList.length;i<j;i++){
                        if(taskList.length >0){
                            for(var x= 0,y=allList.length;x<y;x++){
                                if(typeof(taskList[i]) !="undefined"  && taskList[i].getAttribute("task") == allList[x].getAttribute("task")){
                                    taskList[i].parentNode.removeChild(taskList[i])
                                }
                            }
                        }
                    }
                    //删除第一栏文件夹相应列表
                    if(e.target.parentNode.parentNode.parentNode){
                        e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode)
                    }
                    localStorage.text = system.mainContent.innerHTML
                }
                //如果删除的是单个文件
                else{
                    //删除第二栏所属项目任务
                    for(var i= 0,j=taskList.length;i<j;i++){
                        if(taskList.length >0){
                            if(typeof(e.target.parentNode) !="undefined"  && e.target.parentNode.getAttribute("task")==taskList[i].getAttribute("task") ){
                                taskList[i].parentNode.removeChild(taskList[i])
                            }
                        }
                        //删除第一栏文件相应列表
                        if(e.target.parentNode.parentNode){
                            e.target.parentNode.parentNode.removeChild(e.target.parentNode)
                        }
                        localStorage.text = system.mainContent.innerHTML
                    }
                }
            }
        }
    }
}
system.cancel()

//第一栏任务列表
system.file = function(){
    var lists = document.getElementById("lists")
    var files = document.getElementsByClassName("files")
    //存储点击第一栏的节点的父节点，用来增加第一栏列表
    var activeNode = null

//点击鼠标使第一栏的任务列表背景变色
    function active(element){
        removeClass(lists,"file-active")
        for(var i= 0,j=files.length;i<j;i++){
            var p = files[i].getElementsByTagName("p")[0]
            removeClass(p,"file-active")
            var li = files[i].getElementsByTagName("li")
            for(var x= 0,y=li.length;x<y;x++){
                removeClass(li[x],"file-active")
            }}
        addClass(element,"file-active")
        activeNode = element.parentNode
        system.activeNode = element
    }

//使第一栏删除按钮显示或隐藏
    function cancelBlock(element){
        element.getElementsByClassName("cancel")[0].style.display="block"
    }
    function cancelNone(element){
        element.getElementsByClassName("cancel")[0].style.display="none"
    }


//增加鼠标点击，移入和移出事件
    function addEvent(){
        lists.onclick = function(){
            active(this)
        }
        //给第一栏列表增加事件
        for(var i= 0,j=files.length;i<j;i++){
            var p = files[i].getElementsByTagName("p")[0]
            //点击鼠标使第一栏的任务列表背景变色，并显示第二栏列表
            p.onclick = function(){
                active(this)
                system.appearAll(this.parentNode)
            }
            //移入鼠标第一栏则使第一栏删除按键显示，移出相反
            p.onmouseover = function(){
                    cancelBlock(this)
            }
            p.onmouseout = function(){
                cancelNone(this)
            }
            //上面是控制文件夹，下面是控制单个文件
            var li = files[i].getElementsByTagName("li")
            for(var x= 0,y=li.length;x<y;x++){
                li[x].onclick = function(){
                    active(this)
                    system.appear()
                }
                li[x].onmouseover = function(){
                    cancelBlock(this)
                }
                li[x].onmouseout = function(){
                    cancelNone(this)
                }
            }}


    }
    addEvent()

//第一栏新增任务按钮
    function addTask(){

        var addOne = document.getElementById("add-one")
        addOne.onclick = function(e){
            e = e || window.event
            var tasks = document.getElementById("tasks")
            var input = prompt("新分类名称")
            if(input){
                //如果增加的是单个文件的话
                if(activeNode && activeNode.nodeName == "UL"){
                    //往第二栏增加一个任务框，并加上时间戳，使其和第一栏相对应
                    var tasks = document.getElementById("taskLists")
                    var lists = document.createElement("ul")
                    lists.style.display ="none"
                    var nowTime = new Date().getTime()
                    lists.setAttribute("task",nowTime)
                    tasks.appendChild(lists)
                    //增加一个任务并加上时间戳
                    activeNode.innerHTML += "<li class=\"file parent-layout\" task=\""+ nowTime+"\"><span>"+input+"</span><input class=\"cancel\" type=\"button\"></li>"
                    addEvent()
                    system.cancel()
                    localStorage.text = system.mainContent.innerHTML
                    return;
                }
                //如果增加是文件夹
                tasks.innerHTML += "<ul class=\"files\"><p class=\"parent-layout\">"+input+"<input class=\"cancel\" type=\"button\"></p></ul>"
                //再添加一遍事件，太过繁琐，需要修改
                addEvent()
                system.cancel()
                localStorage.text = system.mainContent.innerHTML
            }

        }
    }
    addTask()
}
system.file()

//第二栏内容
system.select = function(){
    var title = document.getElementById("task-title")
    var time = document.getElementById("task-time")
    var text = document.getElementById("task-text")
//第二栏新增任务按钮
    function addText(){
        var addTwo = document.getElementById("add-two")
        addTwo.onclick = function(){

            if(!system.activeNode || system.activeNode.nodeName !== "LI"){
                alert("请选择一个任务")
            }
            else{
                var now = new Date()
                var nowT = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
                title.value = nowT
                time.value = nowT
                text.value = "在此任务内容"
                var contents = document.getElementById("contents")
                //去掉第三栏时间戳，区分修改和增添两个动作
                if(contents.getAttribute("text")){
                    contents.setAttribute("text","")
                }
                //修改编辑内容区显示状态
                var edit = document.getElementById("edit")
                edit.innerHTML = "新增任务"
                localStorage.text = system.mainContent.innerHTML
            }
        }
    }
    addText()

//第三栏新增编辑任务按钮（笔状图标）
    function addToList(){
        var addList = document.getElementsByClassName("pen")[0]
        addList.onclick = function(){
            if(!system.activeNode || system.activeNode.nodeName !== "LI"){
                alert("请选择一个任务")
            }
            else if(!title.value){
                alert("请输入标题")
            }
            else if(!time.value){
                alert("请输入日期")
            }
            else if(!text.value){
                alert("请输入内容")
            }
            else{
            //编辑按钮，将第三栏任务信息加到第二栏中
            var taskList = document.getElementById("taskLists").getElementsByTagName("ul")
            var newList = document.createElement("li")
            var newListTime = document.createElement("p")
            var newListTxt = document.createElement("p")
            var activeList = null
            var contents = document.getElementById("contents")

            function addValue(){
                newListTime.innerHTML = time.value
                newListTxt.innerHTML = title.value
                newListTxt.setAttribute("text",text.value)
            }
                    //点击添加分两种状态，一种是修改，一种是新增，下面if是修改
            if(contents.getAttribute("text")){
                var newListTime = system.activeSecond.getElementsByTagName("p")[0]
                var newListTxt = system.activeSecond.getElementsByTagName("p")[1]
                addValue()
                localStorage.text = system.mainContent.innerHTML
                return
            }
                //这里是新增状态
                newListTime.className = "do-time"
                newListTxt.className ="describe"
                newList.appendChild(newListTime)
                newList.appendChild(newListTxt)
                addValue()
            for(var i= 0,j=taskList.length;i<j;i++){
                    if(taskList[i].getAttribute("task") == system.activeNode.getAttribute("task")){
                        taskList[i].appendChild(newList)
                        system.appearText()
                        //给个时间戳用于在第三栏修改
                        var newTime = new Date().getTime()
                        newList.setAttribute("text",newTime)
                        localStorage.text = system.mainContent.innerHTML
                    }
                }
            }
        }

    }
    addToList()

    //第三栏改变任务状态（完成，未完成，已完成）按钮
    function completeStatus(){
        var finish = document.getElementsByClassName("add-content")[0]
        finish.onclick = function(){
            if(!system.clickSecond){
                alert("请选中一个已增添的任务")
                return
            }
            system.clickSecond.setAttribute("complete","completed")
            system.status.onclick()
            localStorage.text = system.mainContent.innerHTML
        }
    }
    completeStatus()


}
system.select()

//点击文件显示第二栏所属任务
system.appear = function(){
    var taskList = document.getElementById("taskLists").getElementsByTagName("ul")
    for(var i= 0,j=taskList.length;i<j;i++){
        taskList[i].style.display = "none"
        if(taskList[i].getAttribute("task") == system.activeNode.getAttribute("task")){
            taskList[i].style.display = "block"
        }
    }
}

//点击文件夹显示第二栏所属所有任务
system.appearAll = function(elements){
    var taskList = document.getElementById("taskLists").getElementsByTagName("ul")
    var allList =  elements.getElementsByTagName("li")
    for(var i= 0,j=taskList.length;i<j;i++){
        taskList[i].style.display = "none"
        for(var x= 0,y=allList.length;x<y;x++){
            if(taskList[i].getAttribute("task") == allList[x].getAttribute("task")){
                taskList[i].style.display = "block"
            }
        }
    }
}

//存储第二栏点击的按钮
system.activeSecond = null
//点击第二栏列表显示第三栏任务
system.appearText = function(){
    var title = document.getElementById("task-title")
    var time = document.getElementById("task-time")
    var text = document.getElementById("task-text")
    var lists = document.getElementById("taskLists").getElementsByTagName("li")
    var contents = document.getElementById("contents")
    for(var i= 0,j=lists.length;i<j;i++){
        lists[i].onclick = function(){
            system.activeSecond = this
            var info = this.getElementsByTagName("p")
            var newListTime = info[0]
            var newListTxt = info[1]
            time.value =newListTime.innerHTML
            title.value= newListTxt.innerHTML
            text.value = newListTxt.getAttribute("text")

            //给第三栏加上第二栏的时间戳
            contents.setAttribute("text",this.getAttribute("text"))
            //点击第二栏背景变色
            system.bgChange(this)
            //修改编辑内容区显示状态
            var edit = document.getElementById("edit")
            edit.innerHTML = "修改任务"
        }
    }
}
system.appearText()

//存储第二栏点击的节点
system.clickSecond = null
//点击第二栏背景变色
system.bgChange = function(element){
    var tasksLi = document.getElementById("taskLists").getElementsByTagName("li")
    for(var i= 0,j=tasksLi.length;i<j;i++){
        var doTime = tasksLi[i].getElementsByTagName("p")
        doTime[0].className = "do-time"
    }
    element.getElementsByTagName("p")[0].className = "timeChange"
    //存储第二栏点击的节点
    system.clickSecond  = element.getElementsByTagName("p")[0].parentNode

}


//刷新页面默认点击默认任务
system.default = function(){
    var defaultTask = document.getElementById("defaultTask")
    defaultTask.onclick()
}
system.default()

//点击完成和未完成
//存储点击状态
system.status = null
system.complete = function(){
    var all = document.getElementById("all")
    var completed = document.getElementById("completed")
    var doing = document.getElementById("doing")

    var completes = document.getElementsByClassName("complete")[0].getElementsByTagName("input")

    function changeBg(element){
        for(var i= 0,j=completes.length;i<j;i++){
            removeClass(completes[i],"select-active")
        }
        addClass(element,"select-active")
    }

    all.onclick = function(){
        //存储点击状态
        system.status = this
        changeBg(this)
        changeStatus()
    }
    all.onclick()

    completed.onclick = function(){
        system.status = this
        changeBg(this)
        changeStatus("completed")
    }

    doing.onclick = function(){
        system.status = this
        changeBg(this)
        changeStatus("doing")
    }

    //改变任务完成状态
    function changeStatus(status){
        var taskList = document.getElementById("taskLists").getElementsByTagName("ul")
        for(var i= 0,j=taskList.length;i<j;i++){
            if(taskList[i].style.display == "block"){
                var tasks = taskList[i].getElementsByTagName("li")
                if(status){
                    for(var x= 0,y=tasks.length;x<y;x++){
                        tasks[x].style.display = "none"
                        if(status =="completed"){
                            if( tasks[x].getAttribute("complete") == "completed"){
                                tasks[x].style.display = "block"
                            }
                        }
                        else{
                            if( tasks[x].getAttribute("complete") !== "completed"){
                                tasks[x].style.display = "block"
                            }
                        }
                    }
                }
                else{
                    for(var x= 0,y=tasks.length;x<y;x++){
                        tasks[x].style.display = "block"
                    }
                }
            }
        }
    }

}
system.complete()





