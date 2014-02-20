chrome.runtime.onMessage.addListener(function(msg, sender, respond) {
  if (msg !== 'chrofficer-attached') return;
  chrome.browserAction.setIcon({path: '/browser-action-icon-active.png'});
});
chrome.webRequest.onCompleted.addListener(function(details) {
  chrome.windows.getCurrent(function(win) {
    chrome.tabs.get(details.tabId, function(ctab) {
      if (win.focused && ctab.active) {
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
