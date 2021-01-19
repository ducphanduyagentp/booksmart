let sortAllBookmarks = document.getElementById('sortAllBookmarks');
let testButton = document.getElementById('testButton');
let console = chrome.extension.getBackgroundPage().console;
let sortFunc = (a, b) => {
    return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : (a.title.toLowerCase() == b.title.toLowerCase() ? 0 : 1);
};

let allBookmarks = [];

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

function DFS(node) {
    if (node.visited) {
        return;
    }

    node.visited = true;
    if (node.url) {
        allBookmarks.push(node);
    }
    if (node.children) {
        for (var child of node.children) {
            DFS(child);
        }
    }

    sortNode(node);
}

sortAllBookmarks.onclick = function() {
    chrome.bookmarks.getTree((results) => {
        DFS(results[0]);
    });
};

testButton.onclick = function() {
    chrome.bookmarks.search("test folder", (results) => {
        sortNode(results[0]);
    });
}