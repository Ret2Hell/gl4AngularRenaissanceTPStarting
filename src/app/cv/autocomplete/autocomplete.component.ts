import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, AbstractControl } from "@angular/forms";
import { Router } from "@angular/router";
import { debounceTime, distinctUntilChanged, switchMap, startWith, of } from "rxjs";
import { CvService } from "../services/cv.service";
import { Cv } from "../model/cv";

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"],
})
export class AutocompleteComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  cvService = inject(CvService);
  router = inject(Router);
  
  // Form control for search input
  form = this.formBuilder.group({ search: [""] });
  
  // Observable stream of filtered CVs based on search input
  filteredCvs$ = this.search.valueChanges.pipe(
    startWith(""), // Start with empty string to show all CVs initially
    debounceTime(300), // Wait 300ms after user stops typing to minimize HTTP calls
    distinctUntilChanged(), // Only emit when value actually changes
    switchMap((searchTerm: string) => {
      // If search is empty or too short, return empty array
      if (!searchTerm || searchTerm.trim().length === 0) {
        return of([]);
      }
      // Use the service method with LoopBack filter syntax
      return this.cvService.selectByName(searchTerm.trim());
    })
  );
  
  get search(): AbstractControl {
    return this.form.get("search")!;
  }

  ngOnInit(): void {
    // Component is initialized and reactive stream is set up
  }

  /**
   * Handle CV selection from autocomplete suggestions
   * Navigate to CV details page (same UI as clicking from CV list)
   * @param cv - The selected CV to display
   */
  onSelectCv(cv: Cv): void {
    // Navigate to the details page, same as clicking from CV list
    this.router.navigate(['/cv', cv.id]);
  }

  /**
   * Clear the search and reset the component
   */
  clearSearch(): void {
    this.search.setValue("");
  }
}
