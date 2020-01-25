/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Create block handler
async function createBlocker() {
  // Remove previous listener 
  browser.webRequest.onBeforeRequest.removeListener(block);
  // Load URLs from storage
  let data = await browser.storage.local.get();
  
  // Check if there are URLs to load
  if (data.isBlocking && data.siteList) {
    // Create URL fliter list
    filter = [];
    for (i = 0; i < data.siteList.length; i++) {
      if (data.siteList[i].blocked && data.sessionList[i]) {
        filter.push(data.siteList[i].url);
      }
    };

    // Create listener
    if (filter.length > 0) {
      browser.webRequest.onBeforeRequest.addListener(block, {urls: filter}, ["blocking"]);
    };
  }
}

// Handles missing data
async function checkData() {
  // Load URLs from storage
  let data = await browser.storage.local.get();

  // Create blank URL list in storage if required
  if (!data.siteList) {
    browser.storage.local.set({siteList: sites});
  };

  // Reset the session list and set blocking to true
  sessionList = [];
  for (i = 0; i < sites.length; i++) {
    sessionList.push(true);
  }
  browser.storage.local.set({sessionList: sessionList, isBlocking: true});
}

// Toggle url blocking and icon
async function toggleBlocking() {
  let data = await browser.storage.local.get();
  blocked = !data.isBlocking;

  if (blocked) {
    browser.browserAction.setIcon({path: "icons/favicon.svg"});
  } else {
    browser.browserAction.setIcon({path: "icons/favicon-disabled.svg"});
  }

  // Reset the session when the icon is clicked
  sessionList = [];
  for (i = 0; i < data.siteList.length; i++) {
    sessionList.push(true)
  };
  browser.storage.local.set({sessionList: sessionList, isBlocking: blocked});
}

// Handle blocked URL
function block(details) {
  return {redirectUrl: browser.runtime.getURL('/blocked/blocked.html?url=' + details.url)};
}

function setupData() {
  createBlocker();
  browser.storage.onChanged.addListener(createBlocker);
  browser.browserAction.onClicked.addListener(toggleBlocking);
  checkData();
}

var filter = [];
setupData();
