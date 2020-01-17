/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */


// Create block handler
async function createBlocker() {
  // Remove previous listener
  browser.webRequest.onBeforeRequest.removeListener(block);
  
  // Load URLs from storage
  let data = await browser.storage.sync.get();
  siteList = data.siteList
  sessionList = data.sessionList
  
  // Check if there are URLs to load
  if (data.siteList) {
    // Create URL fliter list
    filter = [];
    for (i = 0; i < data.siteList.length; i++) {
      if (data.siteList[i].active && sessionList[i]) {
        filter.push(data.siteList[i].url);
      }
    }

    // Create listener
    browser.webRequest.onBeforeRequest.addListener(block, {urls: filter}, ["blocking"]);
  }
}

// Handles missing data
async function checkData() {
  // Load URLs from storage
  let data = await browser.storage.sync.get();

  // Create blank URL list in storage if required
  browser.storage.sync.set({siteList: sites});

  session = [];
  for (i = 0; i < sites.length; i++) {
    session.push(true)
  }
  browser.storage.sync.set({sessionList: session});
  
  if (!data.siteList) {
    browser.storage.sync.set({isBlocking: true});
  }
}

// Toggle url blocking and icon
function toggleBlock() {
  if (browser.webRequest.onBeforeRequest.hasListener(block)) {
    browser.webRequest.onBeforeRequest.removeListener(block);
    browser.browserAction.setIcon({path: "icons/favicon-disabled.svg"});
  } else {
    browser.webRequest.onBeforeRequest.addListener(block, {urls: filter}, ["blocking"]);
    browser.browserAction.setIcon({path: "icons/favicon.svg"});
  }
}

// Handle blocked URL
function block(details) {
  return {redirectUrl: browser.runtime.getURL('/blocked/blocked.html?url=' + details.url)};
}

browser.contextMenus.create({
  id: "blocked-site-list",
  title: "Climate block",
  contexts: ['all'],
  onclick: function () {
    browser.tabs.create({url: browser.extension.getURL('options/options.html')});
  },
});

var filter = [];
createBlocker();
browser.storage.onChanged.addListener(createBlocker);
browser.browserAction.onClicked.addListener(toggleBlock);
checkData();
