function nodeInfo(node) {
    if (
        typeof node !== 'object' || 
        node === null || 
        node.constructor.name !== 'Node'
        )
    {
        return 'Invalid node!'
    }

    return `( nodeName: '${node.nodeName}', 
    id: '${node.id}', 
    name: '${node.name}', 
    className: '${node.className}' )`;
}

// The HTMLElement that contains the Google editor.
const docsEditorContainer = window.top.document.querySelector('#docs-editor-container');

// DOM MutationObeserver callback.
function onDOMChanged(mutationList, observer) {
  for (let mutation of mutationList) {
    if (mutation.type === 'childList') {
      let target = mutation.target;
      let added = mutation.addedNodes;
      let removed = mutation.removedNodes;
      
      // The output message.
      let message = `Canges to the DOM tree of ${nodeInfo(target)}...\n`;
      
      // Append added nodes informations to the output message.
      if (added.length > 0) {
        for (const node of added) {
          message += `\n\tAdded nodes:\n\t\t${nodeInfo(node)}`;
        }
      }
      
      // Append removed nodes informations to the output message.
      if (removed.length > 0) {
        for (const node of removed) {
          message += `\n\tRemoved nodes:\n\t\t${nodeInfo(node)}`;
        }
      }
      
      console.log(message);
    }
    
    else if (mutation.type === 'attributes') {
      console.log(`The ${mutation.attributeName} attribute was modified.`);      
    }
  }
};

// Observation settings.
const observeOptions = {
    attributes: true,
    childList: true,
    subtree: true
};

const observer = new MutationObserver(onDOMChanged);

// Start to observe.
observer.observe(docsEditorContainer, observeOptions);

// Eventually stop observation.
//observer.disconnect();
