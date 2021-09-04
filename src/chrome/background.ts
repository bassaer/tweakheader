import { State } from '../models/state';

const state: State = {
  running: false,
  headers: []
};

chrome.storage?.local.get('state', (data) => {
  if (data.state) {
    state.running = data.state.playing;
    state.headers = data.state.headers;
    setBadge();
  }
});

const tweakHeader = (detail: chrome.webRequest.WebRequestHeadersDetails) => {
  const requestHeaders = detail.requestHeaders;
  if (!state.running || !requestHeaders) {
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
    if (header.action !== 'Delete' && header.enable) {
      result.push({ name: header.name, value: header.value });
    }
  }
  return { requestHeaders: result };
};

chrome.browserAction.setPopup({ popup: '' });
chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'index.html' });
});

chrome.webRequest.onBeforeSendHeaders.removeListener(tweakHeader);
chrome.webRequest.onBeforeSendHeaders.addListener(
  tweakHeader,
  { urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders', 'extraHeaders']
);

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (!changes.state.newValue) {
    return;
  }
  const data = changes.state.newValue as State;
  state.running = data.running;
  state.headers = data.headers;
  setBadge();
});

const setBadge = () => {
  const count = state.headers.filter(header => header.enable).length;
  chrome.browserAction.setBadgeText({ text: state.running ? String(count) : '' });
  chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000' });
}

