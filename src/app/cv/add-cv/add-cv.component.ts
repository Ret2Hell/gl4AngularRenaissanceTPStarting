import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { CvService } from "../services/cv.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { APP_ROUTES } from "src/config/routes.config";
import { Cv } from "../model/cv";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-add-cv",
  templateUrl: "./add-cv.component.html",
  styleUrls: ["./add-cv.component.css"],
})
export class AddCvComponent implements OnInit {
  private readonly FORM_STORAGE_KEY = 'add-cv-form-data';
  private formSubscription = new Subscription();

  constructor(
    private cvService: CvService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.restoreFormData();

    this.age.valueChanges.subscribe((age) => {
      if (age < 18) {
        this.path?.disable();
      } else {
        this.path?.enable();
      }
    });
    if (this.age.value < 18) {
      this.path?.disable();
    }

    this.formSubscription.add(
      this.form.valueChanges
        .pipe(debounceTime(500))
        .subscribe((formValue) => {
          this.saveFormData(formValue);
        })
    );
  }

  form = this.formBuilder.group(
    {
      name: ["", Validators.required],
      firstname: ["", Validators.required],
      path: [""],
      job: ["", Validators.required],
      cin: [
        "",
        {
          validators: [Validators.required, Validators.pattern("[0-9]{8}")],
        },
      ],
      age: [
        0,
        {
          validators: [Validators.required],
        },
      ],
    },
  );

  addCv() {
    this.cvService.addCv(this.form.value as Cv).subscribe({
      next: (cv) => {
        localStorage.removeItem(this.FORM_STORAGE_KEY);
        this.router.navigate([APP_ROUTES.cv]);
        this.toastr.success(`Le cv ${cv.firstname} ${cv.name}`);
      },
      error: (err) => {
        this.toastr.error(
          `Une erreur s'est produite, Veuillez contacter l'admin`
        );
      },
    });
  }

  private saveFormData(formValue: any): void {
    localStorage.setItem(this.FORM_STORAGE_KEY, JSON.stringify(formValue));
  }

  private restoreFormData(): void {
    const savedData = localStorage.getItem(this.FORM_STORAGE_KEY);
    if (savedData) {
      const formData = JSON.parse(savedData);
      this.form.patchValue(formData);
    }
  }

  resetForm(): void {
    this.form.reset();
    localStorage.removeItem(this.FORM_STORAGE_KEY);
  }

  get name(): AbstractControl {
    return this.form.get("name")!;
  }
  get firstname() {
    return this.form.get("firstname");
  }
  get age(): AbstractControl {
    return this.form.get("age")!;
  }
  get job() {
    return this.form.get("job");
  }
  get path() {
    return this.form.get("path");
  }
  get cin(): AbstractControl {
    return this.form.get("cin")!;
  }
}
