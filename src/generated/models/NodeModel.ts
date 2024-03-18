/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LiteralNodeDataModel } from './LiteralNodeDataModel';
import type { NodeType } from './NodeType';
import type { ObjectNodeDataModel } from './ObjectNodeDataModel';
import type { PositionModel } from './PositionModel';
import type { UriRefNodeDataModel } from './UriRefNodeDataModel';
export type NodeModel = {
    id: string;
    type: NodeType;
    position: PositionModel;
    width: number;
    height: number;
    data: (ObjectNodeDataModel | LiteralNodeDataModel | UriRefNodeDataModel);
};

