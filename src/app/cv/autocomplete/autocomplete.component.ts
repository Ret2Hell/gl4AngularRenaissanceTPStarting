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
  
  form = this.formBuilder.group({ search: [""] });
  
  filteredCvs$ = this.search.valueChanges.pipe(
    startWith(""), 
    debounceTime(300), 
    distinctUntilChanged(), 
    switchMap((searchTerm: string) => {
      
      if (!searchTerm || searchTerm.trim().length === 0) {
        return of([]);
      }
      return this.cvService.selectByName(searchTerm.trim());
    })
  );
  
  get search(): AbstractControl {
    return this.form.get("search")!;
  }

  ngOnInit(): void {
  }

  
  onSelectCv(cv: Cv): void {
    this.router.navigate(['/cv', cv.id]);
  }

  
  clearSearch(): void {
    this.search.setValue("");
  }
}
