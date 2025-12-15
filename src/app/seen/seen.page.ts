import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonText, IonThumbnail, IonImg, IonIcon } from '@ionic/angular/standalone';
import { SeenItemsService } from '../services/seen-items.service';
import { MediaItem } from '../models/media-item.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-seen',
  templateUrl: 'seen.page.html',
  styleUrls: ['seen.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonText,
    IonThumbnail,
    IonImg
  ],
})
export class SeenPage {
  private readonly seenItemsService = inject(SeenItemsService);

  readonly imageBaseUrl = environment.tmdbImageBaseUrl;

  seenItems$ = this.seenItemsService.getAll$();

  remove(item: MediaItem) {
    this.seenItemsService.remove(item);
  }
}
