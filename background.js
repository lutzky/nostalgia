minimalURL = null;
minimalVisitTime = null;

numBookmarks = -1;

function maybeLaunch() {
  if (numBookmarks == 0) {
    console.debug("Launching " + minimalURL);
    chrome.tabs.create({url: minimalURL});
    minimalURL = null;
    minimalVisitTime = null;
  }
}
function latestVisitChecker(url) {
  return function(visits) {
    numBookmarks--;
    console.debug("Checking url " + url);

    if (visits.length == 0) {
      console.debug("URL " + url + " seems to never have been visited.");
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
      console.log("New leader with time " + minimalVisitTime);
      minimalVisitTime = latestVisit.visitTime;
      minimalURL = url;
    }
    
    maybeLaunch();
  }
}

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.bookmarks.search("http", function(bookmarks) {
    numBookmarks = bookmarks.length;
    for (var i = 0; i < bookmarks.length; ++i) {
      chrome.history.getVisits({url: bookmarks[i].url}, latestVisitChecker(bookmarks[i].url))
    }
  });
});
