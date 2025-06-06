import React from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import JobGrid from './components/JobGrid';
import './index.css'
import { SearchProvider } from './components/SearchContext';

function App() {
  return (
    <SearchProvider>
    <main className="bg-[rgba(251,251,255,1)] flex flex-col overflow-hidden items-center pb-[23px]">
      <Navbar />
      <section className="w-full px-[63px] max-md:px-5">
        <SearchBar />
      </section>
      <section className="w-full px-[63px] max-md:px-5">
        <JobGrid />
      </section>
    </main>
    </SearchProvider>
  );
}

export default App;