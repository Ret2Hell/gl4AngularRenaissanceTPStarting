import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * Validateur personnalisé pour vérifier la corrélation entre l'âge et les deux premiers caractères du CIN
 * Règle:
 * - Si age >= 60 ans : les deux premiers chiffres du CIN doivent être entre 00 et 19
 * - Si age < 60 ans : les deux premiers chiffres du CIN doivent être > 19
 *
 * @returns ValidatorFn
 */
export function cinAgeCorrelationValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const ageControl = formGroup.get('age');
    const cinControl = formGroup.get('cin');

    if (!ageControl || !cinControl) {
      return null;
    }

    const age = ageControl.value;
    const cin = cinControl.value;

    if (!age || !cin || cin.length < 2) {
      return null;
    }

    const firstTwoDigits = Number.parseInt(cin.substring(0, 2), 10);

    if (Number.isNaN(firstTwoDigits)) {
      return null;
    }

    if (age >= 60) {
      if (firstTwoDigits > 19) {
        return {
          cinAgeCorrelation: {
            message: 'Pour un âge >= 60 ans, les deux premiers chiffres du CIN doivent être entre 00 et 19',
            age: age,
            cinPrefix: firstTwoDigits
          }
        };
      }
    } else if (firstTwoDigits <= 19) {
      return {
        cinAgeCorrelation: {
          message: 'Pour un âge < 60 ans, les deux premiers chiffres du CIN doivent être supérieurs à 19',
          age: age,
          cinPrefix: firstTwoDigits
        }
      };
    }

    return null;
  };
}

