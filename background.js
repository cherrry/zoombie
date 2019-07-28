/* global chrome */

// TODO: Option page to customize setting.
const DISPLAY_ZOOM_LEVEL = {
  'DEFAULT': 1.0,
  '69733568': 1.0, // MacBook
  '724858326': 1.25, // Dell
};

let zoomLevel = 1.0;

function zoomTab({id, url}) {
  if (url.startsWith('chrome://')) {
    return;
  }
  chrome.tabs.getZoom(id, (zl) => {
    if (Math.abs(zl - zoomLevel) > 0.01) {
      chrome.tabs.setZoom(id, zoomLevel);
    }
  });
}

function zoomAllTabs() {
  chrome.windows.getAll({populate: true}, (windows) => {
    windows.forEach((w) => w.tabs.forEach(zoomTab));
  });
}

function updateZoomLevel() {
  chrome.system.display.getInfo((infos) => {
    const info = infos[0];
    if (DISPLAY_ZOOM_LEVEL.hasOwnProperty(info.id)) {
      zoomLevel = DISPLAY_ZOOM_LEVEL[info.id];
    } else {
      // eslint-disable-next-line no-console
      console.log('Unknown display', info);
      zoomLevel = DISPLAY_ZOOM_LEVEL['DEFAULT'];
    }
    zoomAllTabs();
  });
}

chrome.system.display.onDisplayChanged.addListener(updateZoomLevel);
updateZoomLevel();

chrome.runtime.onMessage.addListener(({type, payload}, {tab}) => {
  if (type === 'ZOOM_TAB') {
    zoomTab(tab);
  }
});
