import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { 
  combineLatest, 
  map, 
  startWith, 
  distinctUntilChanged,
  debounceTime,
  Subject,
  takeUntil,
  Observable
} from 'rxjs';

interface CalculationResults {
  unitPrice: number;
  quantity: number;
  tva: number;
  subtotal: number;
  discount: number;
  discountAmount: number;
  discountedSubtotal: number;
  tvaAmount: number;
  ttcPrice: number;
  ttcPricePerUnit: number;
}

@Component({
  selector: 'app-ttc-calculator',
  templateUrl: './ttc-calculator.component.html',
  styleUrls: ['./ttc-calculator.component.css']
})
export class TtcCalculatorComponent implements OnInit, OnDestroy {
  
  calculatorForm: FormGroup;
  
  private destroy$ = new Subject<void>();
  
  calculationResults$!: Observable<CalculationResults>;

  constructor(private fb: FormBuilder) {
    this.calculatorForm = this.fb.group({
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      tva: [18, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
    this.calculationResults$ = this.createCalculationStream();
  }

  ngOnInit(): void {
    this.calculationResults$
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createCalculationStream(): Observable<CalculationResults> {
    const unitPrice$ = this.calculatorForm.get('unitPrice')!.valueChanges.pipe(
      startWith(this.calculatorForm.get('unitPrice')!.value),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => Number(value) || 0)
    );

    const quantity$ = this.calculatorForm.get('quantity')!.valueChanges.pipe(
      startWith(this.calculatorForm.get('quantity')!.value),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => Number(value) || 1)
    );

    const tva$ = this.calculatorForm.get('tva')!.valueChanges.pipe(
      startWith(this.calculatorForm.get('tva')!.value),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => Number(value) || 18)
    );

    return combineLatest([unitPrice$, quantity$, tva$]).pipe(
      map(([unitPrice, quantity, tva]) => {
        const subtotal = unitPrice * quantity;
        const discount = this.calculateDiscount(quantity);
        const discountAmount = subtotal * (discount / 100);
        const discountedSubtotal = subtotal - discountAmount;
        const tvaAmount = discountedSubtotal * (tva / 100);
        const ttcPrice = discountedSubtotal + tvaAmount;
        const ttcPricePerUnit = ttcPrice / quantity;

        return {
          unitPrice,
          quantity,
          tva,
          subtotal,
          discount,
          discountAmount,
          discountedSubtotal,
          tvaAmount,
          ttcPrice,
          ttcPricePerUnit
        } as CalculationResults;
      }),
      distinctUntilChanged((prev, curr) => 
        JSON.stringify(prev) === JSON.stringify(curr)
      )
    );
  }

  private calculateDiscount(quantity: number): number {
    if (quantity >= 16) {
      return 30; 
    } else if (quantity >= 10 && quantity <= 15) {
      return 20; 
    }
    return 0; 
  }

  resetForm(): void {
    this.calculatorForm.patchValue({
      unitPrice: 0,
      quantity: 1,
      tva: 18
    });
  }

  get isFormValid(): boolean {
    return this.calculatorForm.valid;
  }
}