const tweakHeader = (detail: chrome.webRequest.WebRequestHeadersDetails) => {
    const requestHeaders = detail.requestHeaders;
    if (!requestHeaders) {
        return { requestHeaders }
    }

    for (const header of requestHeaders) {
        if (header.name.toLocaleLowerCase() === 'user-agent') {
            console.log(header.value);
        }
    }

    return { requestHeaders }
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
