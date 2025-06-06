import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ListCard from './ListCard';
import type { List } from '../../types';

interface SortableListCardProps {
  list: List & { taskCount?: number };
  onEdit?: (list: List) => void;
  onDelete?: (list: List) => void;
  onSelect?: (list: List) => void;
}

const SortableListCard: React.FC<SortableListCardProps> = ({
  list,
  onEdit,
  onDelete,
  onSelect,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ListCard
        list={list}
        onEdit={onEdit}
        onDelete={onDelete}
        onSelect={onSelect}
        isDragging={isDragging}
        dragHandleProps={listeners}
      />
    </div>
  );
};

export default SortableListCard;
