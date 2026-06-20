const validateSchema = (schema: any): void => {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    throw new Error("Schema must be a valid JSON object.");
  }

  if (!schema.formTitle) {
    throw new Error("Schema must include a 'formTitle' string.");
  }

  if (typeof schema.formTitle !== "string") {
    throw new Error("'formTitle' must be a string.");
  }

  if (schema.formDescription && typeof schema.formDescription !== "string") {
    throw new Error("'formDescription' must be a string.");
  }

  if (!schema.fields) {
    throw new Error("Schema must include a 'fields' array.");
  }

  if (!Array.isArray(schema.fields)) {
    throw new Error("'fields' must be an array.");
  }

  const seenIds = new Set<string>();

  schema.fields.forEach((field: any, index: number) => {
    if (!field || typeof field !== "object" || Array.isArray(field)) {
      throw new Error(`Field at index ${index} must be a valid object.`);
    }

    if (!field.id) {
      throw new Error(`Field at index ${index} is missing a required 'id'.`);
    }

    if (typeof field.id !== "string" || field.id.trim() === "") {
      throw new Error(`Field id at index ${index} must be a non-empty string.`);
    }

    if (seenIds.has(field.id)) {
      throw new Error(`Duplicate field id detected: '${field.id}' at index ${index}.`);
    }
    seenIds.add(field.id);

    if (!field.type) {
      throw new Error(`Field '${field.id}' is missing a required 'type'.`);
    }

    const validTypes = [
      "text",
      "email",
      "number",
      "select",
      "radio",
      "checkbox",
      "textarea",
      "date"
    ];
    if (!validTypes.includes(field.type)) {
      throw new Error(
        `Field '${field.id}' has invalid type '${field.type}'. Must be one of: ${validTypes.join(", ")}.`
      );
    }

    if (!field.label) {
      throw new Error(`Field '${field.id}' is missing a required 'label'.`);
    }

    if (typeof field.label !== "string") {
      throw new Error(`Field '${field.id}' 'label' must be a string.`);
    }

    // Validation for options
    if (field.type === "select" || field.type === "radio") {
      if (!field.options) {
        throw new Error(`Field '${field.id}' of type '${field.type}' must include an 'options' array.`);
      }
      if (!Array.isArray(field.options)) {
        throw new Error(`Field '${field.id}' 'options' must be an array.`);
      }
      if (field.options.length === 0) {
        throw new Error(`Field '${field.id}' 'options' array cannot be empty.`);
      }
      field.options.forEach((opt: any, optIdx: number) => {
        if (!opt || typeof opt !== "object" || Array.isArray(opt)) {
          throw new Error(`Field '${field.id}' option at index ${optIdx} must be an object.`);
        }
        if (opt.value === undefined || opt.value === null) {
          throw new Error(`Field '${field.id}' option at index ${optIdx} is missing a 'value'.`);
        }
        if (!opt.label || typeof opt.label !== "string") {
          throw new Error(`Field '${field.id}' option at index ${optIdx} must have a 'label' string.`);
        }
      });
    }

    // Validation pattern regex syntax checking
    if (field.validation) {
      if (typeof field.validation !== "object" || Array.isArray(field.validation)) {
        throw new Error(`Field '${field.id}' 'validation' property must be an object.`);
      }
      if (field.validation.pattern) {
        if (typeof field.validation.pattern !== "string") {
          throw new Error(`Field '${field.id}' validation 'pattern' must be a regex string.`);
        }
        try {
          new RegExp(field.validation.pattern);
        } catch (e) {
          throw new Error(`Field '${field.id}' has an invalid validation regex pattern: ${(e as Error).message}`);
        }
      }
      if (field.validation.message && typeof field.validation.message !== "string") {
        throw new Error(`Field '${field.id}' validation 'message' must be a string.`);
      }
    }
  });
};

export default validateSchema;