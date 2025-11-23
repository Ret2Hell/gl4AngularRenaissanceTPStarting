import { Component } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  concatMap,
  map,
  takeWhile,
  scan,
  startWith,
  shareReplay,
} from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent {
  /* Todo : Faire le nécessaire pour créer le flux des produits à afficher */
  /* Tips : vous pouvez voir les différents imports non utilisés et vous en inspirer */
  products$!: Observable<Product[]>;
  hasMore$!: Observable<boolean>;

  private loadMore$ = new BehaviorSubject<void>(undefined);

  constructor(private productService: ProductService) {
    const responses$ = this.loadMore$.pipe(
      scan((acc: Settings, _) => ({ limit: 12, skip: acc.skip + 12 }), { limit: 12, skip: -12 }),
      concatMap(settings => this.productService.getProducts(settings)),
      takeWhile(response => response.skip + response.products.length < response.total, true),
      shareReplay(1)
    );

    this.products$ = responses$.pipe(
      scan((acc, response) => [...acc, ...response.products], [] as Product[])
    );

    this.hasMore$ = responses$.pipe(
      map(response => response.skip + response.products.length < response.total),
      startWith(true)
    );
  }

  loadMore() {
    this.loadMore$.next();
  }
}
