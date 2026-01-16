import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Blue Workout',
    short_name: 'Workout',
    description: 'My personal workout logger',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/Gemini_Generated_Image_m91ni3m91ni3m91n.png', // publicフォルダのicon.pngを参照
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/Gemini_Generated_Image_m91ni3m91ni3m91n.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}