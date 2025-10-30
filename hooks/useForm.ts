import { useCallback, useState } from 'react';

export interface FormField {
  value: string | number | boolean | File[] | null;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitCount: number;
}

export interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
  onSubmit?: (values: T) => Promise<void> | void;
  resetOnSubmit?: boolean;
}

export function useForm<
  T extends Record<string, string | number | boolean | File[] | null | undefined>,
>(options: UseFormOptions<T>) {
  const {
    initialValues,
    validate,
    validateOnChange = true,
    validateOnBlur = true,
    validateOnSubmit = true,
    onSubmit,
    resetOnSubmit = false,
  } = options;

  const [state, setState] = useState<FormState<T>>({
    values: { ...initialValues },
    errors: {},
    touched: {},
    dirty: {},
    isValid: true,
    isSubmitting: false,
    isSubmitted: false,
    submitCount: 0,
  });

  const validateForm = useCallback(
    (values: T): Partial<Record<keyof T, string>> => {
      if (!validate) return {};
      return validate(values);
    },
    [validate]
  );

  const setFieldValue = useCallback(
    (field: keyof T, value: string | number | boolean | File[] | null) => {
      setState(prev => {
        const newValues = { ...prev.values, [field]: value };
        const newDirty = { ...prev.dirty, [field]: true };

        let newErrors = prev.errors;
        if (validateOnChange) {
          newErrors = validateForm(newValues);
        }

        return {
          ...prev,
          values: newValues,
          dirty: newDirty,
          errors: newErrors,
          isValid: Object.keys(newErrors).length === 0,
        };
      });
    },
    [validateForm, validateOnChange]
  );

  const setFieldTouched = useCallback(
    (field: keyof T, touched: boolean = true) => {
      setState(prev => {
        const newTouched = { ...prev.touched, [field]: touched };

        let newErrors = prev.errors;
        if (touched && validateOnBlur) {
          newErrors = validateForm(prev.values);
        }

        return {
          ...prev,
          touched: newTouched,
          errors: newErrors,
          isValid: Object.keys(newErrors).length === 0,
        };
      });
    },
    [validateForm, validateOnBlur]
  );

  const setFieldError = useCallback((field: keyof T, error: string | null) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
      isValid: Object.keys({ ...prev.errors, [field]: error }).length === 0,
    }));
  }, []);

  const setValues = useCallback(
    (values: Partial<T>) => {
      setState(prev => {
        const newValues = { ...prev.values, ...values };
        const newDirty = { ...prev.dirty };

        // Marquer les champs modifiés comme dirty
        Object.keys(values).forEach(key => {
          newDirty[key as keyof T] = true;
        });

        let newErrors = prev.errors;
        if (validateOnChange) {
          newErrors = validateForm(newValues);
        }

        return {
          ...prev,
          values: newValues,
          dirty: newDirty,
          errors: newErrors,
          isValid: Object.keys(newErrors).length === 0,
        };
      });
    },
    [validateForm, validateOnChange]
  );

  const setErrors = useCallback((errors: Partial<Record<keyof T, string>>) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, ...errors },
      isValid: Object.keys({ ...prev.errors, ...errors }).length === 0,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      values: { ...initialValues },
      errors: {},
      touched: {},
      dirty: {},
      isValid: true,
      isSubmitting: false,
      isSubmitted: false,
      submitCount: 0,
    });
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setState(prev => ({
        ...prev,
        isSubmitting: true,
        submitCount: prev.submitCount + 1,
      }));

      try {
        let newErrors = {};
        if (validateOnSubmit) {
          newErrors = validateForm(state.values);
        }

        if (Object.keys(newErrors).length > 0) {
          setState(prev => ({
            ...prev,
            errors: newErrors,
            isValid: false,
            isSubmitting: false,
          }));
          return;
        }

        if (onSubmit) {
          await onSubmit(state.values);
        }

        setState(prev => ({
          ...prev,
          isSubmitting: false,
          isSubmitted: true,
        }));

        if (resetOnSubmit) {
          reset();
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          errors: {
            ...prev.errors,
            submit:
              error instanceof Error
                ? error.message
                : 'Une erreur est survenue',
          },
        }));
      }
    },
    [
      state.values,
      validateForm,
      validateOnSubmit,
      onSubmit,
      resetOnSubmit,
      reset,
    ]
  );

  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: state.values[field],
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      ) => {
        setFieldValue(field, e.target.value);
      },
      onBlur: () => setFieldTouched(field),
      error: state.errors[field],
      touched: state.touched[field],
      dirty: state.dirty[field],
    }),
    [
      state.values,
      state.errors,
      state.touched,
      state.dirty,
      setFieldValue,
      setFieldTouched,
    ]
  );

  return {
    ...state,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    setValues,
    setErrors,
    reset,
    handleSubmit,
    getFieldProps,
  };
}

export default useForm;
