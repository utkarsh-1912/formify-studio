import React from "react";
import {
  Mail,
  UserPlus,
  MessageSquare,
  ShoppingCart,
  Calendar
} from "lucide-react";
import { AppThemeTokens } from "../utils/appTheme";

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
}

const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({ themeTokens, onSelectTemplate }) => {
  return (
    <div className={`p-6 h-full overflow-y-auto space-y-4 ${themeTokens.sidebar}`}>
      <div>
        <h3 className={`text-lg font-bold ${themeTokens.text}`}>Templates Gallery</h3>
        <p className={`text-xs mt-0.5 ${themeTokens.textSecondary}`}>
          Select a template to load it instantly as your workspace schema. Warning: this replaces your current schema.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-2">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <button
              key={template.name}
              onClick={() => onSelectTemplate(template.schema)}
              className={`flex items-start text-left p-4 ${themeTokens.inputBg} border ${themeTokens.border} hover:border-blue-500 rounded-xl transition-all duration-200 group shadow-sm hover:shadow-md cursor-pointer focus:outline-none`}
            >
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 mr-4">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold transition-colors duration-200 ${themeTokens.text} group-hover:text-blue-500`}>
                  {template.name}
                </h4>
                <p className={`text-xs mt-1 leading-relaxed ${themeTokens.textSecondary}`}>
                  {template.description}
                </p>
                <div className="mt-2.5 inline-flex items-center text-xs font-semibold text-blue-500 group-hover:underline">
                  Load Template &rarr;
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplatesGallery;
