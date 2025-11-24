import { createViteConfig } from '../../vite.config.base';

export default createViteConfig({
  appName: 'wifivigilante',
  port: 3000,
  vendorChunks: {
    'vendor-radix': ['@radix-ui/react-icons'],
    'vendor-download': ['html2canvas', 'jspdf'],
  },
});
