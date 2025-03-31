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
      Cashkey visualizes annual cash flow in a Sankey diagram. It does not save any data.{' '}
      An experiment with{' '}
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
      .
    </footer>
  );
};

export default Footer; 