minimalURL = null;
minimalVisitTime = null;

numBookmarks = -1;
tab_id = null;

function maybeLaunch() {
  if (numBookmarks == 0) {
    console.info("Launching " + minimalURL);
    console.debug("setting for tabTarget: " + localStorage["tabTarget"]);
    switch(localStorage["tabTarget"]) {
      case "current":
        chrome.tabs.update(tab_id, {url: minimalURL});
        break;
      case "newtab":
      default:
        chrome.tabs.create({url: minimalURL});
        break;
    }
    minimalURL = null;
    minimalVisitTime = null;
  }
}

function latestVisitChecker(url) {
  return function(visits) {
    numBookmarks--;
    console.debug("Checking url " + url);

    if (visits.length == 0) {
      console.info("URL " + url + " seems to never have been visited.");

      if (localStorage["ignoreNeverVisited"] != "true") {
        minimalVisitTime = -Infinity;
        minimalURL = url;
      }
      else {
        console.info("Ignoring it because ignoreNeverVisited is set.");
      }

      maybeLaunch();
      return;
    }
    
    latestVisit = visits[0];

    for (var i = 0; i < visits.length; ++i) {
      if (visits[i].visitTime > latestVisit.visitTime) {
        latestVisit = visits[i];
      }
    }

    if ((minimalVisitTime == null) || (latestVisit.visitTime < minimalVisitTime)) {
      console.info("New leader with time " + minimalVisitTime);
      minimalVisitTime = latestVisit.visitTime;
      minimalURL = url;
    }
    
    maybeLaunch();
  }
}

chrome.browserAction.onClicked.addListener(function(tab) {
  tab_id = tab.id;
  chrome.bookmarks.search("http", function(bookmarks) {
    numBookmarks = bookmarks.length;
    for (var i = 0; i < bookmarks.length; ++i) {
      chrome.history.getVisits({url: bookmarks[i].url}, latestVisitChecker(bookmarks[i].url))
    }
  });
});
