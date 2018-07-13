function addDownloadButton() {
    let buttonsContainer = document.querySelector("div.reader-controls-actions,col-auto, row, no-gutters, p-1").childNodes[1];
    let button = document.createElement("a");

    button.title = "Download";
    button.className = "btn btn-secondary col m-1";
    button.innerHTML = '<span class="fas fa-download" aria-hidden="true" title=""></span>';

    buttonsContainer.appendChild(button);

    var autoDownload = false;

    button.addEventListener('click', (event) => {
        event.preventDefault();

        // Empty JSON with info
        let infoJSON = {};
        infoJSON["name"] = document.querySelector(".manga-link").innerText; // Manga name
        infoJSON["volume"] = document.querySelector(`option[value="${document.querySelector(".reader").dataset.chapterId}"`).innerText.split(" ")[1];
        infoJSON["chapter"] = document.querySelector(`option[value="${document.querySelector(".reader").dataset.chapterId}"`).innerText.split(" ")[3];
        infoJSON["page"] = document.querySelector(".current-page").innerText;
        infoJSON["url"] = document.querySelector("img.noselect").src;

        // We download here?
        chrome.runtime.sendMessage(infoJSON, function(done) {
            if(done == true) {
                // Load next page
                let nextPageButton = document.querySelector("a.page-link-right");
                autoDownload = nextPageButton.href.includes("chapter");

                if(autoDownload) {
                    nextPageButton.click();
                    let interval = setInterval(() => {
                        if(!document.querySelector(".reader").classList.contains("is-loading")) {
                            button.click();
                            clearInterval(interval);
                        }
                    }, 100);
                } else
                    autoDownload = false;
            }
        });
    });

    /*
    button.addEventListener('click', () => {
        let infoJSON = JSON.parse(document.querySelector('script[data-type="chapter"]').textContent);

        let chapter_data = document.querySelector('button[data-id="jump_chapter"]').title.split(" ");
        if(chapter_data.length == 4) {
            infoJSON.volume = "Volume " + chapter_data[1] + "/";
            infoJSON.chapter = "Chapter " + chapter_data[3];
        } else {
            if(chapter_data.length == 2) {
                infoJSON.chapter = "Chapter " + chapter_data[1];
            } else {
                infoJSON.chapter = infoJSON.chapter_id;
            }
            infoJSON.volume = "";
        }

        chrome.runtime.sendMessage(infoJSON, function(done) {
            if(done == true) {
                if(infoJSON.next_chapter_id != 0) {
                    chrome.storage.sync.set({download: true}, function() {});
                    window.location = `https://mangadex.org/chapter/${infoJSON.next_chapter_id}/1?download=yes`;
                } else {
                    chrome.storage.sync.set({download: false}, function() {});
                }
            }
        });
    });*/
}

addDownloadButton();
