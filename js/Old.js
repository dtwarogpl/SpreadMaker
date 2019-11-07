// function getFrameColor() {
//     var color = $('#colorShow').css('background-color').replace("rgb(", "").replace(')', '').split(',');
//     for (var i = 0; i < color.length; i++) {
//         color[i] = color[i].replace(' ', '');
//     }
//     return color;
//
// }
//
// function updateOutsideFrame(value) {
//     csInterface.evalScript('delLayer("Outside Frame")');
//     var colorArr = getFrameColor();
//     var updateComand = "drawOutFrame(" + value + ',' + '[' + colorArr[0] + ',' + colorArr[1] + ',' + colorArr[2] + '])';
//     csInterface.evalScript(updateComand, function (result) {
//         var o = JSON.parse(result);
//         if (o.success) {
//             hideLoader();
//         }
//     });
// }
//
//
// $('.size-button').on('click', function () {
//     $('.size-button').removeClass('active');
//     $(this).addClass('active');
//     $('.templates').slideUp();
//     var sizes = $('.' + $(this).attr('id'));
//     if (sizes.css('display') != 'block') {
//         sizes.slideDown();
//     }
// })