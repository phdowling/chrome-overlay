initialized = {};
overlayed = {};

// When the action icon is clicked, we need to show or hide the overlay
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    tabId = tabs[0].id;
    if(!initialized[tabId]){
      // This is the first time the icon was clicked for the current tab, initialize content script
      initializeOverlay(tabId);
    }else{
      // Content script is running, we just need to tell it to show or hide the overlay
      toggleOverlayVisibility(tabId);
    }
  });
});

// when the URL changes or the page is refreshed, both initialized and overlayed need to change to false for that tab
chrome.webNavigation.onCommitted.addListener(function(details){
  if(details.frameId == 0){ // only reset if the nav is tab-level
    resetTabOverlayState(details.tabId);
  }
});

function initializeOverlay(tabId){
  console.log('Adding first overlay to page!');
  chrome.tabs.insertCSS(tabId, {file: "style/style.css"}, function(){
    executeScripts(tabId,[
      { file: "jquery/jquery-2.1.4.min.js" },
      { file: "overlay_logic/content_script.js" }
    ], function(){
      openOverlay(tabId);
      console.log("Overlay loaded and opened.");
      initialized[tabId] = true;
      overlayed[tabId] = true;
    });
  });
}

function resetTabOverlayState(tabId){
  console.log("Setting tab " + details.tabId + " to uninitialized.")
  initialized[tabId] = false;
  overlayed[tabId] = false;
}

function toggleOverlayVisibility(tabId){
  if(overlayed[tabId]){
    closeOverlay(tabId);
  }else{
    openOverlay(tabId);
  }
}

function openOverlay(tabId) {
  sendMessageToTab(tabId, "open overlay")
  overlayed[tabId] = true;
}

function closeOverlay(tabId) {
  sendMessageToTab(tabId, "close overlay")
  overlayed[tabId] = false;
}

function sendMessageToTab(tabId, message_){
  console.log("Sending message '" + message_ + "' to tab " + tabId);
  chrome.tabs.sendMessage(
    tabId,
    {message: message_},
    function(response) {
      console.log("Response: '" + response.message + "'");
    }
  );
}

function executeScripts(tabId, injectDetailsArray, callback){
    function createCallback(tabId, injectDetails, innerCallback) {
      return function () {
        chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
      };
    }
    for (var i = injectDetailsArray.length - 1; i >= 0; --i){
      callback = createCallback(tabId, injectDetailsArray[i], callback);
    }
    if (callback !== null){
      callback();   // execute outermost function
    }
}
