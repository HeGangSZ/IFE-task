/**
 * Created by Neo on 2016/2/2.
 */
//options是一个对象，里面可以包括的参数为：
//
//type: post或者get，可以有一个默认值
//data: 发送的数据，为一个键值对象或者为一个用&连接的赋值字符串
//onsuccess: 成功时的调用函数
//onfail: 失败时的调用函数

function ajax(url, options) {
    //创建ajax对象
    var oAjax = null;
    if (window.XMLHttpRequest) {
        oAjax = new XMLHttpRequest()
    }
    else{
    oAjax = new ActiveXObject()}


    var type = options.type || "GET";
    var date = options.date || "";
    var parm = null
    var onsuccess = options.onsuccess || null
    var onfail = options.onfail || function () {
            alert(oAjax.status)
        }
    if (typeof date === "object") {
        parm = [];
        for (var k in date) {
            if (date.hasOwnProperty) {
                parm.push(k + "=" + date[k])
            }
        }
        parm = parm.join("&")
    }
    if (type == "GET") {
        oAjax.open('GET', url + "?" + parm);
        oAjax.send();
    }
    else {
        oAjax.open(type, url);
        oAjax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        oAjax.send(parm);
    }

    oAjax.onreadystatechange = function () {
        if (oAjax.readyState == 4) {     //当从服务器返回的信息解析完毕后
            if (oAjax.status == 200) {   //当服务器返回状态码为200时执行成功函数
                json = JSON.parse(oAjax.responseText)
                onsuccess(json) //responseText是解析完的文件内容
            }
            else {
                onfail(oAjax.responseText)
            }

        }
    }
}

