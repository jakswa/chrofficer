var map = Array.prototype.map;
var eleText = function (span) {
  return span.innerText + ' ';
};


chrome.runtime.onMessage.addListener(function(msg, sender, respond) {
  if (msg !== 'calendar_notify') return;
  // microsoft hates using IDs, apparently...
  var eles = document.querySelectorAll('[aria-label="Reminders"] [role="option"]');
  eles = map.call(eles, function(item) {
    var attrs = {};
    attrs.time = map.call(item.querySelectorAll('._f_Fc span'), eleText).join('').trim();
    attrs.title = item.querySelector('._f_Hc').innerText;
    var timeRangeEles = item.querySelectorAll('._f_Gc._f_Ic span:first-child')
    attrs.timeRange = map.call(timeRangeEles, eleText).join('').trim();
    return attrs;
  });
  respond({msg: "calendar_notify", reminders: eles});
});
