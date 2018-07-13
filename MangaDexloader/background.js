let currentDownload;
let responseFunction;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    let fileType;
    fileType = request.url.split("/")[request.url.split("/").length - 1];

    chrome.downloads.download({
        url: request.url,
        conflictAction: 'prompt',
        filename: `manga/${request.name.replace(":", "").replace("!", "").replace("?", "")}/${request.volume}/${request.chapter}/${fileType}`
    }, (downloadId) => {
        currentDownload = downloadId;
    });

    responseFunction = sendResponse;

    return true;
});

chrome.downloads.onChanged.addListener((downloadDelta) => {
    if(downloadDelta.id == currentDownload && downloadDelta.endTime) {
        if(downloadDelta.state && downloadDelta.state.current == "complete") {
            responseFunction(true);
        }
    }
});