import { useNavigate, useLocation } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import { sendRolePlayMessage } from "../services/studyApi";

export default function RolePlayPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { session } = location.state || {};

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    // בהתחלה מציגים את ההודעה הראשונה של Gemini (role A) אם קיימת
    useEffect(() => {
        if (session?.messages && session.messages.length > 0) {
            setMessages(session.messages);
        } else if (session) {
            // אפשרות: אם אין הודעות, נתחיל עם ברכה של Gemini
            setMessages([{ role: "A", text: "Hello! Let's start our role play." }]);
        }
    }, [session]);

    const handleSend = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const reply = await sendRolePlayMessage(session.id, input);
            setMessages((prev) => [
                ...prev,
                { role: "B", text: input }, // המשתמש
                reply // Gemini
            ]);
            setInput("");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // פונקציה להמרת role ל־name
    const getRoleName = (role) => {
        if (!session?.roles) return role;
        return role === "A" ? session.roles.A : session.roles.B;
    };

    // צבעים שונים לכל תפקיד
    const getRoleColor = (role) => {
        return role === "A" ? "#6c5ce7" : "#00b894"; // סגול ל-Gemini, ירוק למשתמש
    };

    return (
        <Card>
            <h1>Role Play Game</h1>

            <div style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "12px" }}>
                {messages.map((m, idx) => (
                    <div
                        key={idx}
                        style={{
                            marginBottom: "8px",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            backgroundColor: `${getRoleColor(m.role)}20`, // רקע בהיר לפי התפקיד
                        }}
                    >
                        <strong style={{ color: getRoleColor(m.role) }}>{getRoleName(m.role)}:</strong>{" "}
                        {m.text}
                    </div>
                ))}
            </div>

            <div style={{ marginBottom: "8px" }}>
                <strong>{session?.roles?.B || "You"}:</strong>
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Type your message..."
                style={{ width: "80%", marginRight: "8px", padding: "6px" }}
            />
            <Button onClick={handleSend} disabled={loading || !input.trim()}>
                Send
            </Button>

            <div style={{ marginTop: "16px" }}>
                <Button onClick={() => navigate("/")}>Back to Home</Button>
            </div>
        </Card>
    );
}
