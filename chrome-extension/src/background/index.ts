import { exampleThemeStorage } from '@extension/storage';
import 'webextension-polyfill';
import setupMessageHandlers from './services/setupMessageHandlers';
exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('Background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

setupMessageHandlers();
