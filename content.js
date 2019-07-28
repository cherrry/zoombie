/* global chrome, window */

function zoom() {
  chrome.runtime.sendMessage({
    type: 'ZOOM_TAB',
    payload: null,
  });
}

window.setTimeout(zoom, 1000);
zoom();
