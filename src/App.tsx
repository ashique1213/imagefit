import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AppRoutes } from './routes';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { PwaInstallBanner } from './components/common/PwaInstallBanner';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white font-sans antialiased">
        <Header />
        <OfflineIndicator />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AppRoutes />
        </main>
        <Footer />
        <PwaInstallBanner />
      </div>
    </BrowserRouter>
  );
}

export default App;
