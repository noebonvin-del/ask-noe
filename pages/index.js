import { useState, useRef, useEffect } from "react";
import Head from "next/head";

const SUGGESTIONS = [
  "💳 Tenemos que pagar un proveedor, ¿transferencia o tarjeta de crédito?",
  "🏷️ Una agencia pide descuento fuera de rango. ¿Lo apruebo?",
  "🆘 Hay un problema operativo con un pasajero ahora mismo",
];

function getTime() {
  return new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export default function AskNoe() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textOverride) => {
    const text = (textOverride || input).trim();
    if (!text || loading) return;
    setInput("");
    const userMsg = { role: "user", content: text, time: getTime() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);
    const apiMessages = newMessages.map((m) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.content,
    }));
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.reply, time: getTime() }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: "⚠️ Error de conexión. Intentá de nuevo.", time: getTime() }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      <Head>
        <title>Ask Noe — NexusDMC</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#0f1117", color: "#e8eaf6", fontFamily: "'DM Sans', system-ui, sans-serif", overflow: "hidden" }}>
        <div style={{ background: "#1a1d27", borderBottom: "1px solid #2a2f47", padding: "12px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #4f6ef7, #9b6ef7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "white", flexShrink: 0, position: "relative" }}>
            N
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 10, height: 10, background: "#4ade80", borderRadius: "50%", border: "2px solid #1a1d27" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Noe — NexusDMC</div>
            <div style={{ fontSize: 11, color: "#4ade80", marginTop: 1 }}>● En línea</div>
          </div>
          <div style={{ fontSize: 10, background: "linear-gradient(135deg, #4f6ef7, #9b6ef7)", color: "white", padding: "3px 10px", borderRadius: 20, fontWeight: 500, letterSpacing: "0.04em" }}>AI Assistant</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.length === 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems
