
import React, { useState, useEffect } from 'react';
import { CashflowItem, CashflowState } from '@/types/cashflow';
import CashflowForm from '@/components/CashflowForm';
import SankeyDiagram from '@/components/SankeyDiagram';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { getStateFromUrl, updateUrlWithState } from '@/utils/urlUtils';
import { Button } from '@/components/ui/button';
import { Share2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Update the document title and metadata
useEffect(() => {
  // Set the page title
  document.title = 'Cashkey | Visualize your annual cashflow';
  
  // Update meta tags for social sharing
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', 'Visualize your annual cashflow');
  } else {
    const newMeta = document.createElement('meta');
    newMeta.name = 'description';
    newMeta.content = 'Visualize your annual cashflow';
    document.head.appendChild(newMeta);
  }
  
  // Add Open Graph meta tags for social sharing
  const ogTags = [
    { property: 'og:title', content: 'Cashkey' },
    { property: 'og:description', content: 'Visualize your annual cashflow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'twitter:title', content: 'Cashkey' },
    { property: 'twitter:description', content: 'Visualize your annual cashflow' },
  ];
  
  ogTags.forEach(tag => {
    let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
    if (metaTag) {
      metaTag.setAttribute('content', tag.content);
    } else {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('property', tag.property);
      metaTag.setAttribute('content', tag.content);
      document.head.appendChild(metaTag);
    }
  });
  
  // Set favicon to money with wings emoji
  const faviconLink = document.querySelector('link[rel="icon"]');
  if (faviconLink) {
    faviconLink.setAttribute('href', 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💸</text></svg>');
  } else {
    const newFavicon = document.createElement('link');
    newFavicon.rel = 'icon';
    newFavicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💸</text></svg>';
    document.head.appendChild(newFavicon);
  }
}, []);

const Index = () => {
  const [incomes, setIncomes] = useState<CashflowItem[]>([]);
  const [expenses, setExpenses] = useState<CashflowItem[]>([]);
  
  // Initialize with sample data if nothing from URL
  useEffect(() => {
    const savedState = getStateFromUrl();
    
    if (savedState) {
      setIncomes(savedState.incomes);
      setExpenses(savedState.expenses);
    } else {
      // Sample data for first-time users
      setIncomes([
        { id: uuidv4(), name: 'Salary', amount: 5000 },
        { id: uuidv4(), name: 'Side Hustle', amount: 1000 },
      ]);
      
      setExpenses([
        { id: uuidv4(), name: 'Housing', amount: 1800 },
        { id: uuidv4(), name: 'Food', amount: 600 },
        { id: uuidv4(), name: 'Transportation', amount: 400 },
        { id: uuidv4(), name: 'Utilities', amount: 300 },
      ]);
    }
  }, []);
  
  // Update URL whenever state changes
  useEffect(() => {
    if (incomes.length || expenses.length) {
      const state: CashflowState = { incomes, expenses };
      updateUrlWithState(state);
    }
  }, [incomes, expenses]);
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard', {
      description: 'Share this URL to show your cash flow diagram',
      position: 'top-center',
    });
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <header className="mb-8 text-center relative">
          <div className="absolute right-0 top-0">
            <ThemeSwitcher />
          </div>
          
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/5 text-primary/80 text-xs font-medium mb-3 animate-fade-in">
            <span className="mr-1">💸</span> All changes auto-save to URL
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text animate-slide-up">
            Cashkey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up [animation-delay:100ms]">
            Visualize your annual cashflow
          </p>
        </header>
        
        {/* Main content */}
        <div className="glass-panel p-6 md:p-8 animate-fade-in [animation-delay:200ms]">
          <div className="flex flex-col space-y-8">
            {/* Sankey diagram visualization */}
            <SankeyDiagram 
              incomes={incomes} 
              expenses={expenses} 
              className="animate-fade-in [animation-delay:300ms]"
            />
            
            {/* Share button and info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button 
                variant="outline" 
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share Cash Flow Diagram
              </Button>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Info className="h-4 w-4 mr-1" />
                Your data is stored only in the URL
              </div>
            </div>
            
            {/* Form for data entry */}
            <CashflowForm
              incomes={incomes}
              expenses={expenses}
              onUpdateIncomes={setIncomes}
              onUpdateExpenses={setExpenses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
