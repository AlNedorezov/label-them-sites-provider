const assert = require('assert');
const fs = require('fs');

describe('webdriver.io page', function() {
  it('should have the right title - the fancy generator way', function () {
    browser.url('https://youtube.com');
    const metaData = browser.execute(function() {
      function parseNode(node) {
        const {tagName, className} = node;
        const {top, left, bottom, right} = node.getBoundingClientRect();
        return {tagName, className, top, left, right, bottom};
      }

      function traverse(node) {
        const {children} = node;
        if (children.length === 0) {
          return parseNode(node);
        } else {
          const nodeData = parseNode(node);
          return {
            ...nodeData,
            children: Array.from(children).map(child => traverse(child))
          }
        }
      }

      const result = traverse(document.body);
      return JSON.stringify(result);
    })
    fs.writeFileSync('./data.json', metaData.value);
    browser.saveDocumentScreenshot('./shot.png');
    assert.ok(['abc'].includes('youtube'));
  });
});