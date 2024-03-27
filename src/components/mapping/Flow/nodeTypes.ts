'use client';

import DataNode from './components/DataNode';
import FloatingEdge from './components/FloatingEdge';
import ObjectNode from './components/ObjectNode';
import UriNode from './components/UriNode';

const nodeTypes = {
  objectNode: ObjectNode,
  dataNode: DataNode,
  uriNode: UriNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

export { edgeTypes, nodeTypes };
