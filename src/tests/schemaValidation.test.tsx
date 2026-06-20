import validateSchema from "../utils/schemaValidation";

describe("Schema Validation Utility", () => {
  test("valid schema passes validation", () => {
    const validSchema = {
      formTitle: "Test Form",
      fields: [
        { id: "field1", type: "text", label: "Field 1" },
        { id: "field2", type: "email", label: "Field 2" },
      ],
    };

    expect(() => validateSchema(validSchema)).not.toThrow();
  });

  test("invalid schema throws error for missing formTitle", () => {
    const invalidSchema = {
      fields: [{ id: "field1", type: "text", label: "Field 1" }],
    };

    expect(() => validateSchema(invalidSchema)).toThrow(
      "Schema must include a 'formTitle' string."
    );
  });

  test("invalid field missing properties throws error", () => {
    const invalidSchema = {
      formTitle: "Test Form",
      fields: [{ id: "field1", type: "text" }],
    };

    expect(() => validateSchema(invalidSchema)).toThrow(
      "Field 'field1' is missing a required 'label'."
    );
  });

  test("invalid field missing type throws error", () => {
    const invalidSchema = {
      formTitle: "Test Form",
      fields: [{ id: "field1", label: "Field 1" }],
    };

    expect(() => validateSchema(invalidSchema)).toThrow(
      "Field 'field1' is missing a required 'type'."
    );
  });

  test("invalid field with invalid type throws error", () => {
    const invalidSchema = {
      formTitle: "Test Form",
      fields: [{ id: "field1", type: "invalid-type", label: "Field 1" }],
    };

    expect(() => validateSchema(invalidSchema)).toThrow(
      /Field 'field1' has invalid type 'invalid-type'/
    );
  });
});
