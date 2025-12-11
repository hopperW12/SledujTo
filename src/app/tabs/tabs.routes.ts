import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'search',
        loadComponent: () =>
          import('../search/search.page').then((m) => m.SearchPage),
      },
      {
        path: 'seen',
        loadComponent: () =>
          import('../seen/seen.page').then((m) => m.SeenPage),
      },
      {
        path: '',
        redirectTo: '/tabs/search',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/search',
    pathMatch: 'full',
  },
];
