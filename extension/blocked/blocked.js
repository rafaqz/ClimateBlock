window.onload = async function(){

  // Allow refresh if unblocked elsewhere
	let data = await browser.storage.sync.get();
  [url, index] = getUrl(data);
  console.log(url)
  console.log(index)
  console.log(data.siteList[index].blocked)
  if (!data.siteList[index].blocked) {
    console.log("redirect");
    window.location.href = url;
  };

  console.log("open blocked page");

  var btnAllowAllways = document.getElementById('btn-allways');
  btnAllowAllways.onclick = allowAllways;

  var btnThisTime = document.getElementById('btn-this-time');
  btnThisTime.onclick = allowSession;
};

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
  console.log("URL: " + url);
  index = -1;
  for (i = 0; i < data.siteList.length; i++) {
    // Remove the wildcards and match the url body
    siteFilter = data.siteList[i].url.slice(6, -2);
    console.log("Filter: " + siteFilter);
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
  console.log(url)
  console.log(index)
  if (index >= 0) {
    data.siteList[index].blocked = false;
    browser.storage.sync.set({siteList: data.siteList});
    function redirect() {
      window.location.href = url;
    };
    setTimeout(redirect, 500);
    console.log("Allyways allowed: ", url);
  } else {
    console.log("Eror: Url not found in blocked list. Turn off manually or reinstall extension: ", url);
  };
}

async function allowSession(event) {
	let data = await browser.storage.sync.get();
  [url, index] = getUrl(data);
  console.log(url)
  console.log(index)
  if (index >= 0) {
    data.sessionList[index] = false;
    browser.storage.sync.set({sessionList: data.sessionList});
    function redirect() {
      window.location.href = url;
    };
    setTimeout(redirect, 500);
    console.log("Allowed for session: ", url);
  } else {
    console.log("Eror: Url not found in blocked list. Turn off manually or reinstall extension: ", url);
  };
}
