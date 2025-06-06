import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { db, subscriptions } from '../services/supabase';
import type { List, CreateListForm } from '../types';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface ListState {
  lists: List[];
  isLoading: boolean;
  error: string | null;
  selectedListId: string | null;
}

interface ListActions {
  // Data fetching
  fetchLists: () => Promise<void>;
  
  // CRUD operations
  createList: (data: CreateListForm) => Promise<List>;
  updateList: (id: string, updates: Partial<List>) => Promise<List>;
  deleteList: (id: string) => Promise<void>;
  
  // List management
  reorderLists: (listIds: string[]) => Promise<void>;
  selectList: (id: string | null) => void;
  
  // State management
  setLists: (lists: List[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Real-time subscriptions
  subscribeToLists: () => RealtimeChannel;
  unsubscribeFromLists: () => void;
}

type ListStore = ListState & ListActions;

let listsSubscription: RealtimeChannel | null = null;

export const useListStore = create<ListStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      lists: [],
      isLoading: false,
      error: null,
      selectedListId: null,

      // Data fetching
      fetchLists: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await db.lists.getAll();
          
          if (error) {
            throw error;
          }
          
          // Transform the data to include task counts
          const listsWithCounts = (data || []).map(list => ({
            ...list,
            taskCount: Array.isArray(list.tasks) ? list.tasks[0]?.count || 0 : 0,
          }));
          
          set({ lists: listsWithCounts });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch lists' 
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // CRUD operations
      createList: async (data: CreateListForm) => {
        try {
          set({ error: null });
          
          // Get current lists to determine position
          const { lists } = get();
          const position = lists.length;
          
          const { data: newList, error } = await db.lists.create({
            name: data.name,
            description: data.description || null,
            color: data.color || '#3B82F6',
            position,
          });
          
          if (error) {
            throw error;
          }
          
          if (newList) {
            // Add to local state
            const listWithCount = { ...newList, taskCount: 0 };
            set(state => ({ 
              lists: [...state.lists, listWithCount] 
            }));
            
            return listWithCount;
          }
          
          throw new Error('Failed to create list');
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create list' 
          });
          throw error;
        }
      },

      updateList: async (id: string, updates: Partial<List>) => {
        try {
          set({ error: null });
          
          const { data: updatedList, error } = await db.lists.update(id, updates);
          
          if (error) {
            throw error;
          }
          
          if (updatedList) {
            // Update local state
            set(state => ({
              lists: state.lists.map(list => 
                list.id === id 
                  ? { ...list, ...updatedList }
                  : list
              )
            }));
            
            return updatedList;
          }
          
          throw new Error('Failed to update list');
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update list' 
          });
          throw error;
        }
      },

      deleteList: async (id: string) => {
        try {
          set({ error: null });
          
          const { error } = await db.lists.delete(id);
          
          if (error) {
            throw error;
          }
          
          // Remove from local state
          set(state => ({
            lists: state.lists.filter(list => list.id !== id),
            selectedListId: state.selectedListId === id ? null : state.selectedListId
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete list' 
          });
          throw error;
        }
      },

      // List management
      reorderLists: async (listIds: string[]) => {
        try {
          set({ error: null });
          
          // Update positions in database
          const updates = listIds.map((id, index) => 
            db.lists.update(id, { position: index })
          );
          
          await Promise.all(updates);
          
          // Update local state
          const { lists } = get();
          const reorderedLists = listIds.map(id => 
            lists.find(list => list.id === id)!
          ).filter(Boolean);
          
          set({ lists: reorderedLists });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to reorder lists' 
          });
          throw error;
        }
      },

      selectList: (id: string | null) => {
        set({ selectedListId: id });
      },

      // State management
      setLists: (lists) => set({ lists }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Real-time subscriptions
      subscribeToLists: () => {
        if (listsSubscription) {
          return listsSubscription;
        }
        
        listsSubscription = subscriptions.lists((payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          
          set(state => {
            let newLists = [...state.lists];
            
            switch (eventType) {
              case 'INSERT':
                if (newRecord) {
                  const listWithCount = { ...newRecord, taskCount: 0 };
                  newLists.push(listWithCount);
                }
                break;
                
              case 'UPDATE':
                if (newRecord) {
                  const index = newLists.findIndex(list => list.id === newRecord.id);
                  if (index !== -1) {
                    newLists[index] = { ...newLists[index], ...newRecord };
                  }
                }
                break;
                
              case 'DELETE':
                if (oldRecord) {
                  newLists = newLists.filter(list => list.id !== oldRecord.id);
                }
                break;
            }
            
            // Sort by position
            newLists.sort((a, b) => a.position - b.position);
            
            return { lists: newLists };
          });
        });
        
        return listsSubscription;
      },

      unsubscribeFromLists: () => {
        if (listsSubscription) {
          listsSubscription.unsubscribe();
          listsSubscription = null;
        }
      },
    }),
    {
      name: 'list-store',
    }
  )
);
