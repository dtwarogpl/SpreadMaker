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