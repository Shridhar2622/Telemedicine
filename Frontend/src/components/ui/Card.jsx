import React from 'react';

const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`
      bg-white rounded-2xl p-6 shadow-sm border border-slate-100 
      relative overflow-hidden
      ${className}
    `}>
      {/* Subtle shine effect on top border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
      
      {title && <h3 className="text-xl font-bold text-slate-800 mb-5 relative z-10">{title}</h3>}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;
