export const rgx0Spaces = /^\S*$/;
export const rgxSpecialChar = /[@#$%&*!]/;
export const rgxNumbersPlus = /^\+?[0-9]+$/;
export const rgxNumbers = /^[0-9 ]+$/;
export const rgxLetters = /^[A-Za-z ]+$/;
export const rgxNoSpecialChar = /^[^@#$%&*!]+$/;
export const rgxLettersNumbers = /^[A-Za-z0-9 ]+$/;
export const rgxSpaces = /\s+/g;
export const rgx1Upper = /[A-Z]/;
export const rgx1Number = /[0-9]/;

export type PartialNull<T> = {
  [P in keyof T]: T[P] | null;
};
