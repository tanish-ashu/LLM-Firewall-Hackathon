import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // --- STATE MANAGEMENT ---
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', type: 'intro', content: "System Online. LLM Firewall active. Enter a prompt to begin security analysis." }
  ]);
  const [loading, setLoading] = useState(false);
  
  // Visual Candy States (Dummy Data for Hackathon)
  const [logs, setLogs] = useState([]);
  const [latency, setLatency] = useState(0);
  const [threatScore, setThreatScore] = useState(0);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // --- HELPER FUNCTIONS ---

  // Adds a dummy log line to the sidebar
  const addLog = (text) => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    setLogs(prev => [`[${timestamp}] ${text}`, ...prev.slice(0, 15)]);
  };

  // --- CORE LOGIC ---
  const handleScan = async () => {
    if (!input.trim()) return;

    // 1. Add User Message to Chat
    const userMsg = { role: 'user', content: input };
    setChatHistory(prev => [...prev, userMsg]);
    setLoading(true);
    setInput("");

    // Visuals: Start simulation
    addLog(`POST /scan payload_size=${input.length}b`);
    addLog("Initiating Layer 1 Keyword Scan...");
    
    const startTime = Date.now();

    try {
      // 2. REAL BACKEND CONNECTION
      const response = await axios.post('http://127.0.0.1:8000/scan', {
        prompt: userMsg.content
      });

      const result = response.data;
      const endTime = Date.now();
      setLatency(endTime - startTime);

      // Visuals: Updates based on result
      if (result.is_safe) {
        addLog("✅ Scan Clear. Forwarding to Gemini API...");
        addLog("Receiving LLM Token Stream...");
        setThreatScore(Math.floor(Math.random() * 10)); // Low random score
        
        setChatHistory(prev => [...prev, {
          role: 'bot',
          type: 'safe',
          content: result.message
        }]);
      } else {
        addLog(`⛔ THREAT DETECTED: [${result.flagged_terms.join(', ')}]`);
        addLog("Action: BLOCK connection. Logging incident.");
        setThreatScore(85 + Math.floor(Math.random() * 15)); // High random score

        setChatHistory(prev => [...prev, {
          role: 'bot',
          type: 'blocked',
          content: result.message,
          flagged: result.flagged_terms
        }]);
      }

    } catch (error) {
      console.error(error);
      addLog("❌ ERROR: Backend Connection Failed");
      setChatHistory(prev => [...prev, {
        role: 'bot',
        type: 'error',
        content: "Error: Could not connect to Firewall Server. Ensure backend is running."
      }]);
    }

    setLoading(false);
  };

  // Allow sending with Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleScan();
    }
  };

  return (
    <div className="dashboard-container">
      
      {/* --- LEFT PANEL: MAIN INTERFACE --- */}
      <div className="chat-section">
        <div className="header">
          <h1>
            🛡️ LLM Firewall <span className="badge">v1.0.4 (Neura-Fence)</span>
          </h1>
          <div style={{color: '#94a3b8', fontSize: '0.9rem'}}>
            Real-time Prompt Injection & Content Filtering
          </div>
        </div>

        <div className="chat-window">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`message ${msg.role} ${msg.type === 'blocked' ? 'blocked' : ''}`}>
              
              {msg.type === 'blocked' ? (
                <>
                  <div style={{fontWeight: 'bold', display:'flex', alignItems:'center', gap:'5px', marginBottom:'5px'}}>
                     ⛔ SECURITY ALERT: REQUEST BLOCKED
                  </div>
                  <div>{msg.content}</div>
                  {msg.flagged && (
                    <div style={{marginTop: '10px', fontSize: '0.8rem', opacity: 0.8}}>
                      <strong>Detected Signatures:</strong> {msg.flagged.join(', ')}
                    </div>
                  )}
                </>
              ) : (
                msg.content
              )}
            </div>
          ))}
          
          {loading && (
            <div className="message bot">
              <span className="dot" style={{display:'inline-block', marginRight:'5px'}}></span>
              Analyzing payload integrity...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="input-area">
          <textarea
            rows="1" // auto-grows via CSS usually, but kept simple here
            placeholder="Enter prompt for security analysis..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleScan} disabled={loading}>
            {loading ? "SCANNING" : "SEND"}
          </button>
        </div>
      </div>

      {/* --- RIGHT PANEL: LIVE TELEMETRY (VISUALS) --- */}
      <div className="telemetry-section">
        
        {/* Status Card */}
        <div className="panel-card">
          <div className="panel-title">System Status</div>
          <div className="status-indicator">
            <span className="dot"></span>
            ENGINE ACTIVE • PROTECTED
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-val" style={{color: latency > 1000 ? '#ef4444' : '#3b82f6'}}>
              {loading ? "..." : `${latency}ms`}
            </div>
            <div className="stat-label">LATENCY</div>
          </div>
          <div className="stat-box">
            <div className="stat-val" style={{color: threatScore > 50 ? '#ef4444' : '#10b981'}}>
              {threatScore}%
            </div>
            <div className="stat-label">THREAT LEVEL</div>
          </div>
        </div>

        {/* Live Logs - The Matrix Effect */}
        <div className="panel-card" style={{flex: 1, display:'flex', flexDirection:'column'}}>
          <div className="panel-title">
            <span>Live Security Logs</span>
            <span>FILTER: ALL</span>
          </div>
          <div className="live-logs">
            {logs.length === 0 && <div style={{opacity:0.5}}>Waiting for traffic...</div>}
            {logs.map((log, i) => (
              <div key={i} className="log-entry">{log}</div>
            ))}
          </div>
        </div>

        {/* Tech Stack Info */}
        <div style={{fontSize: '0.7rem', color: '#475569', textAlign: 'center'}}>
          Powered by Gemini 1.5 Flash & FastAPI
        </div>

      </div>
    </div>
  );
}

export default App;