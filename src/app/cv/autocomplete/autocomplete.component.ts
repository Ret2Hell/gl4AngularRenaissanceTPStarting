import { Component, inject, signal, computed, effect } from '@angular/core';
import {
  FormBuilder,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CvService } from '../services/cv.service';
import { Cv } from '../model/cv';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class AutocompleteComponent {
  formBuilder = inject(FormBuilder);
  cvService = inject(CvService);

  searchResults = signal<Cv[]>([]);

  isLoading = signal<boolean>(false);

  searchTerm = signal<string>('');

  hasResults = computed(() => this.searchResults().length > 0);

  isSearchEmpty = computed(() => this.searchTerm().trim().length === 0);

  get search(): AbstractControl {
    return this.form.get('search')!;
  }

  form = this.formBuilder.group({ search: [''] });

  constructor() {
    effect(() => {
      const term = this.searchTerm();
      if (term.trim().length > 2) {
        this.performSearch(term);
      } else {
        this.searchResults.set([]);
      }
    });

    this.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.searchTerm.set(value || '');
      });
  }

  private performSearch(term: string) {
    this.isLoading.set(true);
    this.cvService.selectByName(term).subscribe({
      next: (results) => {
        this.searchResults.set(results);
        this.isLoading.set(false);
      },
      error: () => {
        this.searchResults.set([]);
        this.isLoading.set(false);
      },
    });
  }

  selectCv(cv: Cv) {
    this.cvService.selectCv(cv);
    this.search.setValue('');
    this.searchResults.set([]);
  }

  clearResults() {
    this.searchResults.set([]);
    this.search.setValue('');
  }
}
