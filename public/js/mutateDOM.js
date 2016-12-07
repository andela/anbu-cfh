/** Updates the DOM when nodes are added */
/** State teansitions cause node to be added  */
/** /// <reference path="https://getmdl.io/started/index.html" /> */
const observer = new MutationObserver((mutations) => {
  let upgrade = false;

  for (let i = 0; i < mutations.length;) {
    if (mutations[i].addedNodes.length > 0) {
      upgrade = true;
      break;
    }
    i += 1;
  }

  if (upgrade) {
    window.componentHandler.upgradeDom();
  }
});

observer.observe(document, {
  childList: true,
  subtree: true
});
