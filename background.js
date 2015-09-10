// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.
overlayed = {};
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or  host permissions needed!
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    console.log("Clicked!");
    if(!(overlayed[tabs[0].id] || false)){
      console.log('Adding overlay to page!');

      chrome.tabs.insertCSS(tabs[0].id, {file: "style/style.css"}, function(){
        chrome.tabs.executeScript(tabs[0].id, { file: "jquery/jquery-2.1.4.min.js" }, function() {
          chrome.tabs.executeScript(tabs[0].id, { file: "overlay_logic/content_script.js" });
        });
      });

      console.log("Overlay loaded.");
      overlayed[tabs[0].id] = true;

    }else{
      console.log("Telling overlay to close.");
      chrome.tabs.sendMessage(
        tabs[0].id,
        {message: "remove overlay"},
        function(response) {
          console.log(response.message);
        }
      );
      overlayed[tabs[0].id] = false;
    }
  });
});
