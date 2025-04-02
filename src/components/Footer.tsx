import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      Money is like water: it flows in and out of our lives. 
      <br />
      We can direct the flow toward our highest commitments to nourish ourselves and our world.
      &mdash;&nbsp;Lynne&nbsp;Twist, {' '}
      <a 
        href="https://bookshop.org/p/books/the-soul-of-money-transforming-your-relationship-with-money-and-life-lynne-twist/11183499" 
        target="_blank" 
        rel="noopener noreferrer"
        className="footer-link"
      >The Soul of Money</a>
      <br /><br />
      Cashkey visualizes cash flow in a {' '}
      <a 
        href="https://en.wikipedia.org/wiki/Sankey_diagram" 
        target="_blank" 
        rel="noopener noreferrer"
        className="footer-link"
      >
        Sankey diagram
      </a>
      .
      <br />
      It stores your data in the URL, not in a database.
      <br />
      Cashkey is an experiment started in{' '}
      <a 
        href="https://lovable.dev" 
        target="_blank" 
        rel="noopener noreferrer"
        className="footer-link"
      >
        Lovable
      </a>
      {' '} by {' '}
      <a 
        href="https://ginatrapani.org" 
        target="_blank" 
        rel="noopener noreferrer"
        className="footer-link"
      >
        Gina Trapani
      </a>
      .
    </footer>
  );
};

export default Footer; 