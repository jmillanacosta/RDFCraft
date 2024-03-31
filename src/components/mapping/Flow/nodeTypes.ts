'use client';

import DataNode from './components/DataNode';
import FloatingEdge from './components/FloatingEdge';
import ObjectNode from './components/ObjectNode';
import UriNode from './components/UriNode';

const nodeTypes = {
  object: ObjectNode,
  literal: DataNode,
  uriref: UriNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

export { edgeTypes, nodeTypes };
