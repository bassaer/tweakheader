import { State } from '../models/state';

const state: State = {
  playing: false,
  headers: []
};

chrome.storage?.local.get('state', (data) => {
  if (data.state) {
    state.playing = data.state.playing;
    state.headers = data.state.headers;
    setBadge(state.playing);
  }
});

const tweakHeader = (detail: chrome.webRequest.WebRequestHeadersDetails) => {
  const requestHeaders = detail.requestHeaders;
  if (!state.playing || !requestHeaders) {
    return { requestHeaders };
  }
  const result: chrome.webRequest.HttpHeader[] = [];
  for (const reqHeader of requestHeaders) {
    let found = false;
    for (const newHeader of state.headers) {
      if (!newHeader.enable) {
        continue;
      }
      if (reqHeader.name.toLocaleLowerCase() === newHeader.name.toLocaleLowerCase()) {
        if (newHeader.action === 'Delete') {
          found = true;
          break;
        }
      }
    }
    if (found) {
      continue;
    }
    result.push(reqHeader);
  }
  for (const header of state.headers) {
    if (header.action !== 'Delete') {
      result.push({ name: header.name, value: header.value });
    }
  }
  return { requestHeaders: result };
};

chrome.browserAction.setPopup({ popup: '' });
chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'index.html' });
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  tweakHeader,
  { urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders']
);

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (!changes.state.newValue) {
    return;
  }
  const data = changes.state.newValue as State;
  state.playing = data.playing;
  state.headers = data.headers;
  setBadge(state.playing);
});

const setBadge = (enable: boolean) => {
  chrome.browserAction.setBadgeText({ text: enable ? '⚡️' : '' });
  chrome.browserAction.setBadgeBackgroundColor({ color: '#000000' });
}

