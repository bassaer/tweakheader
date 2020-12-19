const tweakHeader = (debail: chrome.webRequest.WebRequestBodyDetails) => {
    console.log(JSON.stringify(debail));
}

chrome.webRequest.onBeforeRequest.addListener(
    tweakHeader,
    { urls: ['<all_urls>'] },
    []
);
