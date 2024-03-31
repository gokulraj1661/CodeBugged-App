import React from 'react';

const CopyrightFooter = () => {
  return (
    <footer style={footerStyle}>
      <div style={contentStyle}>
        <p>&copy; {new Date().getFullYear()} Gokul Raj 20BCE2743</p>
      </div>
    </footer>
  );
};


const footerStyle = {
  backgroundColor: '#333',
  color: '#fff',
  textAlign: 'center',
  padding: '1rem',
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100%',
};

const contentStyle = {
  maxWidth: '960px',
  margin: '0 auto',
};

export default CopyrightFooter;
