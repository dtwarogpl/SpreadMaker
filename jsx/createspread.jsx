app.preferences.rulerUnits = Units.PIXELS;
//-------------------------------------------------------------------------------------// Parametry szablonu // --------------------------------------------------------------------------------------------------------------------------//
var frameSize;
var frameColor;
//-------------------------------------------------------------------------------------//Zmienne z xmla // -----------------------------------------------------------------------------------------------------------//
var pageWidth;
var pageHeight;
var imgArray = [];
var frameArray = [];
var frameCount;
var imgCount;

var insertx;
var inserty;
var sourceFolder;
var fileArray = [];
var page;

var result = [];
//-------------------------------------------------------------------------------------// Funkcje // ----------------------------------------------------------------------------------------------------------------//




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

function createPage(loadOption, outFrameSize, datapath, R, G, B,files) {
    getDataXml(datapath);
    frameColor = [R, G, B];
    frameSize = outFrameSize;
    page = app.documents.add(pageWidth, pageHeight, 300, "page", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layerName = "";

    if (loadOption==2){
        fileArray=files;
        for (var i = 0; i < imgCount; i++) {
            insertx = imgArray[i][0];
            inserty = imgArray[i][1];
            loadFolder(insertx, inserty, i);
            scale(i);
            select(i);
        }
    }
    if (loadOption == 1) {
        sourceFolder = Folder.selectDialog();
        fileArray = sourceFolder.getFiles();

        for (var i = 0; i < imgCount; i++) {
            insertx = imgArray[i][0];
            inserty = imgArray[i][1];
            loadFolder(insertx, inserty, i);
            scale(i);
            select(i);
        }
    }

    if (loadOption == 0) {
        for (var i = 0; i < imgCount; i++) {
            insertx = imgArray[i][0];
            inserty = imgArray[i][1];
            loadPictures(insertx, inserty, i);
            scale(i);
            select(i);
        }

    }


    //rysowanie ramki zewnętrznej
    drawOutFrame(frameSize, frameColor);
    //rysowanie ramek wewnętrznych
    for (var i = 0; i < frameCount; i++) {
        var inFrame = frameArray[i][4];
        var XP1 = frameArray[i][0];
        var YP1 = frameArray[i][1];
        var XP2 = frameArray[i][2];
        var YP2 = frameArray[i][3];
        var orient = frameArray[i][5];
        drawInFrame(inFrame, XP1, YP1, XP2, YP2, frameColor, orient, i);
    }
    //dodać skalowanie zawartości w zależności od grubości ramki zewnętrznej
    //-------------------------------------------------------------------------------------// Funkcje // -------------------------------------------------------------------------------------------------------------//

    var obj = {
        success: true,
        array:files
    };

    return JSON.stringify(obj);
}

function loadPictures(insertx, inserty, i) {
    var selectedFile = app.openDialog();
    var xInsert = insertx - (pageWidth / 2);
    var yInsert = inserty - (pageHeight / 2);
    var idPlc = charIDToTypeID("Plc ");
    var desc11 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var idPlc = charIDToTypeID("Plc ");
    var desc69 = new ActionDescriptor();
    var idIdnt = charIDToTypeID("Idnt");
    desc69.putInteger(idIdnt, 2);
    var idnull = charIDToTypeID("null");
    desc69.putPath(idnull, new File(selectedFile));
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
    app.activeDocument.activeLayer.name = "image_" + i;
}

function loadFolder(insertx, inserty, i) {
    var selectedFile = fileArray[i];
    var xInsert = insertx - (pageWidth / 2);
    var yInsert = inserty - (pageHeight / 2);
    var idPlc = charIDToTypeID("Plc ");
    var desc11 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var idPlc = charIDToTypeID("Plc ");
    var desc69 = new ActionDescriptor();
    var idIdnt = charIDToTypeID("Idnt");
    desc69.putInteger(idIdnt, 2);
    var idnull = charIDToTypeID("null");
    desc69.putPath(idnull, new File(selectedFile));
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
    app.activeDocument.activeLayer.name = "image_" + i;
}


function drawOutFrame(outFrame, frameColor) {
    var frameLayer = app.activeDocument.artLayers.add();
    frameLayer.name = "Outside Frame";
    newColor = new SolidColor;
    newColor.rgb.red = frameColor[0, 0];
    newColor.rgb.green = frameColor[0, 1];
    newColor.rgb.blue = frameColor[0, 2];

    var selRegion = Array(Array(outFrame, outFrame), Array(pageWidth - outFrame, outFrame),
        Array(pageWidth - outFrame, pageHeight - outFrame), Array(outFrame, pageHeight - outFrame));

    page.selection.select(selRegion)
    page.selection.invert();
    page.selection.fill(newColor);
    page.selection.deselect();
    var obj = {
        success: true
    };
    return JSON.stringify(obj);
}

function drawInFrame(inFrame, XP1, YP1, XP2, YP2, frameColor, orient, i) {

    var frameLayer = app.activeDocument.artLayers.add();
    frameLayer.name = "Inside Frame" + i;
    newColor = new SolidColor;
    newColor.rgb.red = frameColor[0, 0];
    newColor.rgb.green = frameColor[0, 1];
    newColor.rgb.blue = frameColor[0, 2];
    if (orient == 1) {
        var AX = XP1 - inFrame / 2;
        var AY = YP1;
        var DX = XP2 + inFrame / 2;
        var DY = YP2;
    } else {
        if (orient == 0) {
            var AX = XP1;
            var AY = YP1 - inFrame / 2;
            var DX = XP2;
            var DY = YP2 + inFrame / 2;
        }
    }
    var selRegion = Array(Array(AX, AY), Array(DX, AY),
        Array(DX, DY), Array(AX, DY));

    page.selection.select(selRegion)
    page.selection.fill(newColor);
    page.selection.deselect();
}

function scale(i) {
    var layer = page.activeLayer;
    layerBounds = page.activeLayer.bounds;

    var layerWidth = layerBounds[2].value - layerBounds[0].value;
    var layerHeight = layerBounds[3].value - layerBounds[1].value;
    var scale1 = (imgArray[i][2] / layerWidth) * 100;
    var scale2 = (imgArray[i][3] / layerHeight) * 100;

    if (scale1 > scale2) {
        layer.resize(scale1, scale1, AnchorPosition.MIDDLECENTER);
    } else {
        layer.resize(scale2, scale2, AnchorPosition.MIDDLECENTER);
    }
}

function select(i) {
    var XA = imgArray[i][0];
    var YA = imgArray[i][1];
    var w = imgArray[i][2] / 2;
    var h = imgArray[i][3] / 2;
    var selRegion = Array(Array(XA - w, YA - h), Array(XA + w, YA - h), Array(XA + w, YA + h), Array(XA - w, YA + h));
    page.selection.select(selRegion)
    makeLayerMask('RvlS')
    page.selection.deselect();
    unlinkMask();
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

function getDataXml(dataPath) {
    var file = new File(dataPath);
    file.open("r");
    var str = file.read();
    var xml = new XML(str);

    pageWidth = parseInt(xml.page.@width);
    pageHeight = parseInt(xml.page.@height);

    var images = xml.child("images");
    imgCount = parseInt(images.elements().length());

    for (var i = 0; i < imgCount; i++) {
        imgArray[i] = new Array();
        imgArray[i][0] = parseInt(xml.images.img[i].@xPosition);
        imgArray[i][1] = parseInt(xml.images.img[i].@yPosition);
        imgArray[i][2] = parseInt(xml.images.img[i].@width);
        imgArray[i][3] = parseInt(xml.images.img[i].@height);
    }


    var frames = xml.child("frames");
    frameCount = parseInt(frames.elements().length());

    for (var i = 0; i < frameCount; i++) {
        frameArray[i] = new Array();
        frameArray[i][0] = parseInt(xml.frames.frame[i].@x1);
        frameArray[i][1] = parseInt(xml.frames.frame[i].@y1);
        frameArray[i][2] = parseInt(xml.frames.frame[i].@x2);
        frameArray[i][3] = parseInt(xml.frames.frame[i].@y2);
        frameArray[i][4] = parseInt(xml.frames.frame[i].@width);
        frameArray[i][5] = parseInt(xml.frames.frame[i].@orientation);
    }

    return imgArray;

    f.close();
}

/* funkcje dla zmiany ułożenia zdjeć */

function getSelectedLayersIdx() {
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var desc = executeActionGet(ref);
    if (desc.hasKey(stringIDToTypeID('targetLayers'))) {
        desc = desc.getList(stringIDToTypeID('targetLayers'));
        var c = desc.count
        var selectedLayers = [];
        var selectedLayersNames = [];
        for (var i = 0; i < c; i++) {
            try {
                activeDocument.backgroundLayer;
                var number = desc.getReference(i).getIndex();
                var name = app.activeDocument.layers[number].name;
                selectedLayers.push(number);
                selectedLayersNames.push(name);
            }
            catch (e) {
                selectedLayers.push(desc.getReference(i).getIndex() + 1);
            }
        }
    } else {
        var ref = new ActionReference();
        ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("ItmI"));
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        try {
            activeDocument.backgroundLayer;
            selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")) - 1);
        } catch (e) {
            selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")));
        }
    }
    //return selectedLayersNames;
    return selectedLayers;
}

function selectLayerMask() {
    try {
        var id759 = charIDToTypeID("slct");
        var desc153 = new ActionDescriptor();
        var id760 = charIDToTypeID("null");
        var ref92 = new ActionReference();
        var id761 = charIDToTypeID("Chnl");
        var id762 = charIDToTypeID("Chnl");
        var id763 = charIDToTypeID("Msk ");
        ref92.putEnumerated(id761, id762, id763);
        desc153.putReference(id760, ref92);
        var id764 = charIDToTypeID("MkVs");
        desc153.putBoolean(id764, false);
        executeAction(id759, desc153, DialogModes.NO);
    } catch (e) {
    }
}

function deleteLayerMask() {
    try {
        var idDlt = charIDToTypeID("Dlt ");
        var desc6 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref5 = new ActionReference();
        var idChnl = charIDToTypeID("Chnl");
        var idOrdn = charIDToTypeID("Ordn");
        var idTrgt = charIDToTypeID("Trgt");
        ref5.putEnumerated(idChnl, idOrdn, idTrgt);
        desc6.putReference(idnull, ref5);
        executeAction(idDlt, desc6, DialogModes.NO);
    } catch (e) {
    }
}

function getColor() {

    var color = app.showColorPicker()
    var foregroundColor = app.foregroundColor;
    var red = foregroundColor.rgb.red;
    var green = foregroundColor.rgb.green;
    var blue = foregroundColor.rgb.blue;
    var colorRGB = red + "," + green + "," + blue;
    return colorRGB;
}

function delLayer(layerName) {
    try {
        var doc = app.activeDocument;
        doc.activeLayer = doc.artLayers.getByName(layerName);
        doc.activeLayer.remove();
    } catch (e) {
    }
}
function delInsideFrames() {
    var layerCount = app.activeDocument.artLayers.length;
    var layers = app.activeDocument.layers;
    for (var i = 0; i < layerCount; i++) {
        var layer = layers[i];
        var layerName = layer.name.substr(0, 6);
        if (layerName == "Inside") {
            layers[i].remove();
            i = -1;
            layerCount = layerCount - 1;
        }
    }
}

function updateInFrame(R, G, B) {
    frameColor = [R, G, B];

    for (var i = 0; i < frameCount; i++) {
        var inFrame = frameArray[i][4];
        var XP1 = frameArray[i][0];
        var YP1 = frameArray[i][1];
        var XP2 = frameArray[i][2];
        var YP2 = frameArray[i][3];
        var orient = frameArray[i][5];
        drawInFrame(inFrame, XP1, YP1, XP2, YP2, frameColor, orient, i);
    }
    var obj = {
        success: true
    };
    return JSON.stringify(obj);
}
