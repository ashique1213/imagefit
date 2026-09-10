import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AppRoutes } from './routes';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { PwaInstallBanner } from './components/common/PwaInstallBanner';
import { SkipToContent } from './components/common/SkipToContent';
import { AriaLiveRegion } from './components/common/AriaLiveRegion';

export function App() {
  return (
    <BrowserRouter>
      <SkipToContent />
      <AriaLiveRegion />
      <div className="min-h-screen flex flex-col bg-[#f4f5f8] text-gray-900 selection:bg-[#e5322d] selection:text-white font-sans antialiased overflow-x-hidden">
        <Header />
        <OfflineIndicator />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 focus:outline-none"
        >
          <AppRoutes />
        </main>
        <Footer />
        <PwaInstallBanner />
      </div>
    </BrowserRouter>
  );
}

export default App;
