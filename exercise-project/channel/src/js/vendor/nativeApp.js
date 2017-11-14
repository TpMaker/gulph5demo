define(['zepto','vendor/JSBridge'],function($) {
    function connectJSBridge(callback) {
        if (window.JSBridge) {
            callback(JSBridge)
        } else {
            document.addEventListener('JSBridgeReady', function() {
                callback(JSBridge)
            }, false)
        }
    }

    $('.whiteBack,.goback').on('click',function(){
        JSBridge.callNative("Web.back", {});
    });

    connectJSBridge(function(bridge) {
        bridge.init(function(message, responseCallback) {
            console.log('JS got a message', message)
            var data = { 'Javascript Responds':'Wee!' }
            console.log('JS responding with', data)
            bridge.callEventCallback(responseCallback,data,message);
        })

        bridge.registerEvent('testJavascriptHandler', function(message, responseCallback) {
            console.log('ObjC called testJavascriptHandler with', message)
            var responseData = { 'Javascript Says':'Right back atcha!' }
            console.log('JS responding with', responseData)
            bridge.callEventCallback(responseCallback,responseData,message);
        })

        bridge.registerEvent('nativeCallEvent', function(message, responseCallback) {
            console.log('ObjC called nativeCallEvent with', message)
            var responseData = { 'Javascript Says':'What do you want?' }
            console.log('JS responding with', responseData)
            bridge.callEventCallback(responseCallback,responseData,message);
        })
    })
    return JSBridge;
});
