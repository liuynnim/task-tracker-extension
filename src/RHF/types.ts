// eslint-disable-next-line
export type FieldValues = Record<string, any>;

export type SubmitHandle<T> = (data: T) => void | Promise<void>;

export type RegisterOptions = {
  required?: boolean | string;
  minLength?: {
    value: number;
    message?: string;
  };
  // eslint-disable-next-line
  validate?: (value: any) => boolean | string;
};

export type FieldError = {
  type: string;
  message?: string;
};

export type FieldErrors<T> = Partial<Record<keyof T, FieldError>>;
