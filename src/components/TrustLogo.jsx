import React from 'react';
import { Shield, Infinity } from 'lucide-react';

const TrustLogo = ({ size = 24, color = "currentColor", className = "" }) => {
  return (
    <div 
      className={`trust-logo ${className}`} 
      style={{ 
        position: 'relative', 
        width: size, 
        height: size, 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      <Shield 
        size={size} 
        color={color} 
        strokeWidth={1.5} 
        style={{ position: 'absolute' }} 
      />
      <div style={{ position: 'absolute', transform: 'translateY(-10%)' }}>
        <Infinity 
          size={size * 0.6} 
          color={color} 
          strokeWidth={2} 
        />
      </div>
    </div>
  );
};

export default TrustLogo;
