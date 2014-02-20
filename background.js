console.log("hi from jake");
chrome.browserAction.setBadgeText({text: "wo"});
chrome.webRequest.onCompleted.addListener(function(details) {
  chrome.windows.getCurrent(function(win) {
    chrome.tabs.get(details.tabId, function(ctab) {
      if (win.focused && ctab.active) {
        console.log("already focused");
        return;
      }
      chrome.tabs.sendMessage(details.tabId, "calendar_notify", function (resp) {
        resp.reminders.forEach(function(item) {
          var notification = webkitNotifications.createNotification('/app.png', item.title, item.timeRange);
          notification.onclick = function() {
            chrome.tabs.update(details.tabId, {active: true});
            chrome.windows.update(win.id, {focused: true});
          };
          notification.show();
        });
      });
    });
  });

}, {urls: ['*://*.outlook.com/owa*calendar_notify*']});
