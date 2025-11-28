import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ArcEnCielDirective } from '../directives/arc-en-ciel.directive';

@Component({
    selector: 'app-sim',
    imports: [ArcEnCielDirective],
    templateUrl: './sim.component.html',
    styleUrl: './sim.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimComponent {
  text = signal<string>('');

  onTextChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.text.set(input.value);
  }
}
