'use strict'
function getContainerNode(elements, points, deviation) {
  function getArea({top, bottom, left, right}) {
    return Math.abs(bottom - top) * Math.abs(right - left)
  }

  function traverse(node, searchFunction) {
    const {children} = node;
    if (children) {
      searchFunction(node);
      children.map(child => traverse(child, searchFunction));
    } else {
      searchFunction(node);
    }
  }

  function getSearchFunction(polygonRect) {
    const containers = [];
    let minAreaContainer = {area: 10000000000000000};

    function containsPolygonRect(node) {
      return polygonRect.top > node.top
        && polygonRect.bottom < node.bottom
        && polygonRect.left > node.left
        && polygonRect.right < node.right
    }

    function searchContainers(node, parent) {
      node.parent = parent;
      node.area = getArea(node);
      if (containsPolygonRect(node)) {
        if (node.area < minAreaContainer.area) {
          containers.push(node)
          minAreaContainer = node;
        }
      }
    }

    searchContainers.containers = () => {
      return containers
    }

    searchContainers.minAreaContainer = () => {
      return minAreaContainer
    }

    return searchContainers
  }

  const top = points.reduce((a, b) => a[1] < b[1] ? a : b)[1] + deviation;
  const bottom = points.reduce((a, b) => a[1] > b[1] ? a : b)[1] - deviation;
  const left = points.reduce((a, b) => a[0] < b[0] ? a : b)[0] + deviation;
  const right = points.reduce((a, b) => a[0] > b[0] ? a : b)[0] - deviation;
  const polygonRect = {top, bottom, left, right};

  const searchContainers = getSearchFunction(polygonRect);
  traverse(elements, searchContainers);
  return searchContainers.minAreaContainer();
}

const fs = require('fs');
const myArgs = process.argv.slice(2);
const elementsPath = myArgs[0];
const dataJSON = myArgs[1];
const elements = JSON.parse(fs.readFileSync(elementsPath, {encoding: 'utf-8'}));
console.log(dataJSON);
const data = JSON.parse(dataJSON);
const deviation = 15;

console.log(JSON.stringify(getContainerNode(elements, data[0].points, deviation), undefined, 2))