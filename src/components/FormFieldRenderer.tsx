import React from "react";
import { ThemeSettings, getThemeClasses } from "../utils/codeGenerators";
import { AppThemeTokens } from "../utils/appTheme";

interface FormFieldRendererProps {
  field: any;
  theme: ThemeSettings;
  themeTokens: AppThemeTokens;
  errors: Record<string, string>;
  fontFamily?: "sans" | "mono" | "serif";
  fontScale?: number; // scale multiplier e.g. 1.0
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  theme,
  themeTokens,
  errors,
  fontFamily = "sans",
  fontScale = 1.0
}) => {
  const themeClasses = getThemeClasses(theme);
  const errorMsg = errors[field.id];

  // Map font family
  const fontFamClass =
    fontFamily === "mono" ? "font-mono" : fontFamily === "serif" ? "font-serif" : "font-sans";

  // Resolve input theme style classes: combine visual styling (corners, focus rings) and global theme mode colors (input background, text)
  const inputStyle = `${themeClasses.input.split(" bg-white")[0].split(" text-gray-900")[0]} ${themeTokens.inputBg} ${themeTokens.inputText} border ${themeTokens.border} ${fontFamClass}`;

  // Inline font sizes scaled
  const labelStyle = {
    fontSize: `calc(0.875rem * ${fontScale})`,
    lineHeight: `calc(1.25rem * ${fontScale})`
  };

  const inputSizeStyle = {
    fontSize: `calc(0.875rem * ${fontScale})`,
    lineHeight: `calc(1.25rem * ${fontScale})`
  };

  const helperSizeStyle = {
    fontSize: `calc(0.75rem * ${fontScale})`,
    lineHeight: `calc(1rem * ${fontScale})`
  };

  const renderInput = () => {
    const isRequired = field.required || false;
    const placeholder = field.placeholder || "";
    const pattern = field.validation?.pattern || undefined;

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <div>
            <label htmlFor={field.id} className={`${themeClasses.label} ${themeTokens.text} ${fontFamClass}`} style={labelStyle}>
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              id={field.id}
              name={field.id}
              required={isRequired}
              placeholder={placeholder}
              pattern={pattern}
              style={inputSizeStyle}
              className={`${inputStyle} ${errorMsg ? "border-red-500 ring-2 ring-red-500/10 focus:ring-red-500 focus:border-red-500" : ""}`}
            />
            {field.validation?.message && !errorMsg && (
              <p className="mt-1 text-gray-400 font-medium" style={helperSizeStyle}>{field.validation.message}</p>
            )}
            {errorMsg && (
              <p className="mt-1 text-red-600 font-semibold" style={helperSizeStyle}>{errorMsg}</p>
            )}
          </div>
        );

      case "date":
        return (
          <div>
            <label htmlFor={field.id} className={`${themeClasses.label} ${themeTokens.text} ${fontFamClass}`} style={labelStyle}>
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="date"
              id={field.id}
              name={field.id}
              required={isRequired}
              style={inputSizeStyle}
              className={`${inputStyle} ${errorMsg ? "border-red-500 ring-2 ring-red-500/10" : ""}`}
            />
            {errorMsg && (
              <p className="mt-1 text-red-600 font-semibold" style={helperSizeStyle}>{errorMsg}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div>
            <label htmlFor={field.id} className={`${themeClasses.label} ${themeTokens.text} ${fontFamClass}`} style={labelStyle}>
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              id={field.id}
              name={field.id}
              required={isRequired}
              style={inputSizeStyle}
              className={`${inputStyle} ${errorMsg ? "border-red-500 ring-2 ring-red-500/10" : ""}`}
            >
              <option value="" className={`${themeTokens.inputBg} ${themeTokens.inputText}`}>Select option...</option>
              {(field.options || []).map((option: any) => (
                <option key={option.value} value={option.value} className={`${themeTokens.inputBg} ${themeTokens.inputText}`}>
                  {option.label}
                </option>
              ))}
            </select>
            {errorMsg && (
              <p className="mt-1 text-red-600 font-semibold" style={helperSizeStyle}>{errorMsg}</p>
            )}
          </div>
        );

      case "radio":
        return (
          <div>
            <span className={`${themeClasses.label} ${themeTokens.text} ${fontFamClass}`} style={labelStyle}>
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </span>
            <div className="mt-2 space-y-2">
              {(field.options || []).map((option: any) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="radio"
                    id={`${field.id}-${option.value}`}
                    name={field.id}
                    value={option.value}
                    required={isRequired}
                    className={themeClasses.radio}
                  />
                  <span className={`font-medium ${themeTokens.textSecondary} ${fontFamClass}`} style={inputSizeStyle}>{option.label}</span>
                </label>
              ))}
            </div>
            {errorMsg && (
              <p className="mt-1 text-red-600 font-semibold" style={helperSizeStyle}>{errorMsg}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div>
            <label htmlFor={field.id} className={`${themeClasses.label} ${themeTokens.text} ${fontFamClass}`} style={labelStyle}>
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              id={field.id}
              name={field.id}
              placeholder={placeholder}
              required={isRequired}
              rows={4}
              style={inputSizeStyle}
              className={`${inputStyle} ${errorMsg ? "border-red-500 ring-2 ring-red-500/10" : ""}`}
            />
            {errorMsg && (
              <p className="mt-1 text-red-600 font-semibold" style={helperSizeStyle}>{errorMsg}</p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id={field.id}
                name={field.id}
                required={isRequired}
                className={themeClasses.checkbox}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor={field.id}
                className={`font-semibold cursor-pointer select-none ${themeTokens.text} ${fontFamClass}`}
                style={labelStyle}
              >
                {field.label}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              {errorMsg && (
                <p className="mt-1 text-red-600 font-semibold" style={helperSizeStyle}>{errorMsg}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="transition-all duration-150">
      {renderInput()}
    </div>
  );
};

export default FormFieldRenderer;
