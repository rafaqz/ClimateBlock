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
  if (data.siteList) {

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

  sessionList = [];
  for (i = 0; i < sites.length; i++) {
    sessionList.push(true);
  }
  browser.storage.local.set({sessionList: sessionList});
  console.log("data updated");
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

function setupData() {
  console.log("setting up");

  browser.contextMenus.create({
    id: "blocked-site-list",
    title: "Climate block",
    contexts: ['all'],
    onclick: function () {
      browser.tabs.create({url: browser.extension.getURL('options/options.html')});
    },
  });

  createBlocker();
  browser.storage.onChanged.addListener(createBlocker);
  browser.browserAction.onClicked.addListener(toggleBlock);
  checkData();
}

var filter = [];
setupData();
