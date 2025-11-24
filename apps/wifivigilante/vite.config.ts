import { createViteConfig } from '../../vite.config.base';

export default createViteConfig({
  appName: 'wifivigilante',
  port: 3000,
  vendorChunks: {
    'vendor-radix': ['@radix-ui/react-icons'],
    // download deps are now lazy-loaded; keep bundle small
  },
});
