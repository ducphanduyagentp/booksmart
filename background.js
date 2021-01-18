chrome.runtime.onInstalled.addListener(function() {
  chrome.bookmarks.getTree((results) => {
    DFS(results[0]);
    for (var bookmark of allBookmarks) {
      console.log(bookmark.title);
    }
  });
});

let allBookmarks = [];
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
}