// document.body.style.backgroundColor="red"
console.log("Hello world!");

function displayOverlay() {
  console.log("Adding overlay to page.")
  $('<div id="overlay"/>').appendTo($("body").css("position", "relative"));
  // TODO: add business logic to overlay element
}


function removeOverlay(){
  console.log("Removing overlay!");
  $("#overlay").remove();
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.message == "remove overlay"){
      removeOverlay();
      sendResponse({message: "goodbye!"});
    }
  });

displayOverlay();
