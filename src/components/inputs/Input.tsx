import clsx from 'clsx';
import type { FieldErrors, FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form';

interface InputProps<TFieldValues extends FieldValues = FieldValues> {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
  options?: RegisterOptions;
}

const Input = <TFieldValues extends FieldValues = FieldValues>({
  label,
  id,
  register,
  required,
  errors,
  type = 'text',
  disabled,
  options
}: InputProps<TFieldValues>) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          {...register(id, { required, ...options })}
          className={clsx(
            `
            form-input
            block
            w-full
            rounded-md
            border-0
            py-1.5
            text-gray-900
            shadow-sm
            ring-1
            ring-inset
            ring-gray-300
            placeholder:text-gray-400
            focus:ring-2
            focus:ring-inset
            sm:text-sm
            sm:leading-6`,
            {
              'focus:ring-rose-500': errors[id],
              'ring-rose-500': errors[id],
              'ring-gray-300': !errors[id],
              'focus:ring-sky-600': !errors[id],
              'cursor-default opacity-50': disabled
            }
          )}
        />
      </div>
    </div>
  );
};

export default Input;
