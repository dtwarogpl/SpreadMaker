app.preferences.rulerUnits = Units.PIXELS;
var pBar;
function createPage(width, height, name) {
    var page = app.documents.add(width, height, 300, name, NewDocumentMode.RGB, DocumentFill.WHITE);
    var obj = {success: true};
    return JSON.stringify(obj);
}
function createProgressBar() {
    pBar = new createProgressWindow("Tworzę rozkładówkę", "Zaczekaj proszę", false);
}
function updateProgressBar(value) {
    pBar.updateProgress(value, "Wykonano:, " + parseInt(value) + "%");
}
function createSpread(input) {
    createProgressBar();
    createPage(input.size.width, input.size.height, input.name);
    var layers = app.activeDocument.layerSets.add();
    layers.name = "files";
    var totalImagesCount = 0;
    for (var s = 0, set; set = input.imageSets[s]; s++) {
        var setLayerSet = layers.layerSets.add();
        setLayerSet.name = 'group_' + set.setId;

        for (var i = 0; i < set.images.length; i++) {
            var frame = input.insideFrames;
            var file = input.files[totalImagesCount];
                 var position = set.images[i].position;

            var a = input.middleFrame;
            var x = set.images[i].x;
            var y = set.images[i].y;
            var w = set.images[i].w;
            var h = set.images[i].h;
               if (position == "left") {
                   a = -input.middleFrame / 2;
               }
               if (position == "right"){
                   a = input.middleFrame / 2
               }
            if (position == "center"){
                a = 0;
            }


            loadImage(x + a, y, input.size.width, input.size.height, file, setLayerSet);
            app.activeDocument.activeLayer.name = "layer_" + i;
            scaleLayer(w, h);
            CreateMask(x + a, y, w, h, set.images[i].scale, frame,set.scale);
            totalImagesCount++;
            updateProgressBar((((totalImagesCount) * 100) / input.files.length));
        }
        setLayerSet.resize(set.scale, set.scale, AnchorPosition.MIDDLECENTER);
    }


    var scaleParam = ((input.size.width - (2 * input.outsideFrame)) / input.size.width) * 100;
    layers.resize(scaleParam, scaleParam, AnchorPosition.MIDDLECENTER);
    var f = input.outsideFrame;
    var width = input.size.width;
    var height = input.size.height;


    var maskSelection = [[f, f], [(width) - f, f], [(width) - f, (height) - f], [f, (height) - f]];
    app.activeDocument.activeLayer = app.activeDocument.layerSets.getByName("files");
    app.activeDocument.selection.select(maskSelection);
    makeLayerMask('RvlS');
    pBar.close();

    var obj = {success: true};
    return JSON.stringify(obj);

}
function getinfo(){

    var idslct = charIDToTypeID( "slct" );
    var desc2 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref2 = new ActionReference();
    var idmoveTool = stringIDToTypeID( "moveTool" );
    ref2.putClass( idmoveTool );
    desc2.putReference( idnull, ref2 );
    var iddontRecord = stringIDToTypeID( "dontRecord" );
    desc2.putBoolean( iddontRecord, true );
    var idforceNotify = stringIDToTypeID( "forceNotify" );
    desc2.putBoolean( idforceNotify, true );
    executeAction( idslct, desc2, DialogModes.NO );




    var obj = {success: true};
    return JSON.stringify(obj);
}

function loadImage(x, y, PageWidth, PageHeight, file, layerSetName) {
    var xInsert = x - (PageWidth / 2);
    var yInsert = y - (PageHeight / 2);
    var idPlc = charIDToTypeID("Plc ");
    var desc11 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var idPlc = charIDToTypeID("Plc ");
    var desc69 = new ActionDescriptor();
    var idIdnt = charIDToTypeID("Idnt");
    desc69.putInteger(idIdnt, 2);
    var idnull = charIDToTypeID("null");
    desc69.putPath(idnull, new File(file));
    var idFTcs = charIDToTypeID("FTcs");
    var idQCSt = charIDToTypeID("QCSt");
    var idQcsa = charIDToTypeID("Qcsa");
    desc69.putEnumerated(idFTcs, idQCSt, idQcsa);
    var idOfst = charIDToTypeID("Ofst");
    var desc70 = new ActionDescriptor();
    var idHrzn = charIDToTypeID("Hrzn");
    var idPxl = charIDToTypeID("#Pxl");
    desc70.putUnitDouble(idHrzn, idPxl, xInsert);
    var idVrtc = charIDToTypeID("Vrtc");
    var idPxl = charIDToTypeID("#Pxl");
    desc70.putUnitDouble(idVrtc, idPxl, yInsert);
    var idOfst = charIDToTypeID("Ofst");
    desc69.putObject(idOfst, idOfst, desc70);
    executeAction(idPlc, desc69, DialogModes.NO);
    app.activeDocument.activeLayer.move(layerSetName, ElementPlacement.INSIDE);
    //  app.activeDocument.activeLayer.move(app.activeDocument.layerSets.getByName(layerSetName), ElementPlacement.INSIDE);
    //
    //

//
    //
    // if (input.progress >= 100) {
    //
    // }
    // var obj = {success: true};
    // return JSON.stringify(obj);
}

function scaleLayer(width, height) {
    var layer = app.activeDocument.activeLayer;
    var layerBounds = layer.bounds;

    var layerWidth = layerBounds[2].value - layerBounds[0].value;
    var layerHeight = layerBounds[3].value - layerBounds[1].value;
    var scale1 = (width / layerWidth) * 100;
    var scale2 = (height / layerHeight) * 100;

    if (scale1 > scale2) {
        layer.resize(scale1, scale1, AnchorPosition.MIDDLECENTER);
    } else {
        layer.resize(scale2, scale2, AnchorPosition.MIDDLECENTER);
    }
}

function CreateMask(x, y, width, height, scaleOrientation, framewidth,setscale) {
    var selRegion;
    var AX = x - width / 2;
    var AY = y - height / 2;
    var BX = x + width / 2;
    var BY = y - height / 2;
    var CX = x + width / 2;
    var CY = y + height / 2;
    var DX = x - width / 2;
    var DY = y + height / 2;



    var scaleParam=1;
    if(setscale!=100){
        scaleParam=(2-setscale/100);
    }



    var frame = (framewidth / 2)*scaleParam;
    switch (scaleOrientation) {
        case "top-left":
            selRegion = [[AX, AY], [BX - frame, BY], [CX - frame, CY - frame], [DX, DY - frame]];
            break;
        case "bottom-left":
            selRegion = [[AX, AY + frame], [BX - frame, BY + frame], [CX - frame, CY], [DX, DY]];
            break;
        case "top-right":
            selRegion = [[AX + frame, AY], [BX, BY], [CX, CY - frame], [DX + frame, DY - frame]];
            break;
        case "right-bottom":
            selRegion = [[AX + frame, AY + frame], [BX, BY + frame], [CX, CY], [DX + frame, DY]];
            break;
        case "bottom":
            selRegion = [[AX + frame, AY + frame], [BX - frame, BY + frame], [CX - frame, CY], [DX + frame, DY]];
            break;
        case "top":
            selRegion = [[AX + frame, AY], [BX - frame, BY], [CX - frame, CY - frame], [DX + frame, DY - frame]];
            break;
        case "right":
            selRegion = [[AX + frame, AY + frame], [BX, BY + frame], [CX, CY - frame], [DX + frame, DY - frame]];
            break;
        case "left":
            selRegion = [[AX, AY + frame], [BX - frame, BY + frame], [CX - frame, CY - frame], [DX, DY - frame]];
            break;
        case "top-right-bottom":
            selRegion = [[AX + frame, AY], [BX, BY], [CX, CY], [DX + frame, DY]];
            break;
        case "top-right-left":
            selRegion = [[AX, AY], [BX, BY], [CX, CY - frame], [DX, DY - frame]];
            break;
        case "right-bottom-left":
            selRegion = [[AX, AY + frame], [BX, BY + frame], [CX, CY], [DX, DY]];
            break;
        case "top-bottom-left":
            selRegion = [[AX, AY], [BX - frame, BY], [CX - frame, CY], [DX, DY]];
            break;
        case "none":
            selRegion = [[AX + frame, AY + frame], [BX - frame, BY + frame], [CX - frame, CY - frame], [DX + frame, DY - frame]];
            break;
        default:
            alert('błędny rodzaj skalowania: ' + scaleOrientation);
            selRegion = [[AX, AY], [BX, BY], [CX, CY], [DX, DY]];
    }


    app.activeDocument.selection.select(selRegion);
    makeLayerMask('RvlS');
    app.activeDocument.selection.deselect();
    //unlinkMask();
}

function makeLayerMask(maskType) {
    if (maskType == undefined) maskType = 'RvlS'; //from selection
    //requires a selection 'RvlS'  complete mask 'RvlA' otherThanSelection 'HdSl'
    var desc140 = new ActionDescriptor();
    desc140.putClass(charIDToTypeID('Nw  '), charIDToTypeID('Chnl'));
    var ref51 = new ActionReference();
    ref51.putEnumerated(charIDToTypeID('Chnl'), charIDToTypeID('Chnl'), charIDToTypeID('Msk '));
    desc140.putReference(charIDToTypeID('At  '), ref51);
    desc140.putEnumerated(charIDToTypeID('Usng'), charIDToTypeID('UsrM'), charIDToTypeID(maskType));
    executeAction(charIDToTypeID('Mk  '), desc140, DialogModes.NO);
}


function unlinkMask() {
    var idsetd = charIDToTypeID("setd");
    var desc67 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref51 = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref51.putEnumerated(idLyr, idOrdn, idTrgt);
    desc67.putReference(idnull, ref51);
    var idT = charIDToTypeID("T   ");
    var desc68 = new ActionDescriptor();
    var idUsrs = charIDToTypeID("Usrs");
    desc68.putBoolean(idUsrs, false);
    var idLyr = charIDToTypeID("Lyr ");
    desc67.putObject(idT, idLyr, desc68);
    executeAction(idsetd, desc67, DialogModes.NO);
}


switchSpread = function (input) {
    app.activeDocument = app.documents.getByName(input.name);
    var obj = {success: true};
    return JSON.stringify(obj);
};

getActiveDocumentName = function () {
    var DocName = app.activeDocument.name;
    var obj = {
        success: true,
        name: DocName
    };
    return JSON.stringify(obj);
};

createProgressWindow = function (title, message, hasCancelButton) {
    var win;
    if (title == null) {
        title = "Work in progress";
    }
    if (message == null) {
        message = "Please wait...";
    }
    if (hasCancelButton == null) {
        hasCancelButton = false;
    }
    win = new Window("palette", "" + title, undefined);
    win.bar = win.add("progressbar", {
        x: 20,
        y: 12,
        width: 300,
        height: 20
    }, 0, 100);
    win.stMessage = win.add("statictext", {
        x: 10,
        y: 36,
        width: 320,
        height: 20
    }, "" + message);
    win.stMessage.justify = 'center';
    if (hasCancelButton) {
        win.cancelButton = win.add('button', undefined, 'Cancel');
        win.cancelButton.onClick = function () {
            win.close();
            throw new Error('User canceled the pre-processing!');
        };
    }
    this.reset = function (message) {
        win.bar.value = 0;
        win.stMessage.text = message;
        return win.update();
    };
    this.updateProgress = function (perc, message) {
        if (perc != null) {
            win.bar.value = perc;
        }
        if (message != null) {
            win.stMessage.text = message;
        }
        return win.update();
    };
    this.close = function () {
        return win.close();
    };
    win.center(win.parent);
    return win.show();
};


function swapImages() {
    alert("dupa");
    selectedLayers = getSelectedLayersIdx();

    if (selectedLayers.length > 2 || selectedLayers.length < 2) {
        alert("Musisz zaznaczyć 2 warstwy");
    }

    else {

        var layer_number = app.activeDocument.layers.length - eval(selectedLayers[0]);
        var firstLayerName = app.activeDocument.layers[layer_number - 1].name
        var firstLayer = app.activeDocument.artLayers.getByName(firstLayerName);
        var layer_number = app.activeDocument.layers.length - eval(selectedLayers[1]);
        var secondLayerName = app.activeDocument.layers[layer_number - 1].name
        var secondLayer = app.activeDocument.artLayers.getByName(secondLayerName);


//var firstLayer=app.activeDocument.artLayers.getByName(selectedLayers[0]);
//var firstLayerName =selectedLayers[0];
//    
//var secondLayer=app.activeDocument.artLayers.getByName(selectedLayers[1]);
//var secondLayerName =selectedLayers[1];    

        app.activeDocument.activeLayer = firstLayer;
        selectLayerMask();
        deleteLayerMask();

        app.activeDocument.activeLayer = secondLayer;
        selectLayerMask();
        deleteLayerMask();

        var newNumber = firstLayer.name.substring(6);
        var oldNumber = secondLayer.name.substring(6);


        var deltaX = imgArray[newNumber][0] - imgArray[oldNumber][0];
        var deltaY = imgArray[newNumber][1] - imgArray[oldNumber][1];
        secondLayer.translate(deltaX, deltaY);


        app.activeDocument.activeLayer = secondLayer;
        scale(newNumber);
        select(newNumber);


        var newNumber = secondLayer.name.substring(6);
        var oldNumber = firstLayer.name.substring(6);


        var deltaX = imgArray[newNumber][0] - imgArray[oldNumber][0];
        var deltaY = imgArray[newNumber][1] - imgArray[oldNumber][1];
        firstLayer.translate(deltaX, deltaY);

        app.activeDocument.activeLayer = firstLayer;
        scale(newNumber);
        select(newNumber);


        firstLayer.name = "image_" + newNumber;
        secondLayer.name = "image_" + oldNumber;

    }
    var obj = {
        success: true
    };
    return JSON.stringify(obj);
}
