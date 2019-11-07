/**
 * Created by dtwar on 06.03.2017.
 */
function onImageDragStart(event) {
    // console.log(event);
    // var dt = event.dataTransfer;
    // dt.setData("text", "demo text");
    // dt.setDragImage(img, 0, 0);
    // // imageData.code = '{image:5000001}';
    // // imageData.type = $(event.currentTarget).attr("source-file-type");
    // // imageData.src = (new CSInterface).getSystemPath(SystemPath.EXTENSION) + $(event.currentTarget).attr("source-file");
    // // event.dataTransfer.setData("text/plain", imageData.code);
    // //
    // // imageData.offsetX = event.offsetX;
    // // imageData.offsetY = event.offsetY;
    //
    // //ev.dataTransfer.setDragImage(ev.target,100,100);
    //
    // console.log('start');
    // return true;
}
function onImageDragEnd(event) {
    // console.log("DragEnd:");
    // console.log(ev);//
    // var script = 'loadImage("' + 100 + ', ' + 100 + ', ' + 7087 + ', ' + 3579 + ',' + imageData.src + ',images' + ')';
    //
    // console.log(script);
    // console.log(imageData);
    //
    //
    // var csLib = new CSInterface();
    // new csLib.evalScript(script, function () {
    //     //console.log("Done");
    // });
    // console.log(event);
    // console.log(event.srcElement.dataset.file);

    $(window).click(function(event) {
        console.log($(event.target));
    });
    console.log(csInterface);

    csInterface.evalScript('getinfo()', function (result) {
        var output = JSON.parse(result);
        if (output.success) {
            console.log(output);

            var result = window.cep.process.createProcess();
            console.log(result);
            if(result.err === 0){
                var pid = result.data;
                result = window.cep.process.isRunning(pid);
                if(result.data === true){
                    // running
                }
            }
        }
    });
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dragHandler(event) {

    var dt = event.dataTransfer;

    //\       dt.setData("url", typeof this.href != "undefined" ? this.href.toString().toLowerCase() : document.location.toString().toLowerCase());
    //  dt.setData("text/html", '<p>A link to a local file: <a href="../img/red.png">red.png</a></p>');
    dt.setData("application/json", 'a json string');
    // dt.setData('text/html',"aaaaaa");
//    dt.setData("custom type", 'custom data');
}