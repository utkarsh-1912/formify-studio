import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FormGenerator from "../components/FormGenerator";
import { themeMap } from "../utils/appTheme";

const mockSchema = {
  formTitle: "Sample Form",
  formDescription: "Please fill out this form",
  fields: [
    {
      id: "name",
      type: "text",
      label: "Name",
      required: true,
      placeholder: "Enter your name",
    },
    {
      id: "email",
      type: "email",
      label: "Email",
      required: true,
      placeholder: "Enter your email",
    },
  ],
};

const mockTheme = {
  primaryColor: "indigo",
  borderRadius: "md",
  layout: "1-col" as const,
  shadow: "md"
};

const mockThemeTokens = themeMap.light;

describe("FormGenerator Component", () => {
  const mockOnSubmit = jest.fn();

  test("renders form title and description", () => {
    render(
      <FormGenerator
        schema={mockSchema}
        theme={mockTheme}
        themeTokens={mockThemeTokens}
        onSubmitSubmission={mockOnSubmit}
      />
    );
    expect(screen.getByText("Sample Form")).toBeInTheDocument();
    expect(screen.getByText("Please fill out this form")).toBeInTheDocument();
  });

  test("renders form fields", () => {
    render(
      <FormGenerator
        schema={mockSchema}
        theme={mockTheme}
        themeTokens={mockThemeTokens}
        onSubmitSubmission={mockOnSubmit}
      />
    );
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  test("submits form data", () => {
    render(
      <FormGenerator
        schema={mockSchema}
        theme={mockTheme}
        themeTokens={mockThemeTokens}
        onSubmitSubmission={mockOnSubmit}
      />
    );
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit Form/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
    });
  });
});
