import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/400-italic.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import '@fontsource/be-vietnam-pro/800.css';

import 'reveal.js/reset.css';
import 'reveal.js/reveal.css';
import './styles/main.css';

import { initLacHongApp } from './scripts/slides-app.js';

window.addEventListener('DOMContentLoaded', () => {
  initLacHongApp().catch((err) => {
    console.error('Failed to initialize LẠC HỒNG SỐ exhibition:', err);
  });
});
