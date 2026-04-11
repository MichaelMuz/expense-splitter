/*
 * In the future we can use shadcn native https://ui.shadcn.com/docs/forms/react-hook-form
 * That would give us error messages and red border outline out of the box but for now this is enough
 */

import type { FieldError } from "react-hook-form";

export function ErrorMessage({ error }: { error?: FieldError }) {
    return  error && <p className="text-sm text-destructive">{error.message}</p>
}
