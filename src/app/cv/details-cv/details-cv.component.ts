import { Component, inject, computed, untracked, resource } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CvService } from '../services/cv.service';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { Cv } from '../model/cv';

@Component({
  selector: 'app-details-cv',
  standalone: true,
  styleUrls: ['./details-cv.component.css'],
  templateUrl: './details-cv.component.html',
  imports: [DefaultImagePipe],
})
export class DetailsCvComponent {
  private cvService = inject(CvService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  paramsSignal = toSignal(this.route.params, {
  initialValue: { id: null }
  });

id = computed(() => Number(this.paramsSignal().id));

  cvResource = resource<Cv, { id: number }>({
    request: () => {
      return { id: this.id() };
    },
    loader: ({ request }) =>
      untracked(() => firstValueFrom(this.cvService.getCvById(request.id))),
  });

  cv = computed(() => this.cvResource.value());

  deleteCv() {
    const currentCv = this.cv();
    if (!currentCv) return;

    this.cvService.deleteCvById(currentCv.id).subscribe({
      next: () => {
        this.toastr.success(`${currentCv.name} supprimé avec succès`);
        this.router.navigate([APP_ROUTES.cv]);
      },
      error: () =>
        this.toastr.error(
          `Problème avec le serveur veuillez contacter l'admin`
        ),
    });
  }
}
