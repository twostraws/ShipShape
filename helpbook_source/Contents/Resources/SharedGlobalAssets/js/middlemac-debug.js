/* Highlight text that looks like broken markdown reference links. */

/* Courtesy Dimitar Nikovski */
function runAfterElementExists(jquery_selector, callback) {
    var checker = window.setInterval(function() {

    if ($(jquery_selector).length) {

        clearInterval(checker);
        callback();
    }}, 200);
}

runAfterElementExists(".topic-page", function() {
   var pattern = /(\[.*?\]\[.*?\])/g;
   var element = document.getElementsByClassName('topic-page')[0];
   var inner = element.innerHTML;
   var newString = inner.replace(pattern, "<span style='background-color: yellow'>$&</span>");
   element.innerHTML = newString;
});