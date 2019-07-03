const fs = require('fs');
const csv_stringify = require('csv-stringify/lib/sync');

const config = JSON.parse(fs.readFileSync('./input.conf.json', {encoding: 'utf-8'}));
const {urls, pullName, proxyName, inputParameters} = config;
const fileMap = new Map(urls.map(url => [url, Buffer.from(url, 'utf-8').toString('base64')]));
const prefix = 'output-'
const suffix = pullName;
try {
  fs.mkdirSync(`./${prefix}${suffix}/shots`, { recursive: true });
  fs.mkdirSync(`./${prefix}${suffix}/metadata`, { recursive: true });
  fs.writeFileSync(`./${prefix}${suffix}/fileMap.json`, JSON.stringify(Array.from(fileMap.entries())));
  fs.writeFileSync(`./${prefix}${suffix}/tasks.tsv`, generateTSV(urls, proxyName, pullName, inputParameters))
} catch (err) {
  throw err
}

describe('loop over urls', function() {
  urls.forEach(url => {
    it('process single url', function () {
      browser.timeouts({
        "implicit": 30000
      });
      browser.url(url);
      const metaData = browser.execute(function() {
        function parseNode(node) {
          const {tagName, className, id} = node;
          const {top, left, bottom, right} = node.getBoundingClientRect();
          return {id, tagName, className, top, left, right, bottom};
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
      const encodedUrl = fileMap.get(url);
      fs.writeFileSync(`./${prefix}${suffix}/metadata/${encodedUrl}.json`, metaData.value);
      browser.saveDocumentScreenshot(`./${prefix}${suffix}/shots/${encodedUrl}.png`);
    });
  });
});

function generateTSV(urls, proxyName, pullName, inputParameters) {
  return csv_stringify(urls.map(url => ({
    'INPUT:image_rel': `/${proxyName}/${pullName}/${fileMap.get(url)}.png`,
    'INPUT:json_params': inputParameters,
    'GOLDEN:result': 'true'
  })), {
    header: true,
    columns: ['INPUT:image_rel', 'INPUT:json_params', 'GOLDEN:result', 'HINT:text'],
    delimiter: '\t'
  })
}