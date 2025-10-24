import { Directive } from '@angular/core';

@Directive({
  selector: 'input[appArcEnCiel][type=text]',
  standalone: true,
  host: {
    '[style.color]': 'textColor',
    '[style.borderColor]': 'borderColor',
    '(keyup)': 'onKeyUp()',
  },
})
export class ArcEnCielDirective {
  textColor: string = 'black';
  borderColor: string = 'black';

  private colors: string[] = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'indigo',
    'violet',
  ];

  onKeyUp(): void {
    const randomColor =
      this.colors[Math.floor(Math.random() * this.colors.length)];
    this.textColor = randomColor;
    this.borderColor = randomColor;
  }
}
