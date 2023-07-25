import { UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form/dist/useForm';

export function appendNonNullableValuesThatWereChanged(
  form: UseFormReturn<{}, unknown>,
  obj: object,
  formData: FormData
) {
  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    if (!form.formState.dirtyFields[key]) {
      return;
    }

    formData.append(key, value);
  });
}

export function isFormValid(form: ReturnType<typeof useForm>): boolean {
  const { isValid, isDirty, errors } = form.formState;
  return isValid && isDirty && Object.keys(errors).length === 0;
}
