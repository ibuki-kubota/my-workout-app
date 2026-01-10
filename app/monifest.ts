import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Red Workout',
    short_name: 'Workout',
    description: 'My personal workout logger',
    start_url: '/',
    display: 'standalone', // これが「アプリっぽく全画面表示」にする設定
    background_color: '#0a0a0a',
    theme_color: '#dc2626',
    icons: [
      {
        src: '/logo.jpg', // publicフォルダに置いた画像
        sizes: 'any',
        type: 'image/jpg',
      },
    ],
  };
}