import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-ttc-calculator',
  templateUrl: './ttc-calculator.component.html',
  styleUrls: ['./ttc-calculator.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class TtcCalculatorComponent {
  
  unitPrice = signal<number>(0);
  quantity = signal<number>(1);
  tva = signal<number>(18);
  
  subtotal = computed(() => this.unitPrice() * this.quantity());
  discount = computed(() => this.calculateDiscount(this.quantity()));
  discountAmount = computed(() => this.subtotal() * (this.discount() / 100));
  discountedSubtotal = computed(() => this.subtotal() - this.discountAmount());
  tvaAmount = computed(() => this.discountedSubtotal() * (this.tva() / 100));
  ttcPrice = computed(() => this.discountedSubtotal() + this.tvaAmount());
  ttcPricePerUnit = computed(() => this.ttcPrice() / this.quantity());


  private calculateDiscount(quantity: number): number {
    if (quantity >= 16) return 30; 

    if (quantity >= 10) return 20;

    return 0;
  }
}