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


