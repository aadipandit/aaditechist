
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import CategoryPage from './pages/CategoryPage';
import Comparison from './pages/Comparison';
import ComparisonView from './pages/ComparisonView';
import BudgetListView from './pages/BudgetListView';
import Admin from './pages/Admin';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/compare" element={<Comparison />} />
          <Route path="/v/:slug" element={<ComparisonView />} />
          <Route path="/best/:slug" element={<BudgetListView />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/news" element={<div className="py-20 text-center text-2xl">News section coming soon! Check Home for highlights.</div>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
console.log('SUPABASE URL:', import.meta.env.VITE_SUPABASE_URL)
