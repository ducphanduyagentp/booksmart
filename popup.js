// let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function() {
//     chrome.bookmarks.getTree((results) => {
//         let bookmarkBar = results[0].children[0];
//         let bookmarks = bookmarkBar.children;
//         for (var child of bookmarks) {
//             console.log(child.title);
//         }
//     });
// };