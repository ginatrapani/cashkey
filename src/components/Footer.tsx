import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      width: '100%',
      padding: '20px',
      textAlign: 'center',
      fontSize: '0.75rem', // 12px
      color: '#666',
      marginTop: 'auto'
    }}>
      Cashkey visualizes annual cash flow in a {' '}
      <a 
        href="https://en.wikipedia.org/wiki/Sankey_diagram" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          color: '#666',
          textDecoration: 'underline'
        }}
      >
        Sankey diagram
      </a>
      .<br />
      It does not use a database, it persists all data in the URL.{' '}
      <br />An experiment with{' '}
      <a 
        href="https://lovable.dev" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          color: '#666',
          textDecoration: 'underline'
        }}
      >
        Lovable
      </a>
      {' '} by {' '}
      <a 
        href="https://ginatrapani.org" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          color: '#666',
          textDecoration: 'underline'
        }}
      >
        Gina Trapani
      </a>
      .
    </footer>
  );
};

export default Footer; 