export interface ThemeSettings {
  primaryColor: string;
  borderRadius: string;
  layout: "1-col" | "2-col";
  shadow: string;
}

export const getThemeClasses = (theme: ThemeSettings) => {
  const colorMap: Record<string, { bg: string; text: string; ring: string; border: string; hover: string }> = {
    indigo: {
      bg: "bg-indigo-600",
      text: "text-indigo-600",
      ring: "focus:ring-indigo-500",
      border: "border-indigo-600",
      hover: "hover:bg-indigo-700"
    },
    emerald: {
      bg: "bg-emerald-600",
      text: "text-emerald-600",
      ring: "focus:ring-emerald-500",
      border: "border-emerald-600",
      hover: "hover:bg-emerald-700"
    },
    violet: {
      bg: "bg-violet-600",
      text: "text-violet-600",
      ring: "focus:ring-violet-500",
      border: "border-violet-600",
      hover: "hover:bg-violet-700"
    },
    rose: {
      bg: "bg-rose-600",
      text: "text-rose-600",
      ring: "focus:ring-rose-500",
      border: "border-rose-600",
      hover: "hover:bg-rose-700"
    },
    amber: {
      bg: "bg-amber-600",
      text: "text-amber-600",
      ring: "focus:ring-amber-500",
      border: "border-amber-600",
      hover: "hover:bg-amber-700"
    },
    blue: {
      bg: "bg-blue-600",
      text: "text-blue-600",
      ring: "focus:ring-blue-500",
      border: "border-blue-600",
      hover: "hover:bg-blue-700"
    },
    slate: {
      bg: "bg-slate-700",
      text: "text-slate-700",
      ring: "focus:ring-slate-500",
      border: "border-slate-700",
      hover: "hover:bg-slate-800"
    }
  };

  const radiusMap: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-3xl"
  };

  const shadowMap: Record<string, string> = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg"
  };

  const selectedColor = colorMap[theme.primaryColor] || colorMap.indigo;
  const selectedRadius = radiusMap[theme.borderRadius] || radiusMap.md;
  const selectedShadow = shadowMap[theme.shadow] || shadowMap.md;

  return {
    button: `${selectedColor.bg} ${selectedColor.hover} text-white font-medium ${selectedRadius} ${selectedShadow} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedColor.ring}`,
    input: `w-full p-2.5 border border-gray-300 ${selectedRadius} focus:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-0 ${selectedColor.ring} transition-all duration-150 text-gray-900 bg-white`,
    checkbox: `${selectedRadius} ${selectedColor.text} border-gray-300 focus:ring-0 focus:ring-offset-0 transition-all duration-150 h-5 w-5`,
    radio: `h-5 w-5 ${selectedColor.text} border-gray-300 focus:ring-0 transition-all duration-150`,
    label: "block text-sm font-semibold text-gray-700 mb-1.5",
    card: `bg-white p-8 ${selectedRadius} ${selectedShadow} border border-gray-100`
  };
};

export const generateReactCode = (schema: any, theme: ThemeSettings): string => {
  const fields = schema.fields || [];
  const themeClasses = getThemeClasses(theme);
  
  const fieldsMarkup = fields.map((field: any) => {
    let inputMarkup = "";

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        inputMarkup = `
        <div>
          <label htmlFor="${field.id}" className="${themeClasses.label}">
            ${field.label}${field.required ? ' <span className="text-red-500">*</span>' : ""}
          </label>
          <input
            id="${field.id}"
            type="${field.type}"
            placeholder="${field.placeholder || ""}"
            {...register("${field.id}", {
              required: ${field.required ? '"This field is required"' : "false"},
              ${field.validation?.pattern ? `pattern: { value: /${field.validation.pattern}/, message: "${field.validation.message || 'Invalid format'}" }` : ""}
            })}
            className="${themeClasses.input}"
          />
          {errors.${field.id} && (
            <p className="mt-1 text-sm text-red-600">{errors.${field.id}.message as string}</p>
          )}
        </div>`;
        break;

      case "textarea":
        inputMarkup = `
        <div>
          <label htmlFor="${field.id}" className="${themeClasses.label}">
            ${field.label}${field.required ? ' <span className="text-red-500">*</span>' : ""}
          </label>
          <textarea
            id="${field.id}"
            placeholder="${field.placeholder || ""}"
            rows={4}
            {...register("${field.id}", { required: ${field.required ? '"This field is required"' : "false"} })}
            className="${themeClasses.input}"
          />
          {errors.${field.id} && (
            <p className="mt-1 text-sm text-red-600">{errors.${field.id}.message as string}</p>
          )}
        </div>`;
        break;

      case "select":
        const selectOptions = (field.options || []).map((o: any) => 
          `            <option key="${o.value}" value="${o.value}">${o.label}</option>`
        ).join("\n");
        inputMarkup = `
        <div>
          <label htmlFor="${field.id}" className="${themeClasses.label}">
            ${field.label}${field.required ? ' <span className="text-red-500">*</span>' : ""}
          </label>
          <select
            id="${field.id}"
            {...register("${field.id}", { required: ${field.required ? '"This field is required"' : "false"} })}
            className="${themeClasses.input}"
          >
            <option value="">Select option...</option>
${selectOptions}
          </select>
          {errors.${field.id} && (
            <p className="mt-1 text-sm text-red-600">{errors.${field.id}.message as string}</p>
          )}
        </div>`;
        break;

      case "radio":
        const radioOptions = (field.options || []).map((o: any) => `
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value="${o.value}"
                {...register("${field.id}", { required: ${field.required ? '"Please select an option"' : "false"} })}
                className="${themeClasses.radio}"
              />
              <span className="text-sm font-medium text-gray-700">${o.label}</span>
            </label>`
        ).join("\n");
        inputMarkup = `
        <div>
          <span className="${themeClasses.label}">
            ${field.label}${field.required ? ' <span className="text-red-500">*</span>' : ""}
          </span>
          <div className="mt-2 space-y-2">
${radioOptions}
          </div>
          {errors.${field.id} && (
            <p className="mt-1 text-sm text-red-600">{errors.${field.id}.message as string}</p>
          )}
        </div>`;
        break;

      case "checkbox":
        inputMarkup = `
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="${field.id}"
              type="checkbox"
              {...register("${field.id}", { required: ${field.required ? '"You must accept this field"' : "false"} })}
              className="${themeClasses.checkbox}"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="${field.id}" className="font-medium text-gray-700 cursor-pointer">
              ${field.label}${field.required ? ' <span className="text-red-500">*</span>' : ""}
            </label>
            {errors.${field.id} && (
              <p className="mt-1 text-sm text-red-600">{errors.${field.id}.message as string}</p>
            )}
          </div>
        </div>`;
        break;

      case "date":
        inputMarkup = `
        <div>
          <label htmlFor="${field.id}" className="${themeClasses.label}">
            ${field.label}${field.required ? ' <span className="text-red-500">*</span>' : ""}
          </label>
          <input
            id="${field.id}"
            type="date"
            {...register("${field.id}", { required: ${field.required ? '"This field is required"' : "false"} })}
            className="${themeClasses.input}"
          />
          {errors.${field.id} && (
            <p className="mt-1 text-sm text-red-600">{errors.${field.id}.message as string}</p>
          )}
        </div>`;
        break;
    }
    return inputMarkup;
  }).join("\n\n");

  const layoutClass = theme.layout === "2-col" ? "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 space-y-0" : "space-y-6";

  return `import React from "react";
import { useForm } from "react-hook-form";

export default function GeneratedForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Form Submitted Successfully:", data);
    alert("Form submitted! Check developer console for outputs.");
    reset();
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="${themeClasses.card}">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">${schema.formTitle || "Untitled Form"}</h2>
          ${schema.formDescription ? `<p className="mt-1.5 text-sm text-gray-500">${schema.formDescription}</p>` : ""}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="${layoutClass}">
${fieldsMarkup}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 ${themeClasses.button}"
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
`;
};

export const generateHTMLCode = (schema: any, theme: ThemeSettings): string => {
  const fields = schema.fields || [];
  const themeClasses = getThemeClasses(theme);
  
  const fieldsMarkup = fields.map((field: any) => {
    let inputMarkup = "";
    const isRequiredAttr = field.required ? "required" : "";

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        inputMarkup = `
        <!-- Field: ${field.id} -->
        <div>
          <label for="${field.id}" class="${themeClasses.label}">
            ${field.label}${field.required ? ' <span class="text-red-500">*</span>' : ""}
          </label>
          <input
            id="${field.id}"
            name="${field.id}"
            type="${field.type}"
            placeholder="${field.placeholder || ""}"
            ${isRequiredAttr}
            ${field.validation?.pattern ? `pattern="${field.validation.pattern}"` : ""}
            class="${themeClasses.input}"
          />
          ${field.validation?.message ? `<p class="mt-1 text-xs text-gray-500">${field.validation.message}</p>` : ""}
        </div>`;
        break;

      case "textarea":
        inputMarkup = `
        <!-- Field: ${field.id} -->
        <div>
          <label for="${field.id}" class="${themeClasses.label}">
            ${field.label}${field.required ? ' <span class="text-red-500">*</span>' : ""}
          </label>
          <textarea
            id="${field.id}"
            name="${field.id}"
            placeholder="${field.placeholder || ""}"
            rows="4"
            ${isRequiredAttr}
            class="${themeClasses.input}"
          ></textarea>
        </div>`;
        break;

      case "select":
        const selectOptions = (field.options || []).map((o: any) => 
          `            <option value="${o.value}">${o.label}</option>`
        ).join("\n");
        inputMarkup = `
        <!-- Field: ${field.id} -->
        <div>
          <label for="${field.id}" class="${themeClasses.label}">
            ${field.label}${field.required ? ' <span class="text-red-500">*</span>' : ""}
          </label>
          <select
            id="${field.id}"
            name="${field.id}"
            ${isRequiredAttr}
            class="${themeClasses.input}"
          >
            <option value="">Select option...</option>
${selectOptions}
          </select>
        </div>`;
        break;

      case "radio":
        const radioOptions = (field.options || []).map((o: any) => `
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="${field.id}"
                value="${o.value}"
                ${isRequiredAttr}
                class="${themeClasses.radio}"
              />
              <span class="text-sm font-medium text-gray-700">${o.label}</span>
            </label>`
        ).join("\n");
        inputMarkup = `
        <!-- Field: ${field.id} -->
        <div>
          <span class="${themeClasses.label}">
            ${field.label}${field.required ? ' <span class="text-red-500">*</span>' : ""}
          </span>
          <div class="mt-2 space-y-2">
${radioOptions}
          </div>
        </div>`;
        break;

      case "checkbox":
        inputMarkup = `
        <!-- Field: ${field.id} -->
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="${field.id}"
              name="${field.id}"
              type="checkbox"
              ${isRequiredAttr}
              class="${themeClasses.checkbox}"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="${field.id}" class="font-medium text-gray-700 cursor-pointer">
              ${field.label}${field.required ? ' <span class="text-red-500">*</span>' : ""}
            </label>
          </div>
        </div>`;
        break;

      case "date":
        inputMarkup = `
        <!-- Field: ${field.id} -->
        <div>
          <label for="${field.id}" class="${themeClasses.label}">
            ${field.label}${field.required ? ' <span class="text-red-500">*</span>' : ""}
          </label>
          <input
            id="${field.id}"
            name="${field.id}"
            type="date"
            ${isRequiredAttr}
            class="${themeClasses.input}"
          />
        </div>`;
        break;
    }
    return inputMarkup;
  }).join("\n\n");

  const layoutClass = theme.layout === "2-col" ? "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 space-y-0" : "space-y-6";

  return `<!DOCTYPE html>
<html lang="en" class="h-full bg-gray-50">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${schema.formTitle || "Formify Dynamic Form"}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
    }
  </style>
</head>
<body class="h-full">
  <div class="max-w-2xl mx-auto py-12 px-4">
    <div class="${themeClasses.card}">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">${schema.formTitle || "Untitled Form"}</h2>
        ${schema.formDescription ? `<p class="mt-1.5 text-sm text-gray-500">${schema.formDescription}</p>` : ""}
      </div>

      <form id="dynamic-form" class="space-y-6">
        <div class="${layoutClass}">
${fieldsMarkup}
        </div>

        <div class="pt-2">
          <button
            type="submit"
            class="w-full py-3 px-4 text-center cursor-pointer ${themeClasses.button}"
          >
            Submit Form
          </button>
        </div>
      </form>
    </div>
  </div>

  <script>
    document.getElementById('dynamic-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const data = {};
      formData.forEach((value, key) => {
        if (data[key]) {
          if (!Array.isArray(data[key])) {
            data[key] = [data[key]];
          }
          data[key].push(value);
        } else {
          data[key] = value;
        }
      });
      console.log("Form Values:", data);
      alert("Form submitted! Check console for values.");
    });
  </script>
</body>
</html>
`;
};
