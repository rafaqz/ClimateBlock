window.addEventListener('load', loadQuery);

async function loadQuery(event) {

  var btnAllowAllways = document.getElementById('btn-allways');
  btnAllowAllways.onclick = allowAllways;

  var btnThisTime = document.getElementById('btn-this-time');
  btnThisTime.onclick = allowSession;

  console.log('page is fully loaded');
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getUrl(data) {
  // Find the site filter that matches the query url
  url = getParameterByName('url');
  for (i = 0; i < data.siteList.length; i++) {
    // Remove the wildcards and match the url body
    siteFilter = data.siteList[i].url.slice(5, -1);
    if (url.includes(siteFilter)) {
      index = i;
      break;
    };
  };
  return [url, index]
}

async function allowAllways(event) {
	let data = await browser.storage.sync.get();
  [url, index] = getUrl(data);
	data.siteList[index].active = false;
	browser.storage.sync.set({siteList: data.siteList});
  window.location.href = url;
}

async function allowSession(event) {
	let data = await browser.storage.sync.get();
  [url, index] = getUrl(data);
	data.sessionList[index] = false;
	browser.storage.sync.set({sessionList: data.sessionList});
  window.location.href = url;
}
