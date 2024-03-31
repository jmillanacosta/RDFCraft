import MappingService from '@/lib/api/MappingService';
import WorkspaceService from '@/lib/api/WorkspaceService';
import { ZustandActions } from '@/lib/global';
import {
  EdgeDataModel,
  EdgeModel,
  LiteralNodeDataModel,
  MappingDocument,
  MappingModel,
  NodeModel,
  ObjectNodeDataModel,
  UriRefNodeDataModel,
} from '@/lib/models/MappingModel';
import { WorkspaceModel } from '@/lib/models/Workspace';
import {
  Edge,
  EdgeChange,
  MarkerType,
  Node,
  NodeChange,
  OnEdgesChange,
  OnNodesChange,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const mappingModelToReactFlow = (
  mappingModel: MappingModel | null,
): {
  nodes: Node[];
  edges: Edge[];
} => {
  if (!mappingModel) {
    return {
      nodes: [],
      edges: [],
    };
  }
  const nodes: Node[] = mappingModel.nodes.map(node => {
    return {
      id: node.id,
      type: node.type,
      data: node.data,
      position: node.position,
      width: node.width,
      height: node.height,
      style: {
        width: node.width,
        height: node.height,
      },
    };
  });

  const edges: Edge[] = mappingModel.edges.map(edge => {
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'floating',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      data: edge.data,
    };
  });

  return {
    nodes,
    edges,
  };
};

type MappingState = {
  workspace: WorkspaceModel | null;
  mappingDocument: MappingDocument | null;
  workingCopy: MappingModel | null;
  nodes: Node<
    ObjectNodeDataModel | LiteralNodeDataModel | UriRefNodeDataModel
  >[];
  edges: Edge<EdgeDataModel>[];
  isSaved: boolean;
  loading: boolean;
  error: string | null;
};

type MappingActions = {
  fetch: (workspaceId: string, mappingId: string) => void;
  save: () => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateNodeData: (
    nodeId: string,
    data: Partial<
      ObjectNodeDataModel | UriRefNodeDataModel | LiteralNodeDataModel
    >,
  ) => void;
  importMappingModel: (model: Partial<MappingModel>) => void;
};

const defaultState: MappingState = {
  workspace: null,
  mappingDocument: null,
  workingCopy: null,
  nodes: [],
  edges: [],
  loading: false,
  error: null,
  isSaved: false,
};

const functions: ZustandActions<MappingActions, MappingState> = (set, get) => ({
  fetch: async (workspaceId: string, mappingId: string) => {
    set({
      loading: true,
    });
    try {
      const workspace = await WorkspaceService.fetchWorkspaceById(workspaceId);
      if (workspace.success) {
        const mapping = workspace.data.mappings.find(
          mapping => mapping.id === mappingId,
        );
        if (!mapping) {
          set({
            error: 'Mapping not found',
            loading: false,
          });
          return;
        }
        const { nodes, edges } = mappingModelToReactFlow(
          mapping.current_mapping,
        );
        set({
          workspace: workspace.data,
          mappingDocument: workspace.data.mappings.find(
            mapping => mapping.id === mappingId,
          ),
          workingCopy: workspace.data.mappings.find(
            mapping => mapping.id === mappingId,
          )?.current_mapping,
          nodes,
          edges,
          loading: false,
          isSaved: true,
          error: null,
        });
        return;
      }
      set({
        error: workspace.message,
        loading: false,
      });
    } catch (error) {
      set({ error: 'An unexpected error occurred', loading: false });
    }
  },
  save: async () => {
    try {
      const mappingModel: Partial<MappingModel> = {
        nodes: get().nodes as NodeModel[],
        edges: get().edges as EdgeModel[],
      };
      const response = await MappingService.saveMapping(
        get().mappingDocument!._id || get().mappingDocument!.id,
        mappingModel,
      );
      if (response.success) {
        const { nodes, edges } = mappingModelToReactFlow(
          response.data.current_mapping,
        );
        set({
          workingCopy: response.data.current_mapping,
          mappingDocument: response.data,
          nodes,
          edges,
          isSaved: true,
          loading: false,
          error: null,
        });
      } else {
        set({ error: response.message });
      }
    } catch (error) {
      set({ error: 'An unexpected error occurred', loading: false });
    }
  },
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
      isSaved: false,
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
      isSaved: false,
    });
  },
  updateNodeData: (
    nodeId: string,
    data: Partial<
      ObjectNodeDataModel | UriRefNodeDataModel | LiteralNodeDataModel
    >,
  ) => {
    set({
      nodes: get().nodes.map(node => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            ...data,
          };
        }
        return node;
      }),
      isSaved: false,
    });
  },
  importMappingModel: (model: Partial<MappingModel>) => {
    const nodesChanges = model.nodes?.map(node => {
      return {
        type: 'add',
        item: {
          id: node.id,
          type: node.type,
          data: node.data,
          position: node.position,
          width: node.width,
          height: node.height,
          style: {
            width: node.width,
            height: node.height,
          },
        },
      } as NodeChange;
    });
    const edgesChanges = model.edges?.map(edge => {
      return {
        type: 'add',
        item: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: 'floating',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          data: edge.data,
        },
      } as EdgeChange;
    });

    get().onNodesChange(nodesChanges || []);
    get().onEdgesChange(edgesChanges || []);
  },
});

const useMappingStore = create<MappingState & MappingActions>()(
  devtools(
    (set, get) => ({
      ...defaultState,
      ...functions(set, get),
    }),
    {
      name: 'MappingStore',
    },
  ),
);

export default useMappingStore;
