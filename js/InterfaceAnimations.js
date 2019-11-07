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