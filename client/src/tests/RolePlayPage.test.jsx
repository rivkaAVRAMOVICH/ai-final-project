import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RolePlayPage from "../pages/RolePlayPage";
import * as api from "../services/studyApi";

// Mock child components
jest.mock("../components/Card", () => ({ children }) => <div>{children}</div>);
jest.mock("../components/Button", () => ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
));

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
    const originalModule = jest.requireActual("react-router-dom");
    return {
        ...originalModule,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ state: { session: { id: 1, roles: { A: "AI", B: "User" }, messages: [] } } }),
    };
});

// Mock audio
window.HTMLMediaElement.prototype.play = jest.fn();



describe.skip("RolePlayPage Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    test("renders initial message", () => {
        render(
            <MemoryRouter>
                <RolePlayPage />
            </MemoryRouter>
        );

        expect(screen.getByText("Hello! Let's start our role play.")).toBeInTheDocument();
        expect(screen.getByText("User:")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
    });

    test("sending a message adds it to chat and calls API", async () => {
        api.sendRolePlayMessage = jest.fn().mockResolvedValue({ role: "A", text: "Reply from AI" });

        render(
            <MemoryRouter>
                <RolePlayPage />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText("Type your message...");
        fireEvent.change(input, { target: { value: "Hello AI" } });
        fireEvent.click(screen.getByText("Send"));

        expect(screen.getByDisplayValue("")).toBeInTheDocument(); // input cleared
        expect(screen.getByText("Typing...")).toBeInTheDocument();

        await waitFor(() => {
            expect(api.sendRolePlayMessage).toHaveBeenCalledWith(1, "Hello AI");
            expect(screen.getByText("Reply from AI")).toBeInTheDocument();
        });
    });

    test("back home button clears storage and navigates", () => {
        localStorage.setItem("rolePlay_1", JSON.stringify([{ role: "B", text: "Hi" }]));

        render(
            <MemoryRouter>
                <RolePlayPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("➡️"));
        expect(localStorage.getItem("rolePlay_1")).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    test("get feedback button calls API and displays feedback", async () => {
        api.getRolePlayFeedback = jest.fn().mockResolvedValue({ understanding: "Good", comments: "Keep practicing" });

        render(
            <MemoryRouter>
                <RolePlayPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Get Feedback"));

        await waitFor(() => {
            expect(api.getRolePlayFeedback).toHaveBeenCalledWith(1);
            expect(screen.getByText("Feedback")).toBeInTheDocument();
            expect(screen.getByText(/Good/)).toBeInTheDocument();
            expect(screen.getByText(/Keep practicing/)).toBeInTheDocument();
        });
    });

    test("clear conversation button empties messages and localStorage", () => {
        localStorage.setItem("rolePlay_1", JSON.stringify([{ role: "B", text: "Hi" }]));

        render(
            <MemoryRouter>
                <RolePlayPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("clear conversation"));

        expect(localStorage.getItem("rolePlay_1")).toBeNull();
        expect(screen.queryByText("Hello! Let's start our role play.")).not.toBeInTheDocument();
    });

    test("handles feedback API error gracefully", async () => {
        api.getRolePlayFeedback = jest.fn().mockRejectedValue(new Error("API Error"));

        render(
            <MemoryRouter>
                <RolePlayPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Get Feedback"));

        await waitFor(() => {
            expect(screen.getByText("Failed to get feedback")).toBeInTheDocument();
        });
    });
});