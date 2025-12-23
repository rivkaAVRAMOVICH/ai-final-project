
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { useState, useEffect, useRef } from "react";
import { sendRolePlayMessage, getRolePlayFeedback } from "../services/studyApi";
import "../styles/rolePlayPage.css";
import dingSound from "../assets/ding.mp3";
import ReactMarkdown from "react-markdown";

export default function RolePlayPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { session } = location.state || {};

    const storageKey = `rolePlay_${session?.id}`; 

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : (session?.messages || [{ role: "A", text: "Hello! Let's start our role play." }]);
    });

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [feedbackLoading, setFeedbackLoading] = useState(false);

    const messagesEndRef = useRef(null);

    // שמירת ההודעות בכל שינוי
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(messages));
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setTyping(true);

        try {
            const userMessage = { role: "B", text: input };
            setMessages((prev) => [...prev, userMessage]);
            setInput("");

            const reply = await sendRolePlayMessage(session.id, userMessage.text);

            if (reply.role === "A") {
                const audio = new Audio(dingSound);
                audio.play();
            }

            setMessages((prev) => [...prev, reply]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setTyping(false);
        }
    };

    const handleBackHome = () => {
        localStorage.removeItem(storageKey);
        navigate("/");
    };

    const handleGetFeedback = async () => {
        if (!session?.id) return;
        setFeedbackLoading(true);
        try {
            const data = await getRolePlayFeedback(session.id);
            setFeedback(data);
        } catch (err) {
            console.error("Error fetching feedback:", err);
            setFeedback({ error: "Failed to get feedback" });
        } finally {
            setFeedbackLoading(false);
        }
    };

    const handleClearConversation = () => {
        setMessages([]);
        setFeedbackLoading(false);
        localStorage.removeItem(storageKey);
    };

    const getRoleName = (role) => {
        if (!session?.roles) return role;
        return role === "A" ? session.roles.A : session.roles.B;
    };

    return (
        <Card>
            <h1 className="quiz-title">Role Play Game</h1>
            <h3 className="quiz-subtitle">Type your message and press Send to interact</h3>

            <div className="chat-box">
                {messages.map((m, idx) => (
                    <div
                        key={idx}
                        className={`chat-message ${m.role === "A" ? "role-a" : "role-b"}`}
                    >
                        <strong className="chat-role">{getRoleName(m.role)}:</strong>{" "}
                        <div className="chat-text">
                            <ReactMarkdown>{m.text}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {typing && (
                    <div className="chat-message role-a typing">
                        <strong className="chat-role">{getRoleName("A")}:</strong>{" "}
                        <span className="chat-text">Typing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-user-label">
                <strong>{session?.roles?.B || "You"}:</strong>
            </div>

            <div className="chat-input-row">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    disabled={loading}
                    placeholder="Type your message..."
                    className="chat-input"
                />
                <Button onClick={handleSend} disabled={loading || !input.trim()}>
                    Send
                </Button>
            </div>

            <div className="chat-footer">
                <button onClick={handleBackHome} className="back-btn">➡️</button>
                <Button onClick={handleGetFeedback} disabled={feedbackLoading}>
                    {feedbackLoading ? "Loading Feedback..." : "Get Feedback"}
                </Button>
                <Button onClick={handleClearConversation}>clear conversation</Button>
            </div>

            {feedback && (
                <div className="feedback-box">
                    <h3>Feedback</h3>
                    {feedback.error ? (
                        <p>{feedback.error}</p>
                    ) : (
                        <>
                            <p><strong>Understanding:</strong> {feedback.understanding}</p>
                            <p><strong>Comments:</strong> {feedback.comments}</p>
                        </>
                    )}
                </div>
            )}
        </Card>
    );
}
