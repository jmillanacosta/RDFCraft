import WorkspaceService from '@/lib/api/WorkspaceService';
import { ZustandActions } from '@/lib/global';
import {
  EdgeDataModel,
  LiteralNodeDataModel,
  MappingDocument,
  MappingModel,
  ObjectNodeDataModel,
  UriRefNodeDataModel,
} from '@/lib/models/MappingModel';
import { WorkspaceModel } from '@/lib/models/Workspace';
import {
  Edge,
  EdgeChange,
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
    };
  });

  const edges: Edge[] = mappingModel.edges.map(edge => {
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
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
  loading: boolean;
  error: string | null;
};

type MappingActions = {
  fetch: (workspaceId: string, mappingId: string) => void;
  save: (mappingModel: MappingModel) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateNodeData: (
    nodeId: string,
    data: Partial<
      ObjectNodeDataModel | UriRefNodeDataModel | LiteralNodeDataModel
    >,
  ) => void;
};

const defaultState: MappingState = {
  workspace: null,
  mappingDocument: null,
  workingCopy: null,
  nodes: [],
  edges: [],
  loading: false,
  error: null,
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
  save: async (mappingModel: MappingModel) => {
    try {
      // Save the mapping document
      // Save the workspace
      set({ loading: false });
    } catch (error) {
      set({ error: 'An unexpected error occurred', loading: false });
    }
  },
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  updateNodeData: (
    nodeId: string,
    data: Partial<
      ObjectNodeDataModel | UriRefNodeDataModel | LiteralNodeDataModel
    >,
  ) => {
    const nodes = get().nodes.map(node => {
      if (node.id === nodeId) {
        node.data = {
          ...node.data,
          ...data,
        };
      }
      return node;
    });

    set({ nodes });
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
