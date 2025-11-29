import { Component, inject, effect, resource, untracked } from '@angular/core';
import { Cv } from '../model/cv';
import { LoggerService } from '../../services/logger.service';
import { ToastrService } from 'ngx-toastr';
import { CvService } from '../services/cv.service';
import { ListComponent } from '../list/list.component';
import { CvCardComponent } from '../cv-card/cv-card.component';
import { EmbaucheComponent } from '../embauche/embauche.component';
import { UpperCasePipe, DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-cv',
    templateUrl: './cv.component.html',
    styleUrls: ['./cv.component.css'],
    imports: [
        ListComponent,
        CvCardComponent,
        EmbaucheComponent,
        UpperCasePipe,
        DatePipe,
    ]
})
export class CvComponent {
  private logger = inject(LoggerService);
  private toastr = inject(ToastrService);
  private cvService = inject(CvService);

  cvsResource = resource<Cv[], void>({
    loader: () => untracked(() =>
      firstValueFrom(this.cvService.getCvs()).catch(() => {
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
        return this.cvService.getFakeCvs();
      })
    ),
  });

  selectedCv = this.cvService.selectedCv;

  date = new Date();

  constructor() {
    effect(() => {
      const cvs = this.cvsResource.value();
      if (cvs) {
        this.cvService.setCvList(cvs);
      }
    });

    effect(() => {
      const cv = this.selectedCv();
      if (cv) {
        this.logger.logger(`CV sélectionné: ${cv.firstname} ${cv.name}`);
      }
    });

    this.logger.logger('je suis le cvComponent');
    this.toastr.info('Bienvenu dans notre CvTech');
  }
}
