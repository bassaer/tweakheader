const tweakHeader = (detail: chrome.webRequest.WebRequestHeadersDetails) => {
    const requestHeaders = detail.requestHeaders;
    if (!requestHeaders) {
        return { requestHeaders }
    }

    for (const header of requestHeaders) {
        if (header.name.toLocaleLowerCase() === 'user-agent') {
            header.value = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1';
        }
    }

    return { requestHeaders }
};

chrome.webRequest.onBeforeSendHeaders.addListener(
    tweakHeader,
    { urls: ['<all_urls>'] },
    ['blocking', 'requestHeaders']
);
