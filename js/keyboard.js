'use strict';

var inputContext = null;
var layout;
var variant;
var keyboardContainer;
var currentPage;
var currentPageView;
var mainpageName;

var pages = {};
var pageviews = {};
window.addEventListener('load', init);
function init() {
  keyboardContainer = document.getElementById('keyboardContainer');

  layout = new KeyboardLayout(englishLayout);

  // Start off with the main page
  variant = getVariant();
  currentPageView = layout.getPageView(keyboardContainer, null, variant);
  currentPage = currentPageView.page;

  // Make it visible
  currentPageView.show();

  // Handle events
  KeyboardTouchHandler.setPageView(currentPageView);
  KeyboardTouchHandler.addEventListener('key', handleKey);

  // Prevent losing focus to the currently focused app
  // Otherwise, right after mousedown event, the app will receive a focus event.
  keyboardContainer.addEventListener('mousedown', function onMouseDown(evt) {
    evt.preventDefault();
  });

  window.addEventListener('resize', resizeWindow);

  window.navigator.mozInputMethod.oninputcontextchange = function() {
    inputContext = navigator.mozInputMethod.inputcontext;
    resizeWindow();
  };


  // If the variant changes, update the page view if needed
  InputField.addEventListener('inputfieldchanged', function(e) {
    var newvariant = getVariant();
    if (newvariant === variant)
      return;

    console.log('variant changed to', newvariant);

    variant = newvariant;
    var newPageView = layout.getPageView(keyboardContainer,
                                         currentPage.name, variant);
    if (newPageView === currentPageView)
      return;

    console.log('pageview changed to',
                newPageView.page.name, newPageView.page.variant);
    currentPageView.hide();
    currentPageView = newPageView;
    currentPage = currentPageView.page;
    currentPageView.show();
    KeyboardTouchHandler.setPageView(currentPageView);
  });
}

function getVariant() {
  var variant;

  // figure out what layout variant we're using
  // XXX: match the old keyboard behavior
  switch(InputField.inputType) {
  case 'email':
    variant = 'email';
    break;
  case 'url':
    variant = 'url';
    break;
  default:
    variant = null;
  }
  console.log("getVariant", variant);
  return variant;
}

function handleKey(e) {
  var keyname = e.detail;

  if (!keyname)
    return;
  var key = currentPage.keys[keyname];
  if (!key)
    return;

  switch (key.keycmd) {
  case 'sendkey':
    if(localStorage.vibration==1){
      try{	
      window.navigator.vibrate(50);
	}
	catch(e){};
    }
    if(localStorage.clickSound==1){
	try{
      new Audio('./style/sounds/key.opus').cloneNode(false).play();
      new Audio('./style/sounds/special.opus').cloneNode(false).play();}
	catch(e){};
    }
    if (currentPageView.shifted) {
      sendKey(String.fromCharCode(key.keycode).toUpperCase().charCodeAt(0));
    }
    else {
      sendKey(key.keycode);
    }
    break;

  case 'backspace':
    sendKey(8);
    break;

  case 'switch':
    navigator.mozInputMethod.mgmt.next();
    break;
  case 'page':
    switchPage(key.page);
    break;
  case 'defaultPage':
    switchPage(mainpageName);
    break;
  default:
    console.error('Unknown keycmd', key.keycmd);
    break;
  }
}

function switchPage(pagename) {
  var oldPageView = currentPageView;
  currentPageView = layout.getPageView(keyboardContainer,
                                       pagename, variant);
  currentPage = currentPageView.page;
  oldPageView.hide();
  currentPageView.show();
  KeyboardTouchHandler.setPageView(currentPageView);
}

function sendKey(keycode) {
  switch (keycode) {
  case KeyEvent.DOM_VK_BACK_SPACE:
  case KeyEvent.DOM_VK_RETURN:
    InputField.sendKey(keycode, 0, 0);
    break;

  default:
    var start = performance.now();
    InputField.sendKey(0, keycode, 0);
    break;
  }
}

// XXX:
// The KeyboardLayout object could register this handler and do the resizing
function resizeWindow() {
  window.resizeTo(window.innerWidth, keyboardContainer.clientHeight);

  layout.forEachPageView(function(pageview) {
    pageview.resize();
  });
}

var englishLayout = {
  name: 'ไทย',
  label: 'ไทย',
  pages: {
    main: {
      layout: [
        'ๅ / - ภ ถ ุ ึ ค ต จ ข ช',
        'ๆ ไ ำ พ ะ ั ี ร น ย บ ล ',
	'ฟ ห ก ด เ ้ ่ า ส ว ง ฃ',
        'SHIFT ผ ป แ อ ิ ื ท ม ใ ฝ BACKSPACE',
        '?123 SWITCH SPACE . RETURN'
      ],
      variants: {
        email: [
        'ๅ / - ภ ถ ุ ึ ค ต จ ข ช',
        'ๆ ไ ำ พ ะ ั ี ร น ย บ ล ',
	'ฟ ห ก ด เ ้ ่ า ส ว ง .',
        'SHIFT ผ ป แ อ ิ ื ท ม ใ ฝ BACKSPACE',
        '?123 SWITCH SPACE . RETURN'
        ],
        url: [
        'ๅ / - ภ ถ ุ ึ ค ต จ ข ช',
        'ๆ ไ ำ พ ะ ั ี ร น ย บ ล ',
	'ฟ ห ก ด เ ้ ่ า ส ว ง ฃ',
        'SHIFT ผ ป แ อ ิ ื ท ม ใ ฝ BACKSPACE',
        '?123 SWITCH SPACE . RETURN'
        ]
      }
    },
    NUMBERS: 'inherit',  // Use the built-in number and symbol pages
    SYMBOLS: 'inherit'
  },

  keys: {
    '.': {
      alternatives: ', ? ! ; :'
    }
  }
};
