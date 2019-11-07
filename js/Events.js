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

