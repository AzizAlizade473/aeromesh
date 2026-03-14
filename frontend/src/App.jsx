import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SystemExplainer from './components/SystemExplainer';
import ModuleExploder from './components/ModuleExploder';
import ChemistrySection from './components/ChemistrySection';
import RegenerationCycle from './components/RegenerationCycle';
import Dashboard from './components/Dashboard';
import EconomicsSection from './components/EconomicsSection';
import ResearchCards from './components/ResearchCards';
import SDGSection from './components/SDGSection';
import TRLTimeline from './components/TRLTimeline';
import TeamSection from './components/TeamSection';
import Footer from './components/Footer';

function MainSite() {
  const [loading, setLoading] = useState(true);



  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <>
      <Navbar />
      <Hero />
      <SystemExplainer />
      <ModuleExploder />
      <ChemistrySection />
      <RegenerationCycle />
      <Dashboard />
      <EconomicsSection />
      <ResearchCards />
      <SDGSection />
      <TRLTimeline />
      <TeamSection />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<MainSite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
