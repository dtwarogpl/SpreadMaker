/**
 * Created by dtwar on 06.03.2017.
 */
function loadJSX(fileName) {
    var csInterface = new CSInterface();
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
    csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
}

function Persistent(inOn) {

    if (inOn) {
        var event = new CSEvent("com.adobe.PhotoshopPersistent", "APPLICATION");
    } else {
        var event = new CSEvent("com.adobe.PhotoshopUnPersistent", "APPLICATION");
    }
    event.extensionId = gExtensionId;
    csInterface.dispatchEvent(event);
}

/**
 * Created by dtwar on 06.03.2017.
 */

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



/**
 * Created by dtwar on 06.03.2017.
 */

// Spread change event - set current spread as active
csInterface.addEventListener('documentAfterActivate', function () {
    Album.deactivateSpreads();
    csInterface.evalScript('getActiveDocumentName()', function (result) {//
        var output = JSON.parse(result);
        if (output.success) {
            Album.setLayerActive(output.name);
            Album.printInfo();
        }
    });
});

// Setup the DragAndDrop listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

//ładowanie plików:
function handleFileSelect(evt) {
    FoldDropZone("40px");
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.
    for (var i = 0, f; f = files[i]; i++) {
        if ($.inArray(f.path, Album.photos) == -1) {
            Album.loadPhotos(f);
        }
    }

    Album.printPhotos(false, true);
    $('.picturesContainer').slideDown();
}
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}


var Album;
Album = {
    allVisible: false,
    spreads: [],
    params: {
        spreadsize: {
            name: "",
            dimensions: {}
        },
        outsideframe: 125,
        insideframes: 50,
        middleFrame:70
    },
    photos: [],
    printInfo: function () {
        var spreadList = $(".spreads-list");
        spreadList.empty();
        for (var i = 0, spread; spread = Album.spreads[i]; i++) {
            var ClassName;
            ClassName = spread.isActive ? "spread active" : "spread";
            var $item = $('<li class="' + ClassName + '"><span class="spread-icon"><img src="' + spread.thumb + '"></span></spa><span class="spread-name">' + spread.name + '</span></li>');
            spreadList.append($item);
        }
        $('#spread-count').html(Album.spreads.length);
        $('#album-size').html(Album.params.spreadsize.name);
    },
    loadPhotos: function (inputFile) {
        var ObjectExists = false;
        for (var i = 0, file; file = Album.photos[i]; i++) {
            if (inputFile.path == file.file.path) {
                ObjectExists = true;
            }
        }
        if (!ObjectExists) {
            var photo = {};
            photo.isInUse = false;
            photo.isOnScreen = false;
            photo.file = inputFile;
            this.photos.push(photo);
        }

    },
    printPhotos: function (isInUse, clearFirst) {
        if (clearFirst) {
            $('#imageList').empty();
        }
        for (var i = 0, f; f = this.photos[i]; i++) {//
            if (f.isInUse == isInUse) {
                var span = document.createElement('span');
                console.log(f.file.path);
                span.innerHTML = ['<img class="imagePrev"  ondragstart="dragHandler(event)" ondragend="onImageDragEnd(event)" draggable="true" src="', f.file.path, '" data-file="'+f.file.path+'"/>'].join('');
                //  span.innerHTML = ['<div class="imagePrev" ondragstart="onImageDragStart(event)"ondragend="onImageDragEnd(event)" draggable="true" src="', f.file.path, '"></div'].join('');
                document.getElementById('imageList').insertBefore(span, null);
                f.isOnScreen = true;
            }
        }
    },
    deactivateSpreads: function () {
        for (var i = 0, spread; spread = Album.spreads[i]; i++) {
            spread.isActive = false;
        }
    },
    setLayerActive: function (spreadName) {
        var success = false;
        for (var i = 0, spread; spread = Album.spreads[i]; i++) {
            if (spread.name == spreadName) {
                spread.isActive = true;
                success = !success;
            }
        }
        if (!success) {
            console.log("[setLayerActive]: podano błędną nazwę rozkładówki lub projekt nie zawiera rozładówki o nazwie: " + spreadName);
            // todo: Dodać obsługę plików które nie są plikami projektu, dodać je do okna properties jako "inne"
        }
    },
    updateParams: function (name, width, height) {
        this.params.spreadsize.name = name;
        this.params.spreadsize.dimensions.width = width;
        this.params.spreadsize.dimensions.height = height;

        // todo: dorobić weryfikację parametów
    }
};



var Templates = {
    TemplateArray: {},
    loadTemplates: function (templatesFilePath) {
        //  var templatesFilePath = csInterface.getSystemPath(SystemPath.EXTENSION) + "/templates/templates.json";
        $.getJSON(templatesFilePath, function (data) {
            Templates.TemplateArray = data;
            Templates.printTemplatesSizes(data)
        })
    },
    printTemplatesSizes: function (data) {
        for (var i = 0; i < data.template_categories.length; i++) {
            $(document.createElement('div'));
            $('<div/>', {
                'data-id': i,
                'data-size': data.template_categories[i].name,
                'class': 'template-size-option',
                'html': '<div class="template-size-thumb"></div><div class="template-size-name"' + '>' + data.template_categories[i].name + '</div>'
            }).appendTo('#spread-size-options');
        }

    },

    showAvailableTemplates: function (count, spreadSize, SystemPath) {
        $('#template-items').empty();
        for (var i = 0, size_group; size_group = Templates.TemplateArray.template_categories[i]; i++) {
            if (size_group.name == spreadSize) {

                for (var j = 0, quantity_group; quantity_group = size_group.quantity_categories[j]; j++) {
                    if (quantity_group.quantity == count) {
                        for (var k = 0, template; template = quantity_group.templates[k]; k++) {
                            var previev = SystemPath + "/templates/" + size_group.name + "_" + quantity_group.quantity + "_" + template.id + ".png";
                            $('<div/>', {
                                'id': '',
                                'class': 'template-size-thumb',
                                'data-category': i,
                                'data-quantity_group': j,
                                'data-template_id': k,
                                'html': '<img src="' + previev + '">'
                            }).appendTo('#template-items');
                        }
                    }
                }
            }
        }
    },
    getParamsById: function (name) {
        try {
            return {
                width: this.TemplateArray.template_categories[name].page_size.width,
                height: this.TemplateArray.template_categories[name].page_size.height
            };
        }
        catch (error) {
            console.log("Templates.[getParamsById] : Template category: " + name + " not found");
        }
    }
};


(function () {
    'use strict';
    loadJSX("json2.js");
    loadJSX("functions.jsx");
    Templates.loadTemplates( csInterface.getSystemPath(SystemPath.EXTENSION) + "/templates/templates.json");
}());



function showPanel(panelName) {
    panelName = "." + panelName;
    $(panelName).fadeIn();
}

function hidePanel(panelName, toshowName) {
    panelName = "." + panelName;
    $(panelName).fadeOut(animationSpeed, function () {
        showPanel(toshowName);
    });
}

function FoldDropZone(height) {
    $('#drop_zone').animate({
        height: height
    }, 1000);
}

function showLoader() {
    showPanel(".loader");
}
function hideLoader() {
    $('.loader').fadeOut();
}


function hidePanels() {
    $('.panel').hide();
}
/**
 * Created by dtwar on 06.03.2017.
 */


//Hide welcome panel
$('.start-button').on('click', function () {
    $('.welcome-screen').fadeOut(animationSpeed, function () {
        showPanel('top');
        showPanel('albumParameters');
        showPanel('sizePanel');
    });
});

// show Properties panel
$('.menu').on('click', function () {
    $(this).toggleClass('active-menu');
    $('#properties').fadeToggle();
});

// Close Properties panel
$('.close-button').on('click', function () {
    $('#properties').fadeOut();
});

// Set album's frames values
$('#outframeInput').on("change mousemove", function () {
    var value = $(this).val();
    $('#outFrameValue').html(value + 'px');
    Album.params.outsideframe = parseInt(value);
});
$('#insideframeInput').on("change mousemove", function () {
    var value = $(this).val();
    $('#inFrameValue').html(value + 'px');
    Album.params.insideframes = parseInt(value);
});
$('#middleframeInput').on("change mousemove", function () {
    var value = $(this).val();
    $('#middleFrameValue').html(value + 'px');
    Album.params.middleFrame = parseInt(value);
});

// User defines the size of spreads in current album
$('#spread-size-options').on('click', '.template-size-option', function () {
    hidePanel('albumParameters');
    hidePanel('sizePanel', 'uploader');
    $(this).toggleClass('option-active');
    var name = $(this).attr('data-size');
    var params = Templates.getParamsById($(this).attr('data-id'));
    if (params != null) {
        Album.updateParams(name, params.width, params.height);
        Album.printInfo();
    }
});

// Set clicked spread as active to be shown at Properties panel
$('.spreads-list').on('click', '.spread-name', function () {
    var sName = $(this).html();
    var Command = {
        name: sName
    };
    for (var i = 0, spread; spread = Album.spreads[i]; i++) {
        spread.isActive = spread.name == sName;
    }
    csInterface.evalScript('switchSpread' + '(' + JSON.stringify(Command) + ')', function (result) {//
        var output = JSON.parse(result);
        if (output.success) {
            Album.printInfo();
        }
    });
});

// click on image thumbnails > show available templates (refering to quantity of selected files)
$('#imageList').on('click', '.imagePrev', function () {
    var that = $(this);

    var path = that.attr('src');
    if (!that.hasClass('imageSelected')) {
        that.addClass('imageSelected');
        selectedFiles.push(path);
    }
    else {
        that.removeClass('imageSelected');
        var index = selectedFiles.indexOf(path);
        selectedFiles.splice(index, 1);
    }
    showPanel('available-templates');
    Templates.showAvailableTemplates(selectedFiles.length, Album.params.spreadsize.name, csInterface.getSystemPath(SystemPath.EXTENSION))
});

// show Hide used photos //todo: tutaj błędnie to działa, po dodaniu kolejnych zdjeć znika parametr active z wcześniej oznaczonych (tylko na ekranie)
$('#usedPhotosOption').on('click', function () {
    if (!Album.allVisible) {
        Album.printPhotos(false, true);
        Album.printPhotos(true, false);
        Album.allVisible = true;
    }
    else {
        Album.printPhotos(false, true);
        Album.allVisible = false;
    }
});

// Create Spread
$('#template-items').on('click', '.template-size-thumb', function () {
    var spread = {};
    spread.Template = Templates.TemplateArray.template_categories[$(this).attr('data-category')].quantity_categories[$(this).attr('data-quantity_group')].templates[$(this).attr('data-template_id')];
    console.log(spread.Template);
    var thumb = $(this).children('img').attr('src');
    var Command = {
        insideFrames: Album.params.insideframes,
        middleFrame: Album.params.middleFrame,
        outsideFrame: Album.params.outsideframe,
        name: "Rozkładowka nr " + parseInt(Album.spreads.length + 1),
        size: Album.params.spreadsize.dimensions,
        files: selectedFiles,
        imageSets: spread.Template.sets
    };

    for (var i = 0, image; image = selectedFiles[i]; i++) {
        for (var j = 0, photo; photo = Album.photos[j]; j++) {
            if (image == photo.file.path) {
                photo.isInUse = true;
            }
        }
    }

    csInterface.evalScript('createSpread' + '(' + JSON.stringify(Command) + ')', function (result) {
        var output = JSON.parse(result);
        if (output.success) {
            spread.thumb = thumb;
            spread.name = Command.name;
            Album.spreads.push(spread);
            Album.printInfo();
            Album.printPhotos(false, true);
            selectedFiles = [];
            Templates.showAvailableTemplates(0);
        }
    });

    
    showPanel('actions');

});

// todo: COTO?
$('.thumbPrev').on('click', function () {
    hidePanels();
    showPanel('.uploader');
    showPanel('.size_templates');
});


$('#swapImages').on('click', function () {
   

     console.log("swapImages");
    csInterface.evalScript('swapImages' + '(' + ')', function (result) {
       
       
    });
    
  
});
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