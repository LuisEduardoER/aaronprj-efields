var mboxCurrent=mboxFactories.get('default').get('SHARED_CAROUSEL',0);mboxCurrent.setEventTime('include.start');document.write('<div style="visibility: hidden; display: none" id="mboxImported-default-SHARED_CAROUSEL-0">');document.write('<div id=\"mboxClick-SHARED_CAROUSEL\" onclick=\"mboxFactories.get(\'default\').getSignaler().signal(\'click\', \'SHARED_CAROUSEL-clicked\', \'mboxTarget=46550.4590\')\">');/* Offer id: 7565*/ 

_mboxDefaultContentOffer = function() {
  this._onLoad = function() {};
};

_mboxDefaultContentOffer.prototype.setOnLoad = function(_onLoad) {
  this._onLoad = _onLoad;
};

_mboxDefaultContentOffer.prototype.show = function(_mbox) {
  var _defaultDiv = _mbox.getDefaultDiv();
  if (_defaultDiv == null) {
    return 0;
  }
  _defaultDiv.onclick = function() {
    // just use _mbox.getName() when everyone is on mboxVersion >= 21
    var _mboxName = _mbox.id ? _mbox.id : _mbox.getName();
    var _clickDiv = document.getElementById('mboxClick-' + _mboxName);
    if (_clickDiv != null) {
      _clickDiv.onclick();
    }
  };
  var _result = _mbox.hide();
  if (_result == 1) {
    this._onLoad();
  }
  return _result;
};

mboxCurrent.setOffer(new _mboxDefaultContentOffer());
if (mboxCurrent.getFetcher && mboxCurrent.getFetcher().getType() == 'ajax') {
  mboxCurrent.show();
};document.write('<\/div>');document.write('<!-- Offer Id: 45363  --><script type=\"text\/javascript\">\r\n\/*TT>SC v3 ==> Response Plug-ins*\/\r\nwindow.s_tnt=window.s_tnt||\'\',tntVal=\'46550:145:1,\';\r\nif(window.s_tnt.indexOf(tntVal)==-1){window.s_tnt+=tntVal}\r\n<\/script>');document.write('</div>');mboxCurrent.setEventTime('include.end');mboxFactories.get('default').get('SHARED_CAROUSEL',0).loaded();mboxFactories.get('default').getPCId().forceId("1328458092617-355035.18");