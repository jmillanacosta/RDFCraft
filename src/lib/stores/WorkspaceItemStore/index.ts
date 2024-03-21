'use client';

import WorkspaceService from '@/lib/api/WorkspaceService';
import { PrefixModel } from '@/lib/models/PrefixModel';
import { WorkspaceModel } from '@/lib/models/Workspace';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type WorkspaceItemStoreState = {
  workspace: WorkspaceModel | null;
  loading: boolean;
  status_code: number;
  error: string | null;
};

type WorkspaceItemStoreActions = {
  fetchById: (id: string) => void;
  clear: () => void;
  addPrefix: (prefix: string, uri: string) => void;
  addBulkPrefix: (models: PrefixModel[]) => void;
  removePrefix: (prefixId: string) => void;
  addOntology: (
    name: string,
    description: string,
    prefix_id: string,
    file: File,
  ) => void;
  deleteOntology: (id: string) => void;
  assignPrefix: (ontologyId: string, prefixId: string) => void;
};

const defaultState: WorkspaceItemStoreState = {
  workspace: null,
  loading: false,
  status_code: 0,
  error: null,
};

const useWorkspaceItem = create<
  WorkspaceItemStoreState & WorkspaceItemStoreActions
>()(
  devtools(
    (set, get) => ({
      ...defaultState,
      fetchById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const workspace = await WorkspaceService.fetchWorkspaceById(id);
          if (workspace.success) {
            set({
              workspace: workspace.data,
              loading: false,
              error: null,
            });
            return;
          }
          set({
            error: workspace.message,
            loading: false,
            status_code: workspace.status,
          });
        } catch (error) {
          set({
            error: 'An unexpected error occurred',
            loading: false,
            status_code: 500,
          });
        }
      },
      clear: () => {
        set({ ...defaultState });
      },
      addPrefix: async (prefix: string, uri: string) => {
        set({ loading: true, error: null });
        if (!get().workspace) {
          set({
            error: 'Workspace not found, please go back and try again',
            loading: false,
            status_code: 404,
          });
          return;
        }
        try {
          const model = { _id: '', prefix, uri } as PrefixModel;
          const response = await WorkspaceService.addPrefixToWorkspace(
            get().workspace!._id,
            model,
          );
          if (!response.success) {
            set({
              error: response.message,
              loading: false,
              status_code: response.status,
            });
            return;
          }
          set({
            workspace: response.data,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: 'An unexpected error occurred',
            loading: false,
            status_code: 500,
          });
        }
      },
      addBulkPrefix: async (models: PrefixModel[]) => {
        set({ loading: true, error: null });
        if (!get().workspace) {
          set({
            error: 'Workspace not found, please go back and try again',
            loading: false,
            status_code: 404,
          });
          return;
        }
        try {
          const futures = models.map((model: any) =>
            WorkspaceService.addPrefixToWorkspace(get().workspace!._id, model),
          );
          const responses = await Promise.all(futures);
          const failedPrefixesIndexes = responses.reduce(
            (acc, response, index) => {
              if (!response.success) {
                acc.push(index);
              }
              return acc;
            },
            [] as number[],
          );
          if (failedPrefixesIndexes.length > 0) {
            const failedPrefixesString = failedPrefixesIndexes
              .map(index => models[index].prefix)
              .join(', ');
            set({
              error: `Failed to add following prefixes: ${failedPrefixesString}`,
              loading: false,
              status_code: 400,
            });
            return;
          }
          get().fetchById(get().workspace!._id);
        } catch (error) {
          set({
            error: 'An unexpected error occurred',
            loading: false,
            status_code: 500,
          });
        }
      },
      removePrefix: async (prefixId: string) => {
        set({ loading: true, error: null });
        if (!get().workspace) {
          set({
            error: 'Workspace not found, please go back and try again',
            loading: false,
            status_code: 404,
          });
          return;
        }
        try {
          const response = await WorkspaceService.removePrefixFromWorkspace(
            get().workspace!._id,
            prefixId,
          );
          if (!response.success) {
            set({
              error: response.message,
              loading: false,
              status_code: response.status,
            });
            return;
          }
          set({
            workspace: response.data,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: 'An unexpected error occurred',
            loading: false,
            status_code: 500,
          });
        }
      },
      addOntology: async (
        name: string,
        description: string,
        prefix_id: string,
        file: File,
      ) => {
        set({ loading: true, error: null });
        if (!get().workspace) {
          set({
            error: 'Workspace not found, please go back and try again',
            loading: false,
            status_code: 404,
          });
          return;
        }
        try {
          const response = await WorkspaceService.addOntologyToWorkspace(
            get().workspace!._id,
            name,
            description,
            prefix_id,
            file,
          );
          if (!response.success) {
            set({
              error: response.message,
              loading: false,
              status_code: response.status,
            });
            return;
          }
          set({
            workspace: response.data,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: 'An unexpected error occurred',
            loading: false,
            status_code: 500,
          });
        }
      },
      deleteOntology: async (id: string) => {
        set({ loading: true, error: null });
        if (!get().workspace) {
          set({
            error: 'Workspace not found, please go back and try again',
            loading: false,
            status_code: 404,
          });
          return;
        }
        try {
          const response = await WorkspaceService.removeOntologyFromWorkspace(
            get().workspace!._id,
            id,
          );
          if (!response.success) {
            set({
              error: response.message,
              loading: false,
              status_code: response.status,
            });
            return;
          }
          set({
            workspace: response.data,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: 'An unexpected error occurred',
            loading: false,
            status_code: 500,
          });
        }
      },
      assignPrefix: async (ontologyId: string, prefixId: string) => {
        set({ loading: true, error: null });
        if (!get().workspace) {
          set({
            error: 'Workspace not found, please go back and try again',
            loading: false,
            status_code: 404,
          });
          return;
        }
        try {
          const response = await WorkspaceService.assignPrefixToOntology(
            get().workspace!._id,
            ontologyId,
            prefixId,
          );
          if (!response.success) {
            set({
              error: response.message,
              loading: false,
              status_code: response.status,
            });
            return;
          }
          set({
            workspace: response.data,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: 'An unexpected error occurred',
            loading: false,
            status_code: 500,
          });
        }
      },
    }),
    {
      name: 'WorkspaceItemStore',
    },
  ),
);

export default useWorkspaceItem;
