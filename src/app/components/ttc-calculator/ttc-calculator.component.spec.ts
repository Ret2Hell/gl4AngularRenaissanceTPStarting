import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TtcCalculatorComponent } from './ttc-calculator.component';

describe('TtcCalculatorComponent', () => {
  let component: TtcCalculatorComponent;
  let fixture: ComponentFixture<TtcCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TtcCalculatorComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TtcCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.calculatorForm.get('unitPrice')?.value).toBe(0);
    expect(component.calculatorForm.get('quantity')?.value).toBe(1);
    expect(component.calculatorForm.get('tva')?.value).toBe(18);
  });

  it('should calculate discount correctly', () => {
    expect((component as any).calculateDiscount(5)).toBe(0);   // No discount
    expect((component as any).calculateDiscount(12)).toBe(20); // 20% discount
    expect((component as any).calculateDiscount(20)).toBe(30); // 30% discount
  });

  it('should validate form', () => {
    component.calculatorForm.patchValue({
      unitPrice: 100,
      quantity: 1,
      tva: 18
    });
    expect(component.isFormValid).toBeTruthy();

    component.calculatorForm.patchValue({
      unitPrice: -1
    });
    expect(component.isFormValid).toBeFalsy();
  });
});