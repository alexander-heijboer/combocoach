import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Timer from './pages/Timer';
import Activity from './pages/Activity';
import ActiveWorkout from './pages/ActiveWorkout';
import WorkoutDetail from './pages/WorkoutDetail';
import Settings from './pages/Settings';
import GenerateWorkout from './pages/GenerateWorkout';
import CustomBuilder from './pages/CustomBuilder';
import LoadingScreen from './components/LoadingScreen';
import ProModal from './components/ProModal';
import AuthScreen from './pages/AuthScreen';
import { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { useAuth } from './contexts/AuthContext';
import { Analytics } from '@vercel/analytics/react';
import { Capacitor } from '@capacitor/core';
import './App.css';

function App() {
  const verifyProStatus = useAppStore(state => state.verifyProStatus);
  const { user, isGuest, loading } = useAuth();
  const [showMobileSplash, setShowMobileSplash] = useState(() => {
    return Capacitor.getPlatform() !== 'web';
  });

  useEffect(() => {
    verifyProStatus();
  }, [verifyProStatus]);

  useEffect(() => {
    if (showMobileSplash) {
      const timer = setTimeout(() => {
        setShowMobileSplash(false);
      }, 3000); // Wait for LoadingScreen to finish its 3s animation
      return () => clearTimeout(timer);
    }
  }, [showMobileSplash]);

  if (showMobileSplash) {
    return <LoadingScreen />;
  }

  if (loading) {
    return null;
  }

  if (!user && !isGuest) {
    return <AuthScreen />;
  }

  return (
    <>
      <Analytics />
      <ProModal />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/workout/:id" element={<WorkoutDetail />} />
            <Route path="/ai-workout" element={<GenerateWorkout />} />
            <Route path="/workout/custom-builder" element={<CustomBuilder />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/workout/:id/active" element={<ActiveWorkout />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
