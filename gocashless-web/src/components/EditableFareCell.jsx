
"use client";
import { useState } from 'react';

const EditableFareCell = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };

  return isEditing ? (
    <input
      type="number"
      value={currentValue}
      onChange={(e) => setCurrentValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => e.key === 'Enter' && handleSave()}
      className="w-20 text-center"
      autoFocus
    />
  ) : (
    <div onClick={() => setIsEditing(true)} className="cursor-pointer">
      {value}
    </div>
  );
};

export default EditableFareCell;
