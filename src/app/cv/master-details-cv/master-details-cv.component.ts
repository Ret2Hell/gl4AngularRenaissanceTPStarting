import { Component, effect, resource, untracked, computed } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { firstValueFrom, filter } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ListComponent } from '../list/list.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-master-details-cv',
  standalone: true,
  imports: [RouterOutlet, ListComponent],
  templateUrl: './master-details-cv.component.html',
  styleUrls: ['./master-details-cv.component.css']
})
export class MasterDetailsCvComponent {
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

  private navigationEnd = toSignal(
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
  );

  showPlaceholder = computed(() => {
    this.navigationEnd();
    return this.router.url === '/cv/list';
  });

  constructor(
    private cvService: CvService,
    private toastr: ToastrService,
    private router: Router
  ) {
    effect(() => {
      const selectedCv = this.cvService.selectedCv();
      if (selectedCv) {
        this.router.navigate(['/cv/list', selectedCv.id]);
      }
    });
  }
}
