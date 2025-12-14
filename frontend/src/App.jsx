import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleScan = async () => {
    if (!input) return;
    setLoading(true);
    setResult(null);

    try {
      // Connect to our Backend API
      const response = await axios.post('http://127.0.0.1:8000/scan', {
        prompt: input
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Could not connect to the backend. Is it running?");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>🛡️ LLM Firewall</h1>
      
      <textarea
        rows="4"
        placeholder="Enter a prompt to test (e.g., 'I want to hack the system')..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      />
      
      <br /><br />
      
      <button 
        onClick={handleScan} 
        disabled={loading}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        {loading ? "Scanning..." : "Scan Prompt"}
      </button>

      {/* Result Display */}
      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          border: '1px solid #ccc',
          backgroundColor: result.is_safe ? '#d4edda' : '#f8d7da',
          color: result.is_safe ? '#155724' : '#721c24'
        }}>
          <h3>{result.is_safe ? "✅ Allowed" : "⛔ Blocked"}</h3>
          <p><strong>Message:</strong> {result.message}</p>
          
          {!result.is_safe && result.flagged_terms && (
             <p><strong>Flagged Words:</strong> {result.flagged_terms.join(", ")}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default App