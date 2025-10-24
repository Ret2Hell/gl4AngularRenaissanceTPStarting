import { Component, inject, computed } from '@angular/core';
import { EmbaucheService } from '../services/embauche.service';

import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-embauche',
  templateUrl: './embauche.component.html',
  styleUrls: ['./embauche.component.css'],
  standalone: true,
  imports: [ItemComponent],
})
export class EmbaucheComponent {
  embaucheService = inject(EmbaucheService);

  embauchees = computed(() => this.embaucheService.getEmbauchees());

  hasEmbauchees = this.embaucheService.hasEmbauchees;

  embaucheesCount = this.embaucheService.embaucheesCount;

  constructor() {}
}
