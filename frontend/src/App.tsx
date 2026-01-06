import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchPage from './pages/SearchPage';
import './index.css';
import './App.css';
import './components/SearchForm.css';
import './components/FlightCard.css';
import './components/SeatMap.css';
import './components/PassengerForm.css';
import './components/PaymentForm.css';
import './pages/SearchPage.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="app">
                <header className="app-header">
                    <div className="container">
                        <div className="header-content">
                            <h1 className="logo">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                </svg>
                                SkyBook
                            </h1>
                            <nav className="nav">
                                <a href="#" className="nav-link">Flights</a>
                                <a href="#" className="nav-link">My Bookings</a>
                                <a href="#" className="nav-link">Help</a>
                            </nav>
                        </div>
                    </div>
                </header>

                <main className="app-main">
                    <SearchPage />
                </main>

                <footer className="app-footer">
                    <div className="container">
                        <p>&copy; 2026 SkyBook. Built with React + Go for high-performance flight booking.</p>
                    </div>
                </footer>
            </div>
        </QueryClientProvider>
    );
};

export default App;
