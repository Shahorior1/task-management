import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-3 bg-white border-t border-gray-200 text-center text-sm text-gray-600">
      <p>© {currentYear} Shahorior. All rights reserved.</p>
    </footer>
  );
} 