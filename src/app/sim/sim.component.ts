import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ArcEnCielDirective } from '../directives/arc-en-ciel.directive';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sim',
  standalone: true,
  imports: [ArcEnCielDirective],
  templateUrl: './sim.component.html',
  styleUrl: './sim.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimComponent {
  private subjectTexte = new Subject<string>();
  text$ = this.subjectTexte.asObservable();
  
  text: string = '';

  onTextChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.text = input.value;
    this.subjectTexte.next(this.text);
  }
}
