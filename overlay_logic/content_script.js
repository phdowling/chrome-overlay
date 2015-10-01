console.log("Content script executing.");

overlayDiv = $('<div id="overlay"/>');
/* TODO: asynchronously add our content to overlay div element
  The idea is that the content is loaded only the first time the extension icon is clicked.
  Beyond that, content is not changed (except maybe refreshing), but the overlay is simply hidden or re-added.
*/

function displayOverlay() {
  console.log("Adding overlay to page.")
  $("body").prepend(overlayDiv);
};

function removeOverlay(){
  console.log("Removing overlay!");
  $("#overlay").detach();
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (request.message == "close overlay"){
      removeOverlay();
      sendResponse({message: "goodbye!"});
    } else if (request.message == "open overlay") {
      displayOverlay();
      sendResponse({message: "hello!"});
    }
  }
);
