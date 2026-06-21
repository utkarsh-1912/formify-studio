import React, { useState } from "react";
import FormFieldRenderer from "./FormFieldRenderer";
import { ThemeSettings, getThemeClasses } from "../utils/codeGenerators";
import { AppThemeTokens } from "../utils/appTheme";
import { Check } from "lucide-react";

interface FormGeneratorProps {
  schema: any;
  theme: ThemeSettings;
  themeTokens: AppThemeTokens;
  fontFamily?: "sans" | "mono" | "serif";
  fontScale?: number;
  onSubmitSubmission: (data: Record<string, any>) => void;
}

const FormGenerator: React.FC<FormGeneratorProps> = ({
  schema,
  theme,
  themeTokens,
  fontFamily = "sans",
  fontScale = 1.0,
  onSubmitSubmission
}) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<Record<string, any> | null>(null);

  const themeClasses = getThemeClasses(theme);
  const fontFamClass =
    fontFamily === "mono" ? "font-mono" : fontFamily === "serif" ? "font-serif" : "font-sans";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const result: Record<string, any> = {};
    
    const fields = schema.fields || [];
    fields.forEach((field: any) => {
      if (field.type === "checkbox") {
        result[field.id] = data.get(field.id) !== null;
      } else {
        const val = data.get(field.id);
        result[field.id] = val === null ? "" : String(val);
      }
    });

    const errors: Record<string, string> = {};
    fields.forEach((field: any) => {
      const val = result[field.id];
      
      if (field.required) {
        if (field.type === "checkbox") {
          if (!val) {
            errors[field.id] = "You must select this checkbox.";
          }
        } else if (!val || String(val).trim() === "") {
          errors[field.id] = "This field is required.";
        }
      }

      if (val && field.validation?.pattern) {
        try {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(String(val))) {
            errors[field.id] = field.validation.message || "Invalid format.";
          }
        } catch (err) {
          // ignore
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsSubmitSuccess(false);
      return;
    }

    setFieldErrors({});
    setSubmittedData(result);
    setIsSubmitSuccess(true);
    onSubmitSubmission(result);

    e.currentTarget.reset();
  };

  const handleDismissSuccess = () => {
    setIsSubmitSuccess(false);
    setSubmittedData(null);
  };

  if (!schema || !schema.fields || schema.fields.length === 0) {
    return (
      <div className={`p-6 h-full flex flex-col items-center justify-center ${themeTokens.previewBg}`}>
        <div className={`max-w-md w-full p-8 rounded-2xl border ${themeTokens.border} ${themeTokens.card} text-center`}>
          <h3 className={`text-lg font-bold ${themeTokens.text} ${fontFamClass}`}>Form Preview</h3>
          <p className={`text-xs mt-2 leading-relaxed ${themeTokens.textSecondary} ${fontFamClass}`}>
            No fields defined yet. Go to the Visual Builder or JSON Editor on the left and add fields to preview the live rendering.
          </p>
        </div>
      </div>
    );
  }

  const layoutClass = theme.layout === "2-col"
    ? "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 space-y-0"
    : "space-y-5";

  const cardClasses = `${themeClasses.card.replace("bg-white", "").replace("border-gray-100", "")} ${themeTokens.card}`;

  // Custom typography styles based on scale
  const titleStyle = {
    fontSize: `calc(1.5rem * ${fontScale})`,
    lineHeight: `calc(2rem * ${fontScale})`
  };

  const descStyle = {
    fontSize: `calc(0.875rem * ${fontScale})`,
    lineHeight: `calc(1.25rem * ${fontScale})`
  };

  const submitBtnStyle = {
    fontSize: `calc(0.875rem * ${fontScale})`,
    paddingTop: `calc(0.75rem * ${fontScale})`,
    paddingBottom: `calc(0.75rem * ${fontScale})`
  };

  return (
    <div className={`p-6 h-full overflow-y-auto flex flex-col justify-start ${themeTokens.previewBg}`}>
      <div className="max-w-2xl w-full mx-auto">
        <div className={`${cardClasses} transition-all duration-300 relative`}>
          
          {/* Submission Success Alert Panel */}
          {isSubmitSuccess && (
            <div className={`absolute inset-0 rounded-2xl z-10 p-8 flex flex-col items-center justify-center text-center animate-fade-in ${themeTokens.card.split(" border-")[0]}`}>
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 animate-scale-up">
                <Check className="h-6 w-6" />
              </div>
              <h4 className={`text-lg font-bold ${themeTokens.text} ${fontFamClass}`}>Submission Successful!</h4>
              <p className={`text-xs mt-1 max-w-sm ${themeTokens.textSecondary} ${fontFamClass}`}>
                Your entry has been validated and logged. You can view the details in the **Submissions** dashboard tab.
              </p>
              
              <div className={`mt-5 w-full max-w-xs text-left border rounded-xl p-3 text-xs font-mono max-h-36 overflow-y-auto ${themeTokens.inputBg} ${themeTokens.inputText} ${themeTokens.border}`}>
                {submittedData && Object.entries(submittedData).map(([k, v]) => (
                  <div key={k} className="truncate">
                    <span className="opacity-55">{k}:</span> {String(v)}
                  </div>
                ))}
              </div>

              <button
                onClick={handleDismissSuccess}
                className={`mt-6 px-6 py-2.5 text-xs font-bold ${themeClasses.button}`}
              >
                Fill Form Again
              </button>
            </div>
          )}

          {/* Form Header */}
          <div className="mb-6">
            <h2 className={`font-bold leading-snug ${themeTokens.text} ${fontFamClass}`} style={titleStyle}>
              {schema.formTitle || "Untitled Form"}
            </h2>
            {schema.formDescription && (
              <p className={`mt-1.5 leading-relaxed ${themeTokens.textSecondary} ${fontFamClass}`} style={descStyle}>
                {schema.formDescription}
              </p>
            )}
          </div>

          {/* Form body */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className={layoutClass}>
              {schema.fields.map((field: any) => (
                <FormFieldRenderer
                  key={field.id}
                  field={field}
                  theme={theme}
                  themeTokens={themeTokens}
                  fontFamily={fontFamily}
                  fontScale={fontScale}
                  errors={fieldErrors}
                />
              ))}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                style={submitBtnStyle}
                className={`w-full text-center cursor-pointer ${themeClasses.button} ${fontFamClass}`}
              >
                Submit Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormGenerator;
