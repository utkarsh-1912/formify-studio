import React, { useState } from "react";
import {
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { AppThemeTokens } from "../utils/appTheme";

interface VisualBuilderProps {
  schema: any;
  themeTokens: AppThemeTokens;
  onSchemaChange: (updatedSchema: any) => void;
}

const VisualBuilder: React.FC<VisualBuilderProps> = ({ schema, themeTokens, onSchemaChange }) => {
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);

  const fields = schema.fields || [];

  const updateSchema = (updatedFields: any[]) => {
    onSchemaChange({
      ...schema,
      fields: updatedFields
    });
  };

  const handleFieldChange = (index: number, updatedField: any) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    updateSchema(newFields);
  };

  const handleAddField = (type: string) => {
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
    e.stopPropagation();
    const newFields = fields.filter((_: any, i: number) => i !== index);
    updateSchema(newFields);
  };

  const handleMoveField = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
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

  const handleOptionChange = (fieldIndex: number, optIndex: number, key: "value" | "label", value: string) => {
    const field = fields[fieldIndex];
    const newOptions = [...(field.options || [])];
    newOptions[optIndex] = {
      ...newOptions[optIndex],
      [key]: value
    };
    handleFieldChange(fieldIndex, {
      ...field,
      options: newOptions
    });
  };

  const handleAddOption = (fieldIndex: number) => {
    const field = fields[fieldIndex];
    const newOptions = [...(field.options || []), { value: `option_${Date.now()}`, label: "New Option" }];
    handleFieldChange(fieldIndex, {
      ...field,
      options: newOptions
    });
  };

  const handleRemoveOption = (fieldIndex: number, optIndex: number) => {
    const field = fields[fieldIndex];
    const newOptions = (field.options || []).filter((_: any, i: number) => i !== optIndex);
    handleFieldChange(fieldIndex, {
      ...field,
      options: newOptions
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedFieldId(expandedFieldId === id ? null : id);
  };

  const handleMetaChange = (key: "formTitle" | "formDescription", value: string) => {
    onSchemaChange({
      ...schema,
      [key]: value
    });
  };

  const subLabelClass = `block text-xs font-bold uppercase tracking-wider mb-1 ${themeTokens.textSecondary}`;
  const inputClass = `w-full p-2 border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.inputText} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`;

  return (
    <div className={`p-6 h-full overflow-y-auto space-y-6 ${themeTokens.sidebar}`}>
      <div>
        <h3 className={`text-lg font-bold ${themeTokens.text}`}>Visual Form Builder</h3>
        <p className={`text-xs mt-0.5 ${themeTokens.textSecondary}`}>
          Interactively manage form metadata and input fields. Changes are bidirectionally synced with the JSON editor.
        </p>
      </div>

      {/* Form Title & Description Section */}
      <div className={`p-5 rounded-xl border ${themeTokens.border} ${themeTokens.card} space-y-4 shadow-sm`}>
        <div>
          <label className={subLabelClass}>Form Heading Title</label>
          <input
            type="text"
            value={schema.formTitle || ""}
            onChange={(e) => handleMetaChange("formTitle", e.target.value)}
            placeholder="Enter form title..."
            className={inputClass}
          />
        </div>
        <div>
          <label className={subLabelClass}>Form Description</label>
          <textarea
            value={schema.formDescription || ""}
            onChange={(e) => handleMetaChange("formDescription", e.target.value)}
            placeholder="Enter form description..."
            rows={2}
            className={`${inputClass} resize-none`}
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
            No fields defined. Select an element type below to append your first form field!
          </div>
        ) : (
          <div className="space-y-2.5">
            {fields.map((field: any, idx: number) => {
              const isExpanded = expandedFieldId === field.id;
              return (
                <div
                  key={field.id || idx}
                  className={`rounded-xl border transition-all duration-150 shadow-sm ${themeTokens.card} ${
                    isExpanded ? "ring-1 ring-blue-500/50 border-blue-500" : `hover:border-gray-300 dark:hover:border-gray-600`
                  }`}
                >
                  {/* Field Header Summary */}
                  <div
                    onClick={() => toggleExpand(field.id)}
                    className="flex justify-between items-center p-3.5 cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${themeTokens.inputBg} ${themeTokens.textSecondary} border ${themeTokens.border}`}>
                        {field.type}
                      </span>
                      <span className={`font-semibold text-sm truncate ${themeTokens.text}`}>
                        {field.label || "Untitled Field"}
                      </span>
                      {field.required && (
                        <span className="text-xs text-red-500 font-bold">* Required</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      {/* Reordering */}
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
                        disabled={idx === fields.length - 1}
                        className={`p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30 rounded cursor-pointer`}
                        title="Move Down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={(e) => handleRemoveField(idx, e)}
                        className={`p-1 text-gray-400 hover:text-red-500 rounded cursor-pointer`}
                        title="Delete Field"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

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
                          <label className={`block text-xs font-semibold mb-1 ${themeTokens.textSecondary}`}>Field Unique ID / Key</label>
                          <input
                            type="text"
                            value={field.id || ""}
                            onChange={(e) => handleFieldChange(idx, { ...field, id: e.target.value })}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-semibold mb-1 ${themeTokens.textSecondary}`}>Display Label</label>
                          <input
                            type="text"
                            value={field.label || ""}
                            onChange={(e) => handleFieldChange(idx, { ...field, label: e.target.value })}
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* Placeholder & Required Checkbox */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        {field.type !== "checkbox" && field.type !== "radio" && (
                          <div>
                            <label className={`block text-xs font-semibold mb-1 ${themeTokens.textSecondary}`}>Placeholder Help Text</label>
                            <input
                              type="text"
                              value={field.placeholder || ""}
                              onChange={(e) => handleFieldChange(idx, { ...field, placeholder: e.target.value })}
                              className={inputClass}
                            />
                          </div>
                        )}
                        <div className="flex items-center space-x-2 pt-4">
                          <input
                            type="checkbox"
                            id={`req-${field.id}`}
                            checked={field.required || false}
                            onChange={(e) => handleFieldChange(idx, { ...field, required: e.target.checked })}
                            className="h-4.5 w-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                          />
                          <label htmlFor={`req-${field.id}`} className={`text-xs font-semibold cursor-pointer ${themeTokens.text}`}>
                            Required Field Validation
                          </label>
                        </div>
                      </div>

                      {/* Regex Validation Pattern (if not selection/checkbox) */}
                      {field.type !== "checkbox" && field.type !== "radio" && field.type !== "select" && (
                        <div className={`border ${themeTokens.border} p-3 rounded-lg space-y-3`}>
                          <span className={`block text-xs font-bold uppercase tracking-wider ${themeTokens.text}`}>Format Regex Validation</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className={`block text-xs mb-1 ${themeTokens.textSecondary}`}>Regex Pattern String</label>
                              <input
                                type="text"
                                value={field.validation?.pattern || ""}
                                onChange={(e) =>
                                  handleFieldChange(idx, {
                                    ...field,
                                    validation: { ...(field.validation || {}), pattern: e.target.value }
                                  })
                                }
                                placeholder="e.g. ^[0-9]{5}$"
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className={`block text-xs mb-1 ${themeTokens.textSecondary}`}>Error Message Display</label>
                              <input
                                type="text"
                                value={field.validation?.message || ""}
                                onChange={(e) =>
                                  handleFieldChange(idx, {
                                    ...field,
                                    validation: { ...(field.validation || {}), message: e.target.value }
                                  })
                                }
                                placeholder="Please enter 5 digits"
                                className={inputClass}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Options management for Select and Radio */}
                      {(field.type === "select" || field.type === "radio") && (
                        <div className={`border ${themeTokens.border} p-3 rounded-lg space-y-3`}>
                          <div className="flex justify-between items-center">
                            <span className={`block text-xs font-bold uppercase tracking-wider ${themeTokens.text}`}>Choices / Options</span>
                            <button
                              onClick={() => handleAddOption(idx)}
                              className="text-xs text-blue-500 hover:text-blue-600 font-semibold flex items-center space-x-1 cursor-pointer focus:outline-none"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Add Option</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {(field.options || []).map((opt: any, optIdx: number) => (
                              <div key={optIdx} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={opt.value || ""}
                                  onChange={(e) => handleOptionChange(idx, optIdx, "value", e.target.value)}
                                  placeholder="Value (e.g. tech)"
                                  className={`${inputClass} !p-1.5`}
                                />
                                <input
                                  type="text"
                                  value={opt.label || ""}
                                  onChange={(e) => handleOptionChange(idx, optIdx, "label", e.target.value)}
                                  placeholder="Label (e.g. Technology)"
                                  className={`${inputClass} !p-1.5`}
                                />
                                <button
                                  onClick={() => handleRemoveOption(idx, optIdx)}
                                  disabled={(field.options || []).length <= 1}
                                  className="p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-30 rounded cursor-pointer"
                                  title="Delete Option"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toolbox: Add New Field Buttons */}
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
    </div>
  );
};

export default VisualBuilder;
