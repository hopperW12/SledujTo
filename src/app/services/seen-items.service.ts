import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MediaItem } from '../models/media-item.model';
import { collection, collectionData, CollectionReference, deleteDoc, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class SeenItemsService {
  private readonly injector = inject(Injector);
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  private initialized = false;

  private readonly itemsSubject = new BehaviorSubject<MediaItem[]>([]);
  readonly items$ = this.itemsSubject.asObservable();

  constructor() {
    this.initFromFirestore();
  }

  private normalizeIdToString(id: unknown): string | null {
    if (id === null || id === undefined) {
      return null;
    }

    if (typeof id === 'number') {
      return String(id);
    }

    if (typeof id === 'string') {
      const trimmed = id.trim();
      return trimmed.length > 0 ? trimmed : null;
    }

    console.warn('normalizeIdToString: unexpected id type', id);
    return null;
  }

  private idsEqual(a: unknown, b: unknown): boolean {
    const aNorm = this.normalizeIdToString(a);
    const bNorm = this.normalizeIdToString(b);
    return aNorm !== null && bNorm !== null && aNorm === bNorm;
  }

  private async initFromFirestore(): Promise<void> {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    try {
      runInInjectionContext(this.injector, () => {
        const user = this.auth.currentUser;
        if (!user) {
          this.itemsSubject.next([]);
          return;
        }

        const colRef = collection(this.firestore, 'users', user.uid, 'seenItems') as CollectionReference<MediaItem>;

        collectionData(colRef, {idField: 'id'}).subscribe({
          next: (items) => {
            // ID z Firestore muze byt string; nechame ho projit a porovnavani resime pres idsEqual
            this.itemsSubject.next(items as MediaItem[]);
          },
          error: (err) => {
            console.error('Failed to load seen items from Firestore', err);
            this.itemsSubject.next([]);
          },
        });
      });
    } catch (e) {
      console.error('Unexpected error while initializing seen items from Firestore', e);
      this.itemsSubject.next([]);
    }
  }

  private toFirestoreItem(item: MediaItem, seenAt: string): Record<string, unknown> {
    // Vytvorim plain objekt bez undefined hodnot, protoze Firestore undefined nepodporuje
    const base: MediaItem = { ...item, seenAt };
    const cleaned: Record<string, unknown> = {};

    Object.entries(base).forEach(([key, value]) => {
      if (value !== undefined) {
        cleaned[key] = value;
      }
    });

    return cleaned;
  }

  getAll$() {
    return this.items$;
  }

  isSeen(item: MediaItem): boolean {
    return this.itemsSubject.value.some(
      (x) => this.idsEqual(x.id, item.id) && x.type === item.type
    );
  }

  async toggleSeen(item: MediaItem): Promise<void> {
    // Zajistim, ze subscription na Firestore je navazana, pokud je uzivatel prihlasen
    await this.initFromFirestore();

    if (this.isSeen(item)) {
      await this.remove(item);
    } else {
      await this.markAsSeen(item);
    }
  }

  async markAsSeen(item: MediaItem): Promise<void> {
    const now = new Date().toISOString();

    const existing = this.itemsSubject.value;
    const index = existing.findIndex((x) => this.idsEqual(x.id, item.id) && x.type === item.type);

    let updated: MediaItem[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...existing[index], ...item, seenAt: now };
    } else {
      updated = [...existing, { ...item, seenAt: now }];
    }

    // Okamzite aktualizujeme lokalni stav, aby se front-end hned prepnul
    this.itemsSubject.next(updated);

    try {
      await runInInjectionContext(this.injector, async () => {
        const user = this.auth.currentUser;
        if (!user) {
          console.warn('markAsSeen called without authenticated user; change not persisted to Firestore');
          return;
        }

        const firestoreId = this.normalizeIdToString(item.id);
        if (!firestoreId) {
          console.warn('markAsSeen called with invalid item id; change not persisted to Firestore', item);
          return;
        }

        const docRef = doc(this.firestore, 'users', user.uid, 'seenItems', firestoreId);
        const payload = this.toFirestoreItem(item, now);
        await setDoc(docRef, payload, { merge: true });
      });
    } catch (e) {
      console.error('Failed to save seen item to Firestore', e);
    }
  }

  async remove(item: MediaItem): Promise<void> {
    const updated = this.itemsSubject.value.filter(
      (x) => !(this.idsEqual(x.id, item.id) && x.type === item.type)
    );
    this.itemsSubject.next(updated);

    try {
      await runInInjectionContext(this.injector, async () => {
        const user = this.auth.currentUser;
        if (!user) {
          console.warn('remove called without authenticated user; change not persisted to Firestore');
          return;
        }

        const firestoreId = this.normalizeIdToString(item.id);
        if (!firestoreId) {
          console.warn('remove called with invalid item id; change not persisted to Firestore', item);
          return;
        }

        const docRef = doc(this.firestore, 'users', user.uid, 'seenItems', firestoreId);
        await deleteDoc(docRef);
      });
    } catch (e) {
      console.error('Failed to remove seen item from Firestore', e);
    }
  }
}
