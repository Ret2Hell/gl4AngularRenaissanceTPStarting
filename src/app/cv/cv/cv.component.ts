import { Component, inject, signal, effect } from '@angular/core';
import { Cv } from '../model/cv';
import { LoggerService } from '../../services/logger.service';
import { ToastrService } from 'ngx-toastr';
import { CvService } from '../services/cv.service';
import { ListComponent } from '../list/list.component';
import { CvCardComponent } from '../cv-card/cv-card.component';
import { EmbaucheComponent } from '../embauche/embauche.component';
import { UpperCasePipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css'],
  standalone: true,
  imports: [
    ListComponent,
    CvCardComponent,
    EmbaucheComponent,
    UpperCasePipe,
    DatePipe,
  ],
})
export class CvComponent {
  private logger = inject(LoggerService);
  private toastr = inject(ToastrService);
  cvService = inject(CvService);

  cvs = signal<Cv[]>([]);

  selectedCv = this.cvService.selectedCv;

  date = new Date();

  constructor() {
    effect(
      () => {
        this.loadCvs();
      },
      { allowSignalWrites: true }
    );

    effect(() => {
      const cv = this.selectedCv();
      if (cv) {
        this.logger.logger(`CV sélectionné: ${cv.firstname} ${cv.name}`);
      }
    });

    this.logger.logger('je suis le cvComponent');
    this.toastr.info('Bienvenu dans notre CvTech');
  }

  private loadCvs() {
    this.cvService.getCvs().subscribe({
      next: (cvs) => {
        this.cvs.set(cvs);
        this.cvService.setCvList(cvs);
      },
      error: () => {
        const fakeCvs = this.cvService.getFakeCvs();
        this.cvs.set(fakeCvs);
        this.cvService.setCvList(fakeCvs);
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
      },
    });
  }
}
