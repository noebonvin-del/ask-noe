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
      setMessages((prev) => [...prev, { role: "ai", content: "⚠️ Error de conexión.", time: getTime() }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };return (
    <>
      <Head>
        <title>Ask Noe — NexusDMC</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>
      <div style={{display:"flex",flexDirection:"column",height:"100dvh",background:"#0f1117",color:"#e8eaf6",fontFamily:"'DM Sans',system-ui,sans-serif",overflow:"hidden"}}>
        <div style={{background:"#1a1d27",borderBottom:"1px solid #2a2f47",padding:"12px 20px",display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#4f6ef7,#9b6ef7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"white",flexShrink:0,position:"relative"}}>
            N
            <div style={{position:"absolute",bottom:2,right:2,width:10,height:10,background:"#4ade80",borderRadius:"50%",border:"2px solid #1a1d27"}}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:600}}>Noe — NexusDMC</div>
            <div style={{fontSize:11,color:"#4ade80",marginTop:1}}>● En línea</div>
          </div>
          <div style={{fontSize:10,background:"linear-gradient(135deg,#4f6ef7,#9b6ef7)",color:"white",padding:"3px 10px",borderRadius:20,fontWeight:500}}>AI Assistant</div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"20px 16px",display:"flex",flexDirection:"column",gap:10}}>
          {messages.length===0&&(
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,textAlign:"center",padding:"40px 20px",minHeight:"60%"}}>
              <div style={{width:64,height:64,background:"linear-gradient(135deg,#4f6ef7,#9b6ef7)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>👋</div>
              <div style={{fontSize:20,fontWeight:600}}>Hola, soy Noe</div>
              <div style={{fontSize:13,color:"#7b82a8",lineHeight:1.6,maxWidth:280}}>Preguntame lo que necesites. Respondo como respondería Noe — en español o inglés.</div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8,width:"100%",maxWidth:340}}>
                {SUGGESTIONS.map((s)=>(<button key={s} onClick={()=>handleSend(s)} style={{background:"#1e2235",border:"1px solid #2a2f47",borderRadius:12,padding:"10px 14px",fontSize:13,color:"#e8eaf6",cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>{s}</button>))}
              </div>
            </div>
          )}
          {messages.map((m,i)=>(
            <div key={i} style={{display:"flex",gap:8,maxWidth:"82%",alignSelf:m.role==="user"?"flex-end":"flex-start",flexDirection:m.role==="user"?"row-reverse":"row"}}>
              {m.role==="ai"&&(<div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#4f6ef7,#9b6ef7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white",flexShrink:0,alignSelf:"flex-end"}}>N</div>)}
              <div>
                <div style={{padding:"10px 14px",borderRadius:16,fontSize:14,lineHeight:1.6,background:m.role==="user"?"#2d3a6b":"#1e2235",border:m.role==="ai"?"1px solid #2a2f47":"none",borderBottomRightRadius:m.role==="user"?4:16,borderBottomLeftRadius:m.role==="ai"?4:16,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{m.content}</div>
                <div style={{fontSize:10,color:"#7b82a8",marginTop:4,textAlign:m.role==="user"?"right":"left"}}>{m.time}</div>
              </div>
            </div>
          ))}
          {loading&&(
            <div style={{display:"flex",gap:8,alignSelf:"flex-start"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#4f6ef7,#9b6ef7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white",flexShrink:0,alignSelf:"flex-end"}}>N</div>
              <div style={{background:"#1e2235",border:"1px solid #2a2f47",borderRadius:16,borderBottomLeftRadius:4,padding:"12px 16px",display:"flex",gap:5,alignItems:"center"}}>
                {[0,1,2].map((i)=>(<div key={i} style={{width:7,height:7,background:"#7c9bff",borderRadius:"50%",animation:`bounce 1.2s ${i*0.2}s infinite ease-in-out`}}/>))}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
        <div style={{background:"#1a1d27",borderTop:"1px solid #2a2f47",padding:"12px 16px",display:"flex",gap:10,alignItems:"flex-end",flexShrink:0}}>
          <div style={{flex:1,background:"#222638",border:"1px solid #2a2f47",borderRadius:24,padding:"8px 16px",display:"flex",alignItems:"flex-end"}}>
            <textarea value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={handleKey} placeholder="Escribí tu consulta…" rows={1} style={{flex:1,background:"transparent",border:"none",outline:"none",resize:"none",color:"#e8eaf6",fontFamily:"inherit",fontSize:14,lineHeight:1.5,maxHeight:120,overflowY:"auto"}}/>
          </div>
          <button onClick={()=>handleSend()} disabled={loading||!input.trim()} style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#4f6ef7,#9b6ef7)",border:"none",cursor:loading||!input.trim()?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,opacity:loading||!input.trim()?0.4:1}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;}body{overflow:hidden;}@keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:0.5;}30%{transform:translateY(-5px);opacity:1;}}textarea::placeholder{color:#7b82a8;}`}</style>
    </>
  );
}
