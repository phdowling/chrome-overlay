// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.
overlayed = false;
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or  host permissions needed!
  console.log("Clicked!");
  if(!overlayed){
    console.log('Adding overlay to page!');
    chrome.tabs.insertCSS(null, {file: "style/style.css"}, function(){
      chrome.tabs.executeScript(null, { file: "jquery/jquery-2.1.4.min.js" }, function() {
        chrome.tabs.executeScript(null, { file: "overlay_logic/content_script.js" });
      });
    });
    console.log("Overlay loaded.");
    overlayed = true;

  }else{
    console.log("Telling overlay to close.");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(
        tabs[0].id,
        {message: "remove overlay"},
        function(response) {
          console.log(response.message);
        }
      );
    });
    overlayed = false;
  }

});
