/**
 * Created by dtwar on 06.03.2017.
 */
var csInterface = new CSInterface();
var gExtensionId = "com.spreadkreator";
var selectedFiles = [];
var animationSpeed = 'fast';


Persistent(false); // change to true for persistent panel


var devTools = {
    enabled: true,
    writelog: function (msg) {

        if (!this.enabled)return;
        console.log(this.gettime() + " - " + msg);
    },
    gettime: function () {
        var currentdate = new Date();
        return currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + ":" + currentdate.getMilliseconds();
    }

};


