import { Component, signal, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from './dto/product.dto';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ProductsComponent {
  readonly limit = 12;

  skip = signal(0);
  products = signal<Product[]>([]);
  total = signal<number | null>(null);
  loadTrigger = signal(0);

  constructor(private productService: ProductService) {
    this.loadMore();
  }

  productResource = resource({
    request: () => this.loadTrigger(),
    loader: async () => {
      const setting = { limit: this.limit, skip: this.skip() };
      const resp = this.productService.getProducts(setting);

      this.products.update((p) => [...p, ...resp.products]);
      this.skip.set(this.skip() + resp.products.length);
      this.total.set(resp.total ?? this.total());

      return resp;
    },
  });

  loadMore() {
    if (this.total() !== null && this.products().length >= this.total()!) return;
    this.loadTrigger.set(this.loadTrigger() + 1);
  }

  trackById(_index: number, item: Product) {
    return item.id;
  }
}
