import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";
import { map, catchError, debounceTime, switchMap } from "rxjs/operators";
import { CvService } from "../services/cv.service";

/**
 * Validateur asynchrone pour vérifier l'unicité du CIN
 * @param cvService
 * @returns AsyncValidatorFn
 */
export function cinUniqueValidator(cvService: CvService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap((cin: string) =>
        cvService.selectByProperty("cin", cin).pipe(
          map((cvs) => {
            return cvs && cvs.length > 0 ? { cinNotUnique: true } : null;
          }),
          catchError(() => {
            return of(null);
          })
        )
      )
    );
  };
}

