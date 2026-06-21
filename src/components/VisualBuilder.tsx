import React, { useState, useEffect } from "react";
import {
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  ChevronDown,
  ChevronUp,
  GripVertical
} from "lucide-react";
import { AppThemeTokens } from "../utils/appTheme";

interface VisualBuilderProps {
  schema: any;
  themeTokens: AppThemeTokens;
  onSchemaChange: (updatedSchema: any) => void;
  readOnly?: boolean;
}

interface FieldEditorCardProps {
  field: any;
  idx: number;
  readOnly: boolean;
  themeTokens: AppThemeTokens;
  expandedFieldId: string | null;
  toggleExpand: (id: string) => void;
  handleMoveField: (index: number, direction: "up" | "down", e: React.MouseEvent) => void;
  handleRemoveField: (index: number, e: React.MouseEvent) => void;
  handleFieldChange: (index: number, updatedField: any) => void;
  draggedIndex: number | null;
  handleDragStart: (e: React.DragEvent, index: number) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDragEnd: () => void;
  handleDrop: (e: React.DragEvent, targetIndex: number) => void;
  fieldsCount: number;
}

const FieldEditorCard: React.FC<FieldEditorCardProps> = ({
  field,
  idx,
  readOnly,
  themeTokens,
  expandedFieldId,
  toggleExpand,
  handleMoveField,
  handleRemoveField,
  handleFieldChange,
  draggedIndex,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  handleDrop,
  fieldsCount
}) => {
  const [localField, setLocalField] = useState(field);

  useEffect(() => {
    setLocalField(field);
  }, [field]);

  const isExpanded = expandedFieldId === field.id;

  const handleTextChange = (key: string, value: string) => {
    setLocalField((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleBlur = () => {
    if (!readOnly) {
      handleFieldChange(idx, localField);
    }
  };

  const handleRequiredToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...localField, required: e.target.checked };
    setLocalField(updated);
    if (!readOnly) {
      handleFieldChange(idx, updated);
    }
  };

  const handleRegexChange = (key: "pattern" | "message", value: string) => {
    const updated = {
      ...localField,
      validation: {
        ...(localField.validation || {}),
        [key]: value
      }
    };
    setLocalField(updated);
  };

  const handleOptionTextChange = (optIdx: number, key: "value" | "label", value: string) => {
    const newOptions = [...(localField.options || [])];
    newOptions[optIdx] = {
      ...newOptions[optIdx],
      [key]: value
    };
    const updated = { ...localField, options: newOptions };
    setLocalField(updated);
  };

  const handleAddOption = () => {
    if (readOnly) return;
    const newOptions = [...(localField.options || []), { value: `option_${Date.now()}`, label: "New Option" }];
    const updated = { ...localField, options: newOptions };
    setLocalField(updated);
    handleFieldChange(idx, updated);
  };

  const handleRemoveOption = (optIdx: number) => {
    if (readOnly) return;
    const newOptions = (localField.options || []).filter((_: any, i: number) => i !== optIdx);
    const updated = { ...localField, options: newOptions };
    setLocalField(updated);
    handleFieldChange(idx, updated);
  };

  const subLabelClass = `block text-xs font-semibold mb-1 ${themeTokens.textSecondary}`;
  const inputClass = `w-full p-2 border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.inputText} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`;

  return (
    <div
      draggable={!readOnly}
      onDragStart={(e) => handleDragStart(e, idx)}
      onDragOver={(e) => handleDragOver(e, idx)}
      onDragEnd={handleDragEnd}
      onDrop={(e) => handleDrop(e, idx)}
      className={`rounded-xl border transition-all duration-150 shadow-sm ${themeTokens.card} ${
        isExpanded ? "ring-1 ring-blue-500/50 border-blue-500" : `hover:border-gray-300 dark:hover:border-gray-600`
      } ${draggedIndex === idx ? "opacity-40 border-dashed border-blue-500 bg-blue-50/20 dark:bg-blue-950/20" : ""}`}
    >
      {/* Field Header Summary */}
      <div
        onClick={() => toggleExpand(field.id)}
        className="flex justify-between items-center p-3.5 cursor-pointer select-none"
      >
        <div className="flex items-center space-x-3 truncate">
          {!readOnly && (
            <div className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-0.5 flex-shrink-0" title="Drag to Reorder">
              <GripVertical className="h-4 w-4" />
            </div>
          )}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${themeTokens.inputBg} ${themeTokens.textSecondary} border ${themeTokens.border}`}>
            {field.type}
          </span>
          <span className={`font-semibold text-sm truncate ${themeTokens.text}`}>
            {localField.label || "Untitled Field"}
          </span>
          {localField.required && (
            <span className="text-xs text-red-500 font-bold">* Required</span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          {/* Reordering (only if not view-only) */}
          {!readOnly && (
            <>
              <button
                onClick={(e) => handleMoveField(idx, "up", e)}
                disabled={idx === 0}
                className={`p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30 rounded cursor-pointer`}
                title="Move Up"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => handleMoveField(idx, "down", e)}
                disabled={idx === fieldsCount - 1}
                className={`p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30 rounded cursor-pointer`}
                title="Move Down"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => handleRemoveField(idx, e)}
                className={`p-1 text-gray-400 hover:text-red-500 rounded cursor-pointer`}
                title="Delete Field"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Toggle Expand Icon */}
          <div className="text-gray-400 pl-1">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Editor Form */}
      {isExpanded && (
        <div className={`p-4 border-t ${themeTokens.border} rounded-b-xl space-y-4 text-sm bg-black/5`}>
          {/* Field ID / Key and Label */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={subLabelClass}>Field Unique ID / Key</label>
              <input
                type="text"
                value={localField.id || ""}
                onChange={(e) => handleTextChange("id", e.target.value)}
                onBlur={handleBlur}
                readOnly={readOnly}
                className={`${inputClass} ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`}
              />
            </div>
            <div>
              <label className={subLabelClass}>Display Label</label>
              <input
                type="text"
                value={localField.label || ""}
                onChange={(e) => handleTextChange("label", e.target.value)}
                onBlur={handleBlur}
                readOnly={readOnly}
                className={`${inputClass} ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`}
              />
            </div>
          </div>

          {/* Placeholder & Required Checkbox */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {localField.type !== "checkbox" && localField.type !== "radio" && (
              <div>
                <label className={subLabelClass}>Placeholder Help Text</label>
                <input
                  type="text"
                  value={localField.placeholder || ""}
                  onChange={(e) => handleTextChange("placeholder", e.target.value)}
                  onBlur={handleBlur}
                  readOnly={readOnly}
                  className={`${inputClass} ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`}
                />
              </div>
            )}
            <div className="flex items-center space-x-2 pt-4">
              <input
                type="checkbox"
                id={`req-${localField.id}`}
                checked={localField.required || false}
                onChange={handleRequiredToggle}
                disabled={readOnly}
                className="h-4.5 w-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50"
              />
              <label htmlFor={`req-${localField.id}`} className={`text-xs font-semibold cursor-pointer ${themeTokens.text}`}>
                Required Field Validation
              </label>
            </div>
          </div>

          {/* Regex Validation Pattern (if not selection/checkbox) */}
          {localField.type !== "checkbox" && localField.type !== "radio" && localField.type !== "select" && (
            <div className={`border ${themeTokens.border} p-3 rounded-lg space-y-3`}>
              <span className={`block text-xs font-bold uppercase tracking-wider ${themeTokens.text}`}>Format Regex Validation</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs mb-1 ${themeTokens.textSecondary}`}>Regex Pattern String</label>
                  <input
                    type="text"
                    value={localField.validation?.pattern || ""}
                    onChange={(e) => handleRegexChange("pattern", e.target.value)}
                    onBlur={handleBlur}
                    readOnly={readOnly}
                    placeholder="e.g. ^[0-9]{5}$"
                    className={`${inputClass} ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${themeTokens.textSecondary}`}>Error Message Display</label>
                  <input
                    type="text"
                    value={localField.validation?.message || ""}
                    onChange={(e) => handleRegexChange("message", e.target.value)}
                    onBlur={handleBlur}
                    readOnly={readOnly}
                    placeholder="Please enter 5 digits"
                    className={`${inputClass} ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Options management for Select and Radio */}
          {(localField.type === "select" || localField.type === "radio") && (
            <div className={`border ${themeTokens.border} p-3 rounded-lg space-y-3`}>
              <div className="flex justify-between items-center">
                <span className={`block text-xs font-bold uppercase tracking-wider ${themeTokens.text}`}>Choices / Options</span>
                {!readOnly && (
                  <button
                    onClick={handleAddOption}
                    className="text-xs text-blue-500 hover:text-blue-600 font-semibold flex items-center space-x-1 cursor-pointer focus:outline-none"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Option</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {(localField.options || []).map((opt: any, optIdx: number) => (
                  <div key={optIdx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={opt.value || ""}
                      onChange={(e) => handleOptionTextChange(optIdx, "value", e.target.value)}
                      onBlur={handleBlur}
                      readOnly={readOnly}
                      placeholder="Value (e.g. tech)"
                      className={`${inputClass} !p-1.5 ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`}
                    />
                    <input
                      type="text"
                      value={opt.label || ""}
                      onChange={(e) => handleOptionTextChange(optIdx, "label", e.target.value)}
                      onBlur={handleBlur}
                      readOnly={readOnly}
                      placeholder="Label (e.g. Technology)"
                      className={`${inputClass} !p-1.5 ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`}
                    />
                    {!readOnly && (
                      <button
                        onClick={() => handleRemoveOption(optIdx)}
                        disabled={(localField.options || []).length <= 1}
                        className="p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-30 rounded cursor-pointer"
                        title="Delete Option"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const VisualBuilder: React.FC<VisualBuilderProps> = ({ schema, themeTokens, onSchemaChange, readOnly = false }) => {
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [localTitle, setLocalTitle] = useState(schema.formTitle || "");
  const [localDesc, setLocalDesc] = useState(schema.formDescription || "");

  useEffect(() => {
    setLocalTitle(schema.formTitle || "");
  }, [schema.formTitle]);

  useEffect(() => {
    setLocalDesc(schema.formDescription || "");
  }, [schema.formDescription]);

  const handleMetaBlur = (key: "formTitle" | "formDescription", value: string) => {
    if (!readOnly && schema[key] !== value) {
      onSchemaChange({
        ...schema,
        [key]: value
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (readOnly) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (readOnly) return;
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newFields = [...fields];
    const [draggedItem] = newFields.splice(draggedIndex, 1);
    newFields.splice(targetIndex, 0, draggedItem);
    
    updateSchema(newFields);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const fields = schema.fields || [];

  const updateSchema = (updatedFields: any[]) => {
    if (readOnly) return;
    onSchemaChange({
      ...schema,
      fields: updatedFields
    });
  };

  const handleFieldChange = (index: number, updatedField: any) => {
    if (readOnly) return;
    const newFields = [...fields];
    newFields[index] = updatedField;
    updateSchema(newFields);
  };

  const handleAddField = (type: string) => {
    if (readOnly) return;
    const id = `field_${Date.now()}`;
    const newField: any = {
      id,
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false
    };

    if (type === "select" || type === "radio") {
      newField.options = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" }
      ];
    } else {
      newField.placeholder = "Enter value...";
    }

    const newFields = [...fields, newField];
    updateSchema(newFields);
    setExpandedFieldId(id);
  };

  const handleRemoveField = (index: number, e: React.MouseEvent) => {
    if (readOnly) return;
    e.stopPropagation();
    const newFields = fields.filter((_: any, i: number) => i !== index);
    updateSchema(newFields);
  };

  const handleMoveField = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    if (readOnly) return;
    e.stopPropagation();
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === fields.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newFields = [...fields];
    const temp = newFields[index];
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;
    updateSchema(newFields);
  };

  const toggleExpand = (id: string) => {
    setExpandedFieldId(expandedFieldId === id ? null : id);
  };

  const subLabelClass = `block text-xs font-bold uppercase tracking-wider mb-1 ${themeTokens.textSecondary}`;
  const inputClass = `w-full p-2 border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.inputText} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`;

  return (
    <div className={`p-6 h-full overflow-y-auto space-y-6 ${themeTokens.sidebar}`}>
      <div>
        <h3 className={`text-lg font-bold ${themeTokens.text} flex items-center`}>
          Visual Form Builder
          {readOnly && <span className="text-xs px-2 py-0.5 ml-2 border border-amber-500/25 bg-amber-500/10 text-amber-500 rounded-md font-mono">View Only</span>}
        </h3>
        <p className={`text-xs mt-0.5 ${themeTokens.textSecondary}`}>
          {readOnly ? "View form metadata and field elements in read-only mode." : "Interactively manage form metadata and input fields. Changes are bidirectionally synced with the JSON editor."}
        </p>
      </div>

      {/* Form Title & Description Section */}
      <div className={`p-5 rounded-xl border ${themeTokens.border} ${themeTokens.card} space-y-4 shadow-sm`}>
        <div>
          <label className={subLabelClass}>Form Heading Title</label>
          <input
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={() => handleMetaBlur("formTitle", localTitle)}
            placeholder="Enter form title..."
            readOnly={readOnly}
            className={`${inputClass} ${readOnly ? "opacity-75 cursor-not-allowed" : ""}`}
          />
        </div>
        <div>
          <label className={subLabelClass}>Form Description</label>
          <textarea
            value={localDesc}
            onChange={(e) => setLocalDesc(e.target.value)}
            onBlur={() => handleMetaBlur("formDescription", localDesc)}
            placeholder="Enter form description..."
            rows={2}
            readOnly={readOnly}
            className={`${inputClass} resize-none ${readOnly ? "opacity-75 cursor-not-allowed" : ""}`}
          />
        </div>
      </div>

      {/* Fields List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className={`block text-xs font-bold uppercase tracking-wider ${themeTokens.textSecondary}`}>
            Form Fields ({fields.length})
          </label>
        </div>

        {fields.length === 0 ? (
          <div className={`rounded-xl border border-dashed ${themeTokens.border} p-8 text-center text-sm ${themeTokens.textSecondary}`}>
            No fields defined.
          </div>
        ) : (
          <div className="space-y-2.5">
            {fields.map((field: any, idx: number) => (
              <FieldEditorCard
                key={field.id || idx}
                field={field}
                idx={idx}
                readOnly={readOnly}
                themeTokens={themeTokens}
                expandedFieldId={expandedFieldId}
                toggleExpand={toggleExpand}
                handleMoveField={handleMoveField}
                handleRemoveField={handleRemoveField}
                handleFieldChange={handleFieldChange}
                draggedIndex={draggedIndex}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
                handleDragEnd={handleDragEnd}
                handleDrop={handleDrop}
                fieldsCount={fields.length}
              />
            ))}
          </div>
        )}
      </div>

      {/* Toolbox: Add New Field Buttons */}
      {!readOnly && (
        <div className={`p-5 rounded-xl border ${themeTokens.border} ${themeTokens.card} space-y-3.5 shadow-sm`}>
          <label className={`block text-xs font-bold uppercase tracking-wider ${themeTokens.textSecondary}`}>Append New Form Element</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { type: "text", name: "Text Input" },
              { type: "email", name: "Email" },
              { type: "number", name: "Number" },
              { type: "date", name: "Date" },
              { type: "select", name: "Dropdown" },
              { type: "radio", name: "Radio List" },
              { type: "checkbox", name: "Checkbox" },
              { type: "textarea", name: "Paragraph" }
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => handleAddField(item.type)}
                className={`py-2 px-1 border ${themeTokens.border} hover:border-blue-500 rounded-lg text-xs font-semibold ${themeTokens.textSecondary} hover:text-blue-500 ${themeTokens.inputBg} hover:bg-blue-50/10 text-center transition-all cursor-pointer focus:outline-none flex flex-col items-center justify-center space-y-1 shadow-sm hover:shadow`}
              >
                <Plus className="h-3.5 w-3.5 text-blue-500" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualBuilder;
