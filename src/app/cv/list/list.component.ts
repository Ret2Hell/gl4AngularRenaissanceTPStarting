import { Component, Input, signal, computed } from '@angular/core';
import { Cv } from '../model/cv';
import { NgClass } from '@angular/common';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  standalone: true,
  imports: [NgClass, ItemComponent],
})
export class ListComponent {
  @Input() set cvs(value: Cv[] | null) {
    this._cvs.set(value || []);
  }

  get cvs() {
    return this._cvs();
  }

  private _cvs = signal<Cv[]>([]);

  isEmpty = computed(() => this._cvs().length === 0);

  cvCount = computed(() => this._cvs().length);
}
