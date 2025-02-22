import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'Products/:type',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      return [
        { type: 'vegetables' },
        { type: 'fruits' },
        { type: 'Spices' }
      ];
    }
  }
];
