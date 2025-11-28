import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild, Type } from "@angular/core";
import { Cv } from "../model/cv";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";
import { Observable, catchError, of } from "rxjs";

@Component({
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"],
})
export class CvComponent implements AfterViewInit, OnDestroy {
  cvs$: Observable<Cv[]>;
  selectedCv: Cv | null = null;
  /*   selectedCv: Cv | null = null; */
  date = new Date();
  @ViewChild('embaucheSentinel', { static: false }) sentinelRef?: ElementRef<HTMLDivElement>;

  embaucheRequested = false;
  loading = false;
  error: string | null = null;
  embaucheCmp: Type<any> | null = null;

  private observer?: IntersectionObserver;

  constructor(
    private logger: LoggerService,
    private toastr: ToastrService,
    private cvService: CvService
  ) {
    this.cvs$ = this.cvService.getCvs().pipe(
      catchError(() => {
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
        return of(this.cvService.getFakeCvs());
      })
    );
    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
    this.cvService.selectCv$.subscribe((cv) => (this.selectedCv = cv));
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.sentinelRef) {
      return;
    }
    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !this.embaucheRequested) {
        this.embaucheRequested = true;
        this.loadEmbauche();
        if (this.observer && this.sentinelRef) {
          this.observer.unobserve(this.sentinelRef.nativeElement);
        }
      }
    }, { root: null, threshold: 0 });

    this.observer.observe(this.sentinelRef.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer && this.sentinelRef) {
      this.observer.unobserve(this.sentinelRef.nativeElement);
      this.observer.disconnect();
    }
  }

  private async loadEmbauche(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const module = await import('../embauche/embauche.component');
      this.embaucheCmp = module.EmbaucheComponent;
    } catch (e: any) {
      this.error = e?.message;
    } finally {
      this.loading = false;
    }
  }
}
