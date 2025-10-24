import { Injectable, signal, computed } from '@angular/core';
import { Cv } from '../model/cv';

@Injectable({
  providedIn: 'root',
})
export class EmbaucheService {
  private embauchees = signal<Cv[]>([]);

  embaucheesCount = computed(() => this.embauchees().length);

  hasEmbauchees = computed(() => this.embauchees().length > 0);

  constructor() {}

  /**
   *
   * Retourne la liste des embauchees
   *
   * @returns CV[]
   *
   */
  getEmbauchees(): Cv[] {
    return this.embauchees();
  }

  /**
   *
   * Embauche une personne si elle ne l'est pas encore
   * Sinon il retourne false
   *
   * @param cv : Cv
   * @returns boolean
   */
  embauche(cv: Cv): boolean {
    const currentEmbauchees = this.embauchees();
    const isAlreadyEmbauched = currentEmbauchees.some(
      (embauche) => embauche.id === cv.id
    );

    if (!isAlreadyEmbauched) {
      this.embauchees.set([...currentEmbauchees, cv]);
      return true;
    }
    return false;
  }

  /**
   * Retire une personne de la liste des embauchées
   *
   * @param cv : Cv
   * @returns boolean
   */
  desembaucher(cv: Cv): boolean {
    const currentEmbauchees = this.embauchees();
    const filteredEmbauchees = currentEmbauchees.filter(
      (embauche) => embauche.id !== cv.id
    );

    if (filteredEmbauchees.length !== currentEmbauchees.length) {
      this.embauchees.set(filteredEmbauchees);
      return true;
    }
    return false;
  }
}
