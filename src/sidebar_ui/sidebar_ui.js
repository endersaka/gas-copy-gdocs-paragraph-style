/* eslint-disable func-names */
const spacingGetters = ['getLineSpacing', 'getSpacingAfter', 'getSpacingBefore'];
const indentationGetters = ['getIndentStart', 'getIndentEnd', 'getIndentFirstLine'];
const colorGetters = ['getForegroundColor', 'getBackgroundColor'];
const alignmentGetters = ['getTextAlignment', 'getAlignment'];
const fontGetters = ['getFontSize', 'getFontFamily'];
const allGetters = [].concat(
  spacingGetters,
  indentationGetters,
  colorGetters,
  alignmentGetters,
  fontGetters
);

function objectOwnFunctionsToHTML(obj) {
  let html = '<ul>';

  if (typeof obj === 'undefined' || obj == null) {
    return null;
  }

  for (const prop in obj) {
    if (typeof obj[prop] === 'function' && prop.indexOf('get') === 0) {
      html += `<li>${prop}</li>`;
    }
  }

  html += '</ul>';

  return html;
}

function getterReturnValueToHTML(elt, getter) {
  if (typeof elt === 'undefined' || elt == null) {
    return '<h2>Element does not exist!</h2>';
  }

  if (typeof getter !== 'string') {
    return "<h2>Getter should be of type 'string'!</h2>";
  }

  if (
    typeof elt[getter] === 'undefined' ||
    elt[getter] == null ||
    typeof elt[getter] !== 'function'
  ) {
    return `<h2>Element has no function named '${getter}'!</h2>`;
  }

  const func = elt[getter];
  if (typeof func !== 'function') {
    return `<h2>Property ${getter} is not of type 'function'!</h2>`;
  }

  let html = '';
  const match = getter.match(/([A-Z][a-z]*)/g);
  // var html = '<li>' + match.toString() + '</li>';
  const name = match.reduce(function(acc, val, index) {
    return `${acc} ${val}`;
  }, '');
  const value = func.apply(elt);
  const inputId = name.replace(' ', '-');
  let inputType = 'text';

  if (
    typeof value === 'number' ||
    (typeof value === 'object' && value != null && value.constructor === Number)
  ) {
    inputType = 'number';
  }

  html += `<div style="display: flex; justify-content: space-between;">
    <label for="${inputId}">${name}</label>
    <input id="${inputId}" name="${inputId}" type="${inputType}" step="0.01" min="0" 
    value="${value == null ? '0' : value}">
    </div>`;

  //  html += '</li>';

  return html;
}

function elementAttributesToHTML(elt) {
  let eltTmp = elt;
  const type = eltTmp.getType();
  // Logger.log('Element type: %s', type);

  if (type === DocumentApp.ElementType.TEXT) {
    eltTmp = eltTmp.getParent();
    // Logger.log('Element type (after change): %s', elt.getType());
  }

  let html = `<h3>${type}</h3>`;

  const attributes = eltTmp.getAttributes();
  const entries = [];

  // Populate entries. Google Apps Script JavaScript does not support Object.entries(obj).
  for (const key in attributes) {
    const value = eltTmp[key];

    // Skip functions.
    if (typeof value === 'function') {
      continue;
    }

    entries.push([key, value]);
  }
  // Logger.log('Entries: %s', entries);

  const lastIndex = entries.length - 1;

  // html += objectOwnFunctionsToHTML(elt);

  // html += '<ul>';
  html += '<form><fieldset style="border-width: 0; margin: 0; padding: 0;">';

  allGetters.forEach(function(getter) {
    html += getterReturnValueToHTML(eltTmp, getter);
  });

  html += '</fieldset></form>';
  // html += '</ul>';

  // Append attributes informations to the HTML result.
  html += entries.reduce(function(acc, entry, index) {
    const value = entry[1] != null ? entry[1] : 'null';
    let result = `${acc}<li>${entry[0]}: ${value}</li>`;

    // If this is the last entry, append the <UL> closing tag.
    if (index === lastIndex) {
      result += '</ul>';
    }

    return result;
  }, '<ul>');

  return html;
}

function selectionPropertiesToHTML(sel) {
  // This scenario presents 2 cases:
  //     1) the selection is null (i.e. no element is selected).
  //     2) the selection contains 1 or more elements.

  // In the firs case, we can still detect where the cursor
  // is located and get the element that contains its position.
  if (typeof sel === 'undefined' || sel == null) {
    const elt = DocumentApp.getActiveDocument()
      .getCursor()
      .getElement();
    return `<p>Nothing selected</p>${elementAttributesToHTML(elt)}`;
  }

  const elements = sel.getRangeElements();

  return elements.reduce(function(acc, rel) {
    return acc + elementAttributesToHTML(rel.getElement());
  }, '');
}

function scriptHTMLElement() {
  let script = '<script type="text/javascript">';
  // var btn = document.querySelector('#fanculo');
  // console.log(btn);
  // btn.addEventListener('click', function(e) {
  script += "console.log('CLICK: ', window.top.document.location);";
  // })
  script += '</script>';
  return script;
}

// Show the selected element(s) attributes labels and values.
function showSelectionProperties() {
  // // Get the active document. The one this script is bound to.
  // const doc = DocumentApp.getActiveDocument();

  // // Get the selection as a Range object, if any, or null.
  // const sel = doc.getSelection();

  // // Create the HTML output to send to the Custom Sidebar.
  // const html = HtmlService.createHtmlOutput(selectionPropertiesToHTML(sel) + scriptHTMLElement())
  //   .setTitle('My custom sidebar') // Set the title of the Sidebar.
  //   .setWidth(300); // Set the width of the Sidebar.

  // // It becomes SlidesApp, FormApp, ecc... Depending on the type of document this script is bound to.
  // DocumentApp.getUi().showSidebar(html);

  const html = HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('My custom sidebar') // Set the title of the Sidebar.
    .setWidth(300); // Set the width of the Sidebar.

  // It becomes SlidesApp, FormApp, ecc... Depending on the type of document this script is bound to.
  DocumentApp.getUi().showSidebar(html);
}

function showSidebar() {
  showSelectionProperties();

  //  var pBody = '';
  //  var log = '';
  //  var selection = DocumentApp.getActiveDocument().getSelection();
  //  log += 'Test selection...<br>';
  //
  //  if (selection) {
  //    log += 'Selection found...<br>';
  //
  //    // Get array of RangeElement objects (each one wraps an Element or subclass).
  //    var elements = selection.getRangeElements();
  //
  //    for (var i = 0; i < elements.length; i++) {
  //      // Get the Element inside the RangeElement.
  //      var element = elements[i].getElement();
  //
  //      // Do something only if the element is an InlineDrawing object.
  //      //if (element.getType() == DocumentApp.ElementType.INLINE_DRAWING) {
  //        var attributes = element.getAttributes();
  //        for (var attribute in attributes) {
  //          pBody += attribute + ":" + attributes[attribute] + "<br>";
  //        }
  //      //}
  //    }
  //  }
  //  var paragraphType = DocumentApp.ElementType.PARAGRAPH;
  //  var listItemType = DocumentApp.ElementType.LIST_ITEM;
  //
  //  // Get the body section of the active document.
  //  var body = DocumentApp.getActiveDocument().getBody();
  //
  //  // Define the search parameters.
  //  var searchType = DocumentApp.ElementType.INLINE_DRAWING;
  //
  //  // searchResult is a RangeElement.
  //  var searchResult = null;

  // Search until the paragraph is found.
  //  while (searchResult = body.findElement(paragraphType, searchResult)) {
  //    log += 'Paragraph found...<br>';
  //    var paragraph = searchResult.getElement();
  //
  //    var subSearchResult = null;
  //
  //    while (subSearchResult = paragraph.findElement(searchType, subSearchResult)) {
  //      log += 'Inline Drawing found...<br>';
  //      var drawing = subSearchResult.getElement();
  //
  //      var attributes = drawing.getAttributes();
  //      for (var attribute in attributes) {
  //        pBody += attribute + ":" + attributes[attribute] + "<br>";
  //      }
  //    }
  //  }
  //
  //  // searchResult is a RangeElement.
  //  var searchResult = null;

  // Search until the ListItem is found.
  //  while (searchResult = body.findElement(listItemType, searchResult)) {
  //    log += 'ListItem found...<br>';
  //    var listItem = searchResult.getElement();
  //
  //    var subSearchResult = null;
  //
  //    while (subSearchResult = listItem.findElement(searchType, subSearchResult)) {
  //      log += 'Inline Drawing found...<br>';
  //      var drawing = subSearchResult.getElement();
  //
  //      var attributes = drawing.getAttributes();
  //      for (var attribute in attributes) {
  //        pBody += attribute + ":" + attributes[attribute] + "<br>";
  //      }
  //    }
  //  }
  //
  //  pBody = pBody != '' ? pBody : 'No selection!';
  //
  //  var html = HtmlService.createHtmlOutput('<p id="selection-info">' + pBody + '</p><p id="log">' + log + '</p>')
  //  .setTitle('My custom sidebar')
  //  .setWidth(300);
  //  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
  //  .showSidebar(html);
}

function onOpen() {
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .createMenu('Custom Menu')
    .addItem('Show sidebar', 'showSidebar')
    .addToUi();
}

/**
 * Returns the contents of an HTML file.
 * @param {string} file The name of the file to retrieve.
 * @return {string} The content of the file.
 */
function include(file) {
  return HtmlService.createTemplateFromFile(file)
    .evaluate()
    .getContent();
}

export {
  elementAttributesToHTML,
  getterReturnValueToHTML,
  objectOwnFunctionsToHTML,
  scriptHTMLElement,
  selectionPropertiesToHTML,
  showSelectionProperties,
  showSidebar,
  onOpen,
  include
};
