import React, { useState } from "react";
import {
  Mail,
  UserPlus,
  MessageSquare,
  ShoppingCart,
  Calendar,
  Upload,
  FileJson,
  AlertCircle,
  Check
} from "lucide-react";
import { AppThemeTokens } from "../utils/appTheme";
import validateSchema from "../utils/schemaValidation";

export const templates = [
  {
    name: "Contact Us Form",
    icon: Mail,
    description: "Simple, elegant form to receive inquiries, feedback, and customer messages.",
    schema: {
      formTitle: "Contact Us",
      formDescription: "We'd love to hear from you. Please fill out this form and we'll get back to you shortly.",
      fields: [
        {
          id: "fullName",
          type: "text",
          label: "Full Name",
          required: true,
          placeholder: "Jane Doe"
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          required: true,
          placeholder: "jane.doe@example.com",
          validation: {
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            message: "Please enter a valid email address"
          }
        },
        {
          id: "subject",
          type: "select",
          label: "Inquiry Subject",
          required: true,
          options: [
            { value: "support", label: "Technical Support" },
            { value: "sales", label: "Sales & Pricing" },
            { value: "partnership", label: "Partnership Inquiry" },
            { value: "general", label: "General Feedback" }
          ]
        },
        {
          id: "message",
          type: "textarea",
          label: "Message Description",
          required: true,
          placeholder: "Detail your query here..."
        }
      ]
    }
  },
  {
    name: "User Registration",
    icon: UserPlus,
    description: "Detailed onboarding questionnaire for signing up new users or workspace members.",
    schema: {
      formTitle: "Create Account",
      formDescription: "Sign up to access your personalized workspace and projects.",
      fields: [
        {
          id: "username",
          type: "text",
          label: "Pick a Username",
          required: true,
          placeholder: "coder_123"
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          required: true,
          placeholder: "you@domain.com"
        },
        {
          id: "birthDate",
          type: "date",
          label: "Date of Birth",
          required: true
        },
        {
          id: "newsletter",
          type: "checkbox",
          label: "Sign me up for weekly product updates, newsletters and tips.",
          required: false
        }
      ]
    }
  },
  {
    name: "Product Feedback",
    icon: MessageSquare,
    description: "A customer satisfaction poll including radio buttons, checkboxes and text areas.",
    schema: {
      formTitle: "Product Satisfaction Survey",
      formDescription: "Help us improve. Your feedback is highly valuable to our product engineering team.",
      fields: [
        {
          id: "recommend",
          type: "radio",
          label: "How likely are you to recommend us to a colleague?",
          required: true,
          options: [
            { value: "10", label: "Extremely Likely (9-10)" },
            { value: "7", label: "Neutral (7-8)" },
            { value: "0", label: "Not Likely (0-6)" }
          ]
        },
        {
          id: "primaryUsage",
          type: "select",
          label: "What is your main use case?",
          required: true,
          options: [
            { value: "personal", label: "Personal Hobbies" },
            { value: "team", label: "Small/Medium Team Projects" },
            { value: "enterprise", label: "Large Enterprise Production" }
          ]
        },
        {
          id: "bugsOccurred",
          type: "checkbox",
          label: "I have encountered bug issues or performance lag in the past month.",
          required: false
        },
        {
          id: "suggestions",
          type: "textarea",
          label: "What features or changes would make you love our product?",
          required: false,
          placeholder: "Please type your feature requests..."
        }
      ]
    }
  },
  {
    name: "E-Commerce Checkout",
    icon: ShoppingCart,
    description: "Multi-type layout including payment options, billing choices, and postal codes.",
    schema: {
      formTitle: "Checkout Shipping Details",
      formDescription: "Enter your shipping destination to place order.",
      fields: [
        {
          id: "recipientName",
          type: "text",
          label: "Shipping Recipient Name",
          required: true,
          placeholder: "Alex Smith"
        },
        {
          id: "zipCode",
          type: "number",
          label: "ZIP / Postal Code",
          required: true,
          placeholder: "90210"
        },
        {
          id: "paymentMethod",
          type: "radio",
          label: "Preferred Payment Method",
          required: true,
          options: [
            { value: "card", label: "Credit / Debit Card" },
            { value: "paypal", label: "PayPal Express Checkout" },
            { value: "crypto", label: "Digital Assets (BTC/ETH)" }
          ]
        },
        {
          id: "giftWrap",
          type: "checkbox",
          label: "This is a gift order. Include custom packaging.",
          required: false
        }
      ]
    }
  },
  {
    name: "Event RSVP",
    icon: Calendar,
    description: "RSVP invite form for webinars, meetups, or product launches.",
    schema: {
      formTitle: "Product Keynote RSVP",
      formDescription: "Secure your reservation for our annual developer product keynote session.",
      fields: [
        {
          id: "attendeeName",
          type: "text",
          label: "Attendee Full Name",
          required: true,
          placeholder: "Bob Miller"
        },
        {
          id: "attendance",
          type: "radio",
          label: "Will you attend in-person or virtually?",
          required: true,
          options: [
            { value: "in-person", label: "In-Person (San Francisco HQ)" },
            { value: "virtual", label: "Virtual Live Stream Broadcast" }
          ]
        },
        {
          id: "dietaryReq",
          type: "select",
          label: "Dietary Preferences (In-Person)",
          required: false,
          options: [
            { value: "none", label: "No preference" },
            { value: "vegan", label: "Vegan / Plant-Based" },
            { value: "gluten-free", label: "Gluten Free" },
            { value: "halal-kosher", label: "Halal / Kosher" }
          ]
        }
      ]
    }
  }
];

interface TemplatesGalleryProps {
  themeTokens: AppThemeTokens;
  onSelectTemplate: (schema: any) => void;
  readOnly?: boolean;
}

const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({ themeTokens, onSelectTemplate, readOnly = false }) => {
  const [importMethod, setImportMethod] = useState<"file" | "text" | "url">("file");
  const [jsonText, setJsonText] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const triggerImport = (parsedSchema: any) => {
    if (readOnly) return;
    try {
      validateSchema(parsedSchema);
      onSelectTemplate(parsedSchema);
      setSuccessMsg("Schema imported successfully!");
      setErrorMsg(null);
      setJsonText("");
      setUrlInput("");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg((err as Error).message);
      setSuccessMsg(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content);
        triggerImport(parsed);
      } catch (err) {
        setErrorMsg("Invalid JSON file content.");
        setSuccessMsg(null);
      }
    };
    reader.readAsText(file);
  };

  const handleUrlFetch = async () => {
    if (readOnly || !urlInput.trim()) return;
    setIsImporting(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch(urlInput);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const parsed = await res.json();
      triggerImport(parsed);
    } catch (err) {
      setErrorMsg(`Failed to fetch schema: ${(err as Error).message}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className={`p-6 h-full overflow-y-auto space-y-4 ${themeTokens.sidebar}`}>
      <div>
        <h3 className={`text-lg font-bold ${themeTokens.text} flex items-center`}>
          Templates & Imports
          {readOnly && <span className="text-xs px-2 py-0.5 ml-2 border border-amber-500/25 bg-amber-500/10 text-amber-500 rounded-md font-mono">View Only</span>}
        </h3>
        <p className={`text-xs mt-0.5 ${themeTokens.textSecondary}`}>
          {readOnly ? "Browse available pre-made templates." : "Load a pre-made template or import your own JSON schema file below. Warning: importing replaces your current schema."}
        </p>
      </div>

      {/* Import Custom Schema Box */}
      {!readOnly && (
        <div className={`p-5 rounded-xl border ${themeTokens.border} ${themeTokens.card} space-y-4 shadow-sm`}>

        <div className="flex items-center space-x-2">
          <FileJson className="h-5 w-5 text-blue-500" />
          <h4 className={`font-bold text-sm ${themeTokens.text}`}>Import Custom Form Schema</h4>
        </div>
        
        {/* Toggle import method */}
        <div className="flex border-b text-xs font-semibold">
          {[
            { id: "file", label: "JSON File" },
            { id: "text", label: "Paste JSON" },
            { id: "url", label: "From URL" }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setImportMethod(m.id as any);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`pb-2 px-3 border-b-2 transition-all cursor-pointer focus:outline-none ${
                importMethod === m.id
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Import Panels */}
        {importMethod === "file" && (
          <div className="space-y-3">
            <div className={`border-2 border-dashed ${themeTokens.border} rounded-lg p-4 text-center hover:border-blue-450 transition-colors relative`}>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className={`text-xs ${themeTokens.textSecondary}`}>
                <span className="text-blue-500 font-bold">Click to upload</span> or drag and drop a .json schema file
              </p>
            </div>
          </div>
        )}

        {importMethod === "text" && (
          <div className="space-y-3">
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder='{ "formTitle": "My Custom Form", "fields": [...] }'
              rows={3}
              className={`w-full p-2 border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.inputText} rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            <button
              onClick={() => {
                try {
                  const parsed = JSON.parse(jsonText);
                  triggerImport(parsed);
                } catch (e) {
                  setErrorMsg("JSON Parsing failed: check syntax validity.");
                }
              }}
              disabled={!jsonText.trim()}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40"
            >
              Parse & Import
            </button>
          </div>
        )}

        {importMethod === "url" && (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/form-schema.json"
                className={`flex-1 p-2 border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.inputText} rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              />
              <button
                onClick={handleUrlFetch}
                disabled={isImporting || !urlInput.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 flex items-center space-x-1"
              >
                {isImporting ? (
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Fetch</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Notifications */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/25 p-3 rounded-lg text-xs text-red-650 flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1 break-words">{errorMsg}</div>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-lg text-xs text-emerald-600 flex items-start space-x-2">
            <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>{successMsg}</div>
          </div>
        )}
      </div>
      )}

      <div className="grid grid-cols-1 gap-4 mt-2">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <button
              key={template.name}
              onClick={() => !readOnly && onSelectTemplate(template.schema)}
              disabled={readOnly}
              className={`flex items-start text-left p-4 ${themeTokens.inputBg} border ${themeTokens.border} ${
                readOnly ? "opacity-70 cursor-not-allowed" : "hover:border-blue-500 hover:shadow-md cursor-pointer"
              } rounded-xl transition-all duration-200 group shadow-sm focus:outline-none`}
            >
              <div className={`p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg ${
                readOnly ? "" : "group-hover:bg-blue-600 group-hover:text-white"
              } transition-colors duration-200 mr-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold transition-colors duration-200 ${themeTokens.text} ${
                  readOnly ? "" : "group-hover:text-blue-500"
                }`}>
                  {template.name}
                </h4>
                <p className={`text-xs mt-1 leading-relaxed ${themeTokens.textSecondary}`}>
                  {template.description}
                </p>
                {!readOnly && (
                  <div className="mt-2.5 inline-flex items-center text-xs font-semibold text-blue-500 group-hover:underline">
                    Load Template &rarr;
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplatesGallery;
