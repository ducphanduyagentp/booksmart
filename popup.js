let sortAllBookmarks = document.getElementById('sortAllBookmarks');
let testButton = document.getElementById('testButton');
let deExtensionize = document.getElementById('deExtensionize');
let showStats = document.getElementById('showStats');
let console = chrome.extension.getBackgroundPage().console;
let sortFunc = (a, b) => {
    return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : (a.title.toLowerCase() == b.title.toLowerCase() ? 0 : 1);
};

let allBookmarks = [];
let bookmarkStats = {
    folder: 0,
    links: 0
}

function bookmarkEquals(a, b) {
    return (a.title == b.title) && (a.url == b.url);
}

function sortNode(node) {
    if (!node.parentId) {
        return;
    }

    chrome.bookmarks.getChildren(node.id, (children) => {
        children = children.sort(sortFunc);
        for (var i = 0; i < children.length; i++) {
            chrome.bookmarks.move(children[i].id, {index: i}, (res) => {});
        }
    });
}

function cleanNode(node) {
    if (!node.parentId) {
        return;
    }

    chrome.bookmarks.getChildren(node.id, (children) => {
        for (var child of children) {
            if (!child.url) {
                continue;
            }

            if (child.url.startsWith('chrome-extension://')) {
                let url = child.url;
                url = url.slice(url.indexOf('uri=') + 4);
                console.log(url);
                chrome.bookmarks.update(child.id, {url: url}, (res) => {});
            }
        }
    });
}

function DFS(node, callback) {
    if (node.visited) {
        return;
    }

    node.visited = true;
    if (node.url) {
        bookmarkStats.links ++;
    }
    if (node.children) {
        bookmarkStats.folder ++;
        for (var child of node.children) {
            DFS(child, callback);
        }
    }

    if (callback) {
        callback(node);
    }
}

sortAllBookmarks.onclick = function() {
    chrome.bookmarks.getTree((results) => {
        DFS(results[0], sortNode);
    });
};

testButton.onclick = function() {
    chrome.bookmarks.search("test folder", (results) => {
        sortNode(results[0]);
    });
}

deExtensionize.onclick = function() {
    chrome.bookmarks.getTree((results) => {
        DFS(results[0], cleanNode);
    });
}

showStats.onclick = function() {
    bookmarkStats.folder = 0;
    bookmarkStats.links = 0;
    chrome.bookmarks.getTree((results) => {
        DFS(results[0]);
    });
    console.log(bookmarkStats);
}