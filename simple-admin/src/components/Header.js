import React from 'react';

const Header = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '20px',
        background: 'white',
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 10px 50px",
      }}>
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#4CAF50',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}>
        Ж
      </div>
    </div>
  );
};

export default Header;
