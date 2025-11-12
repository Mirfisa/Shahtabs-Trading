import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  const element = screen.getByAltText("Shahab's Trading Logo");
  expect(element).toBeInTheDocument();
});
