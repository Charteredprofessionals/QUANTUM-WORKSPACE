import { useState, useEffect, useRef } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import Editor from '@monaco-editor/react'
import {
  Code,
  Terminal as TerminalIcon,
  FolderTree,
  MessageSquare,
  Zap,
  Settings,
  Play,
  GitBranch,
  Layout,
  Sparkles
} from 'lucide-react'

type Mode = 'developer' | 'simple'
type View = 'editor' | 'terminal' | 'files' | 'chat' | 'deploy'

export default function App() {
  const [mode, setMode] = useState<Mode>('simple')
  const [activeView, setActiveView] = useState<View>('editor')
  const [code, setCode] = useState('// Welcome to Quantum Workspace\n// Start coding or use Simple Mode to create a project\n\nfunction hello() {\n  console.log("Hello, World!");\n}\n')

  // Quick actions for Simple Mode
  const goals = [
    { id: 'website', name: '🌐 Website', desc: 'Create a website' },
    { id: 'blog', name: '📝 Blog', desc: 'Start a blog' },
    { id: 'app', name: '📱 App', desc: 'Build an app' },
    { id: 'api', name: '🔌 API', desc: 'Create an API' },
  ]

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div style={{ marginBottom: 16 }}>
          <Zap size={24} color="#58a6ff" />
        </div>
        
        <button
          className="btn-icon"
          onClick={() => setMode(mode === 'simple' ? 'developer' : 'simple')}
          title="Toggle Mode"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
        >
          {mode === 'simple' ? <Code size={20} color="#8b949e" /> : <Sparkles size={20} color="#8b949e" />}
        </button>
        
        <button
          className="btn-icon"
          onClick={() => setActiveView('editor')}
          title="Editor"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
        >
          <Code size={20} color={activeView === 'editor' ? '#58a6ff' : '#8b949e'} />
        </button>
        
        <button
          className="btn-icon"
          onClick={() => setActiveView('terminal')}
          title="Terminal"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
        >
          <TerminalIcon size={20} color={activeView === 'terminal' ? '#58a6ff' : '#8b949e'} />
        </button>
        
        <button
          className="btn-icon"
          onClick={() => setActiveView('files')}
          title="Files"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
        >
          <FolderTree size={20} color={activeView === 'files' ? '#58a6ff' : '#8b949e'} />
        </button>
        
        <button
          className="btn-icon"
          onClick={() => setActiveView('chat')}
          title="AI Chat"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
        >
          <MessageSquare size={20} color={activeView === 'chat' ? '#58a6ff' : '#8b949e'} />
        </button>
        
        <div style={{ marginTop: 'auto' }}>
          <button
            className="btn-icon"
            title="Settings"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
          >
            <Settings size={20} color="#8b949e" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <span style={{ fontWeight: 600, fontSize: 14 }}>
            Quantum Workspace
          </span>
          <span style={{ 
            marginLeft: 12, 
            padding: '2px 8px', 
            borderRadius: 4, 
            fontSize: 11,
            background: mode === 'simple' ? '#238636' : '#30363d',
            color: '#fff'
          }}>
            {mode === 'simple' ? 'Simple Mode' : 'Developer Mode'}
          </span>
          
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }}>
              <GitBranch size={14} style={{ marginRight: 4 }} />
              Git
            </button>
            <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: 12 }}>
              <Play size={14} style={{ marginRight: 4 }} />
              Run
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="workspace">
          {mode === 'simple' ? (
            /* Simple Mode UI */
            <div className="simple-mode">
              <h1 style={{ fontSize: 28, marginBottom: 8, color: '#58a6ff' }}>
                👋 Welcome to Quantum Workspace
              </h1>
              <p style={{ color: '#8b949e', marginBottom: 32 }}>
                Tell me what you want to build
              </p>

              <h3 style={{ marginBottom: 16 }}>🎯 What would you like to create?</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
                {goals.map(goal => (
                  <div key={goal.id} className="goal-card" onClick={() => setMode('developer')}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{goal.name.split(' ')[0]}</div>
                    <div style={{ fontWeight: 600 }}>{goal.name.split(' ')[1]}</div>
                    <div style={{ fontSize: 12, color: '#8b949e', marginTop: 4 }}>{goal.desc}</div>
                  </div>
                ))}
              </div>

              <h3 style={{ marginBottom: 16 }}>💬 Describe your idea</h3>
              <textarea
                style={{ width: '100%', height: 100, resize: 'none' }}
                placeholder="e.g., A website to showcase my photography portfolio"
              />
              
              <button className="btn btn-primary" style={{ marginTop: 16, width: '100%' }}>
                🚀 Build My Project
              </button>
            </div>
          ) : (
            /* Developer Mode UI */
            <>
              {activeView === 'editor' && (
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16 }
                  }}
                />
              )}
              
              {activeView === 'terminal' && (
                <div className="terminal-container">
                  <div style={{ padding: 16, color: '#8b949e' }}>
                    <pre style={{ fontFamily: 'monospace', fontSize: 13 }}>
{`🤖 Quantum Terminal
Type a command or ask for help...

$ `}<span style={{ animation: 'blink 1s infinite' }}>_</span>
                    </pre>
                  </div>
                </div>
              )}
              
              {activeView === 'files' && (
                <div style={{ width: 250, padding: 8 }}>
                  <div className="file-tree">
                    <div className="file-item">
                      <FolderTree size={14} style={{ marginRight: 8 }} />
                      src
                    </div>
                    <div className="file-item" style={{ paddingLeft: 24 }}>
                      <Code size={14} style={{ marginRight: 8 }} />
                      main.js
                    </div>
                    <div className="file-item" style={{ paddingLeft: 24 }}>
                      <Code size={14} style={{ marginRight: 8 }} />
                      App.jsx
                    </div>
                    <div className="file-item" style={{ marginTop: 8 }}>
                      <Layout size={14} style={{ marginRight: 8 }} />
                      package.json
                    </div>
                  </div>
                </div>
              )}
              
              {activeView === 'chat' && (
                <div style={{ width: 300, padding: 16, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ marginBottom: 16 }}>💬 AI Assistant</h3>
                  <div style={{ flex: 1, background: '#161b22', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                    <p style={{ color: '#8b949e', fontSize: 13 }}>
                      Ask me anything about your code...
                    </p>
                  </div>
                  <input placeholder="Ask a question..." />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}