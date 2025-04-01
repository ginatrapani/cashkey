import React, { useState, useEffect } from 'react';
import { CashflowItem, CashflowState } from '@/types/cashflow';
import CashflowForm from '@/components/CashflowForm';
import SankeyDiagram from '@/components/SankeyDiagram';
import { getStateFromUrl, updateUrlWithState } from '@/utils/urlUtils';
import { Button } from '@/components/ui/button';
import { Share2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const [incomes, setIncomes] = useState<CashflowItem[]>([]);
  const [expenses, setExpenses] = useState<CashflowItem[]>([]);
  
  // Update the document title and metadata
  useEffect(() => {
    // Set the page title
    document.title = 'Cashkey | Visualize your annual cash flow';
    
    // Update meta tags for social sharing
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Visualize your annual cash flow');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = 'Visualize your annual cash flow';
      document.head.appendChild(newMeta);
    }
    
    // Add Open Graph meta tags for social sharing
    const ogTags = [
      { property: 'og:title', content: 'Cashkey' },
      { property: 'og:description', content: 'Visualize your annual cash flow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { property: 'twitter:title', content: 'Cashkey' },
      { property: 'twitter:description', content: 'Visualize your annual cash flow' },
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
  
  // Initialize with sample data if nothing from URL
  useEffect(() => {
    const savedState = getStateFromUrl();
    
    if (savedState) {
      setIncomes(savedState.incomes);
      setExpenses(savedState.expenses);
    } else {
      // Sample data for first-time users with realistic U.S. median values
      setIncomes([
        { id: uuidv4(), name: '💵 Paycheck', amount: 54132 }, // Median U.S. annual salary
        { id: uuidv4(), name: '💰 Side Hustle', amount: 5000 }, // As specified
      ]);
      
      setExpenses([
        { id: uuidv4(), name: '🏡 Housing', amount: 16608 }, // Median U.S. rent for 1-bedroom ($1,384/month)
        { id: uuidv4(), name: '🍔 Food', amount: 8172 }, // Median U.S. food expense ($681/month)
        { id: uuidv4(), name: '💡 Utilities', amount: 6000 }, // Median U.S. utilities ($500/month)
        { id: uuidv4(), name: '🚙 Transportation', amount: 5676 }, // Median U.S. car lease payment ($473/month)
        { id: uuidv4(), name: '🛍️ Shopping', amount: 3000 }, // 
        { id: uuidv4(), name: '🎁 Gifts', amount: 2000 }, // 
        { id: uuidv4(), name: '🏝️ Vacation', amount: 5000 }, // 
        { id: uuidv4(), name: '🎓 Education', amount: 5500 }, // 
        { id: uuidv4(), name: '🏥 Healthcare', amount: 2000 }, // 
        { id: uuidv4(), name: '💪 Fitness', amount: 2000 }, // 
        { id: uuidv4(), name: '🎭 Entertainment', amount: 1200 }, // 
        { id: uuidv4(), name: '👵 Retirement', amount: 1200 }, // 
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
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text animate-slide-up">
            <a href="/" className="hover:opacity-80 transition-opacity">
              Cashkey
            </a>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up [animation-delay:100ms]">
            Visualize your annual cash flow
          </p>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/5 text-primary/80 text-xs font-medium mt-2 animate-fade-in">
            <span className="mr-1">💸</span> All changes auto-save to URL
          </div>
        </header>
        
        {/* Main content */}
        <div className="animate-fade-in [animation-delay:200ms]">
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
                Share Cash Flow
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
