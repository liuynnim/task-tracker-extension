import { vi } from "./locales/vi";

export type Language = "vi" | "en";

export type TranslationSchema = typeof vi;

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<TranslationSchema>;

export type TranslationParams = Record<string, string | number>;
