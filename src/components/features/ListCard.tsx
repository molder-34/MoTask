import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import type { List } from '../../types';
import { useListStore } from '../../stores/listStore';

interface ListCardProps {
  list: List & { taskCount?: number };
  onEdit?: (list: List) => void;
  onDelete?: (list: List) => void;
  onSelect?: (list: List) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

const ListCard: React.FC<ListCardProps> = ({
  list,
  onEdit,
  onDelete,
  onSelect,
  isDragging = false,
  dragHandleProps,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { selectList, selectedListId } = useListStore();
  
  const isSelected = selectedListId === list.id;
  const taskCount = list.taskCount || 0;
  const completedCount = 0; // TODO: Calculate from tasks when task store is implemented
  const completionRate = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  const handleCardClick = () => {
    selectList(list.id);
    onSelect?.(list);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit?.(list);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete?.(list);
  };

  return (
    <Card 
      className={`
        relative cursor-pointer transition-all duration-200 hover:shadow-md
        ${isSelected ? 'ring-2 ring-primary-500 shadow-md' : ''}
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
      `}
      onClick={handleCardClick}
    >
      {/* Drag Handle */}
      <div 
        {...dragHandleProps}
        className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100"
      >
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Menu Button */}
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMenuToggle}
          className="h-8 w-8 p-0 hover:bg-gray-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        </Button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-0 top-8 w-32 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
            <button
              onClick={handleEdit}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        {/* Color indicator */}
        <div 
          className="w-full h-1 rounded-full mb-3"
          style={{ backgroundColor: list.color }}
        />
        
        <div className="pr-16 pl-8">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {list.name}
          </h3>
          {list.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {list.description}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Task Statistics */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </span>
            {taskCount > 0 && (
              <span className="text-gray-600">
                {completionRate}% complete
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {taskCount > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          )}

          {/* Task Breakdown */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{completedCount} completed</span>
            <span>{taskCount - completedCount} remaining</span>
          </div>
        </div>
      </CardContent>

      {/* Click overlay to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </Card>
  );
};

export default ListCard;
