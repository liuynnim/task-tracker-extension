import {
  useRef,
  useState,
  type BaseSyntheticEvent,
  type ChangeEvent,
} from "react";
import type {
  FieldValues,
  FieldErrors,
  RegisterOptions,
  SubmitHandle,
} from "./types";

export interface UseFormProps<TFieldValues extends FieldValues = FieldValues> {
  defaultValues?: Partial<TFieldValues>;
}

export function useForm<TFieldValues extends FieldValues = FieldValues>(
  props?: UseFormProps<TFieldValues>,
) {
  const _formValues = useRef<Partial<TFieldValues>>(
    props?.defaultValues ? { ...props.defaultValues } : {},
  );

  const _fields = useRef<Record<string, HTMLElement | null>>({});

  const _rules = useRef<Partial<Record<keyof TFieldValues, RegisterOptions>>>(
    {},
  );

  const _errors = useRef<FieldErrors<TFieldValues>>({});

  const [errors, setErrors] = useState<FieldErrors<TFieldValues>>({});

  function updateErrors(): void {
    setErrors({ ..._errors.current });
  }

  function validateField(name: keyof TFieldValues): boolean {
    const rule = _rules.current[name];

    if (!rule) return true;

    const rawValue = _formValues.current[name];
    const strValue =
      typeof rawValue === "string"
        ? rawValue.trim()
        : rawValue != null
          ? String(rawValue).trim()
          : "";

    if (rule.required) {
      const isEmpty = rawValue == undefined || strValue === "";
      if (isEmpty) {
        _errors.current[name] = {
          type: "required",
          message: typeof rule.required === "string" ? rule.required : "",
        };
        return false;
      }
    }

    if (rule.minLength && strValue.length < rule.minLength.value) {
      _errors.current[name] = {
        type: "minLength",
        message: rule.minLength.message || "",
      };
      return false;
    }

    if (rule.validate) {
      const res = rule.validate(rawValue);
      if (res !== true) {
        _errors.current[name] = {
          type: "validate",
          message: typeof res === "string" ? res : "",
        };
        return false;
      }
    }

    delete _errors.current[name];
    return true;
  }

  function register(name: keyof TFieldValues, option?: RegisterOptions) {
    if (option) {
      _rules.current[name] = option;
    }
    return {
      name: name as string,
      ref: (
        element:
          | HTMLInputElement
          | HTMLTextAreaElement
          | HTMLSelectElement
          | null,
      ) => {
        _fields.current[name as string] = element;
        if (element != null) {
          const defaultValue = _formValues.current[name];
          if (defaultValue != undefined) {
            element.value = String(defaultValue);
          }
        }
      },
      onChange: (
        e: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _formValues.current[name] = e.target.value as any;

        if (_errors.current[name]) {
          validateField(name);
          updateErrors();
        }
      },
    };
  }

  function getValues(name?: keyof TFieldValues) {
    if (name != undefined) return _formValues.current[name];
    return _formValues.current;
  }

  function handleSubmit(onValid: SubmitHandle<TFieldValues>) {
    return async (e?: BaseSyntheticEvent) => {
      if (e?.preventDefault) {
        e.preventDefault();
      }

      for (const name in _fields.current) {
        const el = _fields.current[name] as
          | HTMLInputElement
          | HTMLTextAreaElement;
        if (el && _formValues.current[name] === undefined) {
          (_formValues.current as FieldValues)[name] = el.value as string;
        }
      }
      let hasError = false;
      for (const name in _rules.current) {
        const rule = _rules.current[name];
        if (rule) {
          const res = validateField(name);
          if (!res) {
            hasError = true;
          }
        }
      }

      if (hasError) {
        updateErrors();
        return;
      }

      await onValid(_formValues.current as TFieldValues);
    };
  }

  function reset(values?: Partial<TFieldValues>) {
    const nextValues = values ?? props?.defaultValues ?? {};
    _formValues.current = { ...nextValues };
    _errors.current = {};
    updateErrors();
    for (const name in _fields.current) {
      const el = _fields.current[name] as
        | HTMLInputElement
        | HTMLTextAreaElement;
      if (el) {
        const val = (nextValues as FieldValues)[name];
        el.value = val != null ? String(val) : "";
      }
    }
  }

  return {
    register,
    getValues,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  };
}
