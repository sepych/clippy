import { AbstractControl } from '@angular/forms';

export type FormGeneric<T> = {
  [P in keyof T]: AbstractControl<T[P]>
};
