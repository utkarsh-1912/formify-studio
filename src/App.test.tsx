import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock next/navigation router to prevent test environment crash
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      prefetch: () => null
    };
  }
}));

test("renders Formify Studio header brand", () => {
  render(<App />);
  const brandElement = screen.getByText(/Formify Studio/i);
  expect(brandElement).toBeInTheDocument();
});
