// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBPy0hH0jZqzQjdOV2zHdjkRVII2so1Gss",
    authDomain: "sledujto-f21b0.firebaseapp.com",
    projectId: "sledujto-f21b0",
    storageBucket: "sledujto-f21b0.firebasestorage.app",
    messagingSenderId: "510362666942",
    appId: "1:510362666942:web:42b5fd9f9bab6537d3dbef",
  },
  tmdbAccessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOGQ4N2QzMWMwM2U2YmYzZjQ0YTA2ODA2ZGQ5MWQyMiIsIm5iZiI6MTc2NDE0MzkyNS40NjQsInN1YiI6IjY5MjZiMzM1OTc2ODE2ZmIyYzI2YjdkMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.laZd4SONCQ3YfE90sN-amTPPv5X3rL0WgT0DiGdE-bI',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p/w500',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
