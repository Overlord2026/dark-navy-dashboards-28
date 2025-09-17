import React, { useState } from 'react';

// Simple test component to verify React imports work
export default function ReactTest() {
  const [test, setTest] = useState('React works!');
  
  return <div>ReactTest: {test}</div>;
}