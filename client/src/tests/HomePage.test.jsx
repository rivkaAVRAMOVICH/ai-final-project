import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import * as api from "../services/studyApi";

// --- Mock navigate ---
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// --- Mock child components ---
jest.mock("../components/Card", () => ({ children }) => <div>{children}</div>);
jest.mock("../components/Textarea", () => ({ value, onChange }) => (
  <textarea value={value} onChange={(e) => onChange(e.target.value)} />
));
jest.mock("../components/Button", () => ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
));
jest.mock("../components/Loader", () => () => <div>Loading...</div>);

// --- Mock the API module completely ---
jest.mock("../services/studyApi", () => ({
  analyzeQuiz: jest.fn(),
  startRolePlay: jest.fn(),
}));

describe("HomePage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders title, subtitle, and textarea when no saved text", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Study Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/Learn smarter/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("displays saved text from localStorage", () => {
    localStorage.setItem("studyText", "Saved Text");
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Saved Text")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  test("handleClearText clears text and localStorage", () => {
    localStorage.setItem("studyText", "Saved Text");
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("❌"));
    expect(localStorage.getItem("studyText")).toBeNull();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("shows error if quiz button clicked with empty text", async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Multiple Choice"));
    expect(await screen.findByText("Enter your text first")).toBeInTheDocument();
  });

  test("calls analyzeQuiz and navigates on Multiple Choice", async () => {
    api.analyzeQuiz.mockResolvedValue({ questions: [] });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Test" } });
    fireEvent.click(screen.getByText("Multiple Choice"));

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(api.analyzeQuiz).toHaveBeenCalledWith("Test", "multiple-choice");
      expect(mockedNavigate).toHaveBeenCalledWith("/quiz", { state: { quizData: { questions: [] } } });
    });
  });

  test("shows error on failed API call", async () => {
    api.analyzeQuiz.mockRejectedValue(new Error("API Error"));

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Test" } });
    fireEvent.click(screen.getByText("Multiple Choice"));

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Failed to analyze quiz. Please try again.")).toBeInTheDocument();
    });
  });

  test("calls startRolePlay and navigates", async () => {
    api.startRolePlay.mockResolvedValue({ sessionId: 123 });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Roleplay text" } });
    fireEvent.click(screen.getByText("Role Play Game"));

    await waitFor(() => {
      expect(api.startRolePlay).toHaveBeenCalledWith("Roleplay text");
      expect(mockedNavigate).toHaveBeenCalledWith("/role-play", { state: { session: { sessionId: 123 } } });
    });
  });
});
