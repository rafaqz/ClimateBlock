/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Load settings
async function buildList() {
  // Load list from storage
  let data = await browser.storage.sync.get();
  siteList = data.siteList;
  sessionList = data.sessionList;
  console.log(sessionList)
  
  // Add items to GUI table
  for (i = 0; i < siteList.length; i++) {
    createItem(siteList[i], sessionList[i], i);
  }
}

// Save settings
function save() {
  browser.storage.sync.set({siteList:siteData});
}

// Create item GUI
function createItem(site, sessionval, index) {
  console.log(session)
  var list = document.getElementById('site-list');
  
  // Create item container
  var container = document.createElement('div');
  container.className = 'list-item';
  
  // Create item text label
  var name = document.createElement('span');
  name.textContent = site.name;
  var url = document.createElement('span');
  url.textContent = site.url;
  var url = document.createElement('span');
  url.textContent = site.url;
  var active = document.createElement('input');
  active.type = 'checkbox';
  active.id = site.name.replace(/ /g,"_").toLowerCase(); // need unique Ids!
  active.checked = site.active;
  active.onclick = function(event) {
    if (this.checked) setBlock(index, true);
    else setBlock(index, false);
  };


  var session = document.createElement('input');
  session.type = 'checkbox';
  session.id = site.name.replace(/ /g,"_").toLowerCase(); // need unique Ids!
  session.checked = sessionval;
  session.onclick = function(event) {
    if (this.checked) setSession(index, true);
    else setSession(index, false);
  };
  
  // Merge items
  container.appendChild(name);
  container.appendChild(url);
  container.appendChild(active);
  container.appendChild(session);
  list.appendChild(container);
}

async function setBlock(index, value) {
  // Load list from storage
  let data = await browser.storage.sync.get();
  siteList = data.siteList;
  siteList[index].active = value;
  browser.storage.sync.set({siteList: siteList});
}

async function setSession(index, value) {
  // Load list from storage
  let data = await browser.storage.sync.get();
  sessionList = data.sessionList;
  sessionList[index] = value;
  browser.storage.sync.set({sessionList: sessionList});
}

var siteData;
// Run when page loads
window.onload = function(){
  buildList();
};
