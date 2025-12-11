import { ValidationError } from "./classes";

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export function parseValidationError(errorMessage: string): ValidationError {
  try {
    const parsed = JSON.parse(errorMessage);
    const details: ValidationErrorDetail[] = [];

    if (Array.isArray(parsed.errors) && parsed.errors.length > 0) {
      parsed.errors.forEach((error: any) => {
        const field = error.path ? error.path.replace(/^\//, "") : "unknown";
        const message = error.message || error.summary || "Invalid field";
        details.push({ field, message });
      });
    } else if (parsed.property) {
      const field = parsed.property.replace(/^\//, "");
      const message = parsed.message || "Validation failed";
      details.push({ field, message });
    }

    return new ValidationError("Validation failed", details);
  } catch {
    return new ValidationError("Validation failed", []);
  }
}

export function isAppError(error: unknown): boolean {
  return error instanceof Error && "status" in error && "code" in error;
}
