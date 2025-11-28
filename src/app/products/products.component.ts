import { Component, signal, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from './dto/product.dto';
import { ProductService } from './services/product.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css'],
    imports: [CommonModule]
})
export class ProductsComponent {
  products = signal<Product[]>([]);
  skip = signal(0);
  readonly limit = 12;
  total: number | null = null;

  constructor(private productService: ProductService) {
    this.loadMore();
  }

  loadMore() {
    if (this.total !== null && this.products().length >= this.total) return;

    const setting = { limit: this.limit, skip: this.skip() };
    this.productService.getProducts(setting).subscribe({
      next: (resp) => {
        this.products.update((p) => [...p, ...resp.products]);
        this.skip.set(this.skip() + resp.products.length);
        this.total = resp.total ?? this.total;
      },
      error: () => {}
    });
  }

  trackById(_index: number, item: Product) {
    return item.id;
  }
}
