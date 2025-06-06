import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

import { useListStore } from "../../stores/listStore";
import CreateListModal from "./CreateListModal";
import EditListModal from "./EditListModal";
import ConfirmDialog from "../ui/ConfirmDialog";
import Button from "../ui/Button";
import SortableListCard from "./SortableListCard";
import type { List } from "../../types";

const ListsDashboard: React.FC = () => {
  const {
    lists,
    isLoading,
    error,
    fetchLists,
    deleteList,
    reorderLists,
    subscribeToLists,
    unsubscribeFromLists,
    clearError,
  } = useListStore();

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load lists on mount and set up real-time subscription
  useEffect(() => {
    fetchLists();
    subscribeToLists();

    return () => {
      unsubscribeFromLists();
    };
  }, [fetchLists, subscribeToLists, unsubscribeFromLists]);

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = lists.findIndex((list) => list.id === active.id);
      const newIndex = lists.findIndex((list) => list.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(lists, oldIndex, newIndex);
        const listIds = newOrder.map((list) => list.id);

        try {
          await reorderLists(listIds);
        } catch (error) {
          console.error("Failed to reorder lists:", error);
        }
      }
    }
  };

  // Handle list actions
  const handleEditList = (list: List) => {
    setSelectedList(list);
    setShowEditModal(true);
  };

  const handleDeleteList = (list: List) => {
    setSelectedList(list);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedList) return;

    try {
      setIsDeleting(true);
      await deleteList(selectedList.id);
      setShowDeleteDialog(false);
      setSelectedList(null);
    } catch (error) {
      console.error("Failed to delete list:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setSelectedList(null);
  };

  // Calculate statistics
  const totalTasks = lists.reduce(
    (sum, list) => sum + ((list as any).taskCount ?? 0),
    0
  );
  const totalLists = lists.length;

  if (isLoading && lists.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Lists</h2>
          <p className="text-gray-600 mt-1">
            {totalLists} {totalLists === 1 ? "list" : "lists"} • {totalTasks}{" "}
            {totalTasks === 1 ? "task" : "tasks"}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New List
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Lists Grid */}
      {lists.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No lists yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first list to start organizing your tasks
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Your First List
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
          <SortableContext
            items={lists.map((list) => list.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {lists.map((list) => (
                <SortableListCard
                  key={list.id}
                  list={list}
                  onEdit={handleEditList}
                  onDelete={handleDeleteList}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modals */}
      <CreateListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <EditListModal
        isOpen={showEditModal}
        list={selectedList}
        onClose={() => {
          setShowEditModal(false);
          setSelectedList(null);
        }}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete List"
        message={`Are you sure you want to delete "${selectedList?.name}"? This action cannot be undone and will also delete all tasks in this list.`}
        confirmText="Delete List"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ListsDashboard;
