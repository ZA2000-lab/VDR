import { useState, useRef } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_FOLDERS = [
  { id: "f1", name: "01 - Financials", color: "#C9A84C", files: [
    { id: "d1", name: "2024 Audited Financials.pdf", size: "4.2 MB", uploaded: "2025-01-15", type: "pdf", views: 12 },
    { id: "d2", name: "Q3 2024 Management Accounts.xlsx", size: "1.8 MB", uploaded: "2025-01-20", type: "xlsx", views: 8 },
  ], subfolders: [
    { id: "sf1", name: "Historical", files: [
      { id: "d3", name: "Five Year Projections.xlsx", size: "2.1 MB", uploaded: "2025-01-20", type: "xlsx", views: 5 },
      { id: "d11", name: "2022 Audited Financials.pdf", size: "3.9 MB", uploaded: "2024-11-10", type: "pdf", views: 2 },
    ]},
    { id: "sf2", name: "Tax Documents", files: [
      { id: "d12", name: "2024 Tax Return.pdf", size: "1.2 MB", uploaded: "2025-01-05", type: "pdf", views: 1 },
    ]},
  ]},
  { id: "f2", name: "02 - Legal", color: "#7B8FA1", files: [
    { id: "d4", name: "Articles of Incorporation.pdf", size: "890 KB", uploaded: "2025-01-10", type: "pdf", views: 3 },
    { id: "d5", name: "Cap Table.xlsx", size: "650 KB", uploaded: "2025-01-10", type: "xlsx", views: 7 },
    { id: "d6", name: "Shareholder Agreement.pdf", size: "3.4 MB", uploaded: "2025-01-12", type: "pdf", views: 4 },
  ], subfolders: [
    { id: "sf3", name: "IP & Patents", files: [] },
  ]},
  { id: "f3", name: "03 - Operational", color: "#6B9E78", files: [
    { id: "d7", name: "Org Chart.pdf", size: "1.1 MB", uploaded: "2025-01-18", type: "pdf", views: 6 },
    { id: "d8", name: "Customer List.xlsx", size: "780 KB", uploaded: "2025-01-18", type: "xlsx", views: 2 },
  ], subfolders: [] },
  { id: "f4", name: "04 - Management", color: "#9B72CF", files: [
    { id: "d9", name: "CEO Bio.pdf", size: "520 KB", uploaded: "2025-01-22", type: "pdf", views: 9 },
    { id: "d10", name: "Management Presentation.pdf", size: "8.7 MB", uploaded: "2025-01-22", type: "pdf", views: 15 },
  ], subfolders: [] },
];

const INITIAL_USERS = [
  { id: "u1", name: "James Whitfield", email: "j.whitfield@capitalpartners.com", password: "capital123", access: ["f1","f2","f3","f4"], lastActive: "2 hours ago", status: "active", nda: true },
  { id: "u2", name: "Sarah Chen", email: "s.chen@mergerco.com", password: "merger123", access: ["f1","f4"], lastActive: "1 day ago", status: "active", nda: true },
  { id: "u3", name: "Marcus Okafor", email: "m.okafor@legaladv.com", password: "legal123", access: ["f2","f3"], lastActive: "3 days ago", status: "active", nda: false },
];

const ADMIN_CREDS = { email: "admin@vaultroom.com", password: "admin123" };

const INITIAL_LOG = [
  { id: "a1", user: "James Whitfield", action: "Downloaded", target: "Q3 2024 Management Accounts.xlsx", time: "2 hours ago", folder: "01 - Financials" },
  { id: "a2", user: "James Whitfield", action: "Viewed", target: "2024 Audited Financials.pdf", time: "2 hours ago", folder: "01 - Financials" },
  { id: "a3", user: "Sarah Chen", action: "Viewed", target: "Management Presentation.pdf", time: "1 day ago", folder: "04 - Management" },
  { id: "a4", user: "Marcus Okafor", action: "Viewed", target: "Articles of Incorporation.pdf", time: "3 days ago", folder: "02 - Legal" },
];

// ─── Theme ────────────────────────────────────────────────────────────────────

const THEMES = {
  dark: {
    bg:           "#0D0F14",
    bgAlt:        "#0B0D11",
    surface:      "#13151C",
    surfaceHover: "#1C1F29",
    border:       "#1E2028",
    borderStrong: "#2A2D35",
    text:         "#E8E8E8",
    textSub:      "#C8C8C8",
    textMuted:    "#888",
    textFaint:    "#555",
    textDim:      "#444",
    inputBg:      "#0D0F14",
    scrollThumb:  "#2A2D35",
    shadow:       "rgba(0,0,0,0.4)",
    statBg:       "#13151C",
  },
  light: {
    bg:           "#F0F2F7",
    bgAlt:        "#E8EAF0",
    surface:      "#FFFFFF",
    surfaceHover: "#F5F6FA",
    border:       "#E2E5EE",
    borderStrong: "#C8CCDA",
    text:         "#111318",
    textSub:      "#2A2D35",
    textMuted:    "#666",
    textFaint:    "#888",
    textDim:      "#AAA",
    inputBg:      "#F8F9FC",
    scrollThumb:  "#C8CCDA",
    shadow:       "rgba(0,0,0,0.15)",
    statBg:       "#FFFFFF",
  },
};

// Injects CSS variables onto :root and generates theme-aware class styles
const ThemeStyle = ({ mode }) => {
  const t = THEMES[mode];
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --bg: ${t.bg}; --bg-alt: ${t.bgAlt}; --surface: ${t.surface}; --surface-hover: ${t.surfaceHover};
        --border: ${t.border}; --border-strong: ${t.borderStrong};
        --text: ${t.text}; --text-sub: ${t.textSub}; --text-muted: ${t.textMuted};
        --text-faint: ${t.textFaint}; --text-dim: ${t.textDim};
        --input-bg: ${t.inputBg}; --scroll-thumb: ${t.scrollThumb}; --shadow: ${t.shadow};
        --stat-bg: ${t.statBg};
      }
      body { background: var(--bg); }
      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--scroll-thumb); border-radius: 2px; }
      input, select, button, textarea { outline: none; font-family: inherit; }
      @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
      @keyframes bounce  { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }

      /* Reusable classes */
      .folder-item { padding: 7px 10px; border-radius: 7px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.12s; font-size: 12px; color: var(--text-muted); }
      .folder-item:hover { background: var(--surface-hover); }
      .folder-item.active { background: var(--surface-hover); color: var(--text); }
      .file-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 52px; align-items: center; padding: 9px 14px; border-radius: 8px; gap: 10px; transition: background 0.12s; }
      .file-row:hover { background: var(--surface-hover); }
      .log-row { display: grid; grid-template-columns: 1.5fr 90px 2fr 100px; gap: 10px; padding: 9px 14px; align-items: center; border-radius: 6px; transition: background 0.12s; }
      .log-row:hover { background: var(--surface-hover); }
      .user-card { padding: 12px 14px; border-radius: 10px; border: 1px solid var(--border); cursor: pointer; transition: all 0.15s; margin-bottom: 8px; }
      .user-card:hover { border-color: var(--border-strong); background: var(--surface-hover); }
      .modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 200; backdrop-filter: blur(6px); }
      .modal-box { background: var(--surface); border: 1px solid var(--border-strong); border-radius: 14px; padding: 28px; width: 400px; animation: slideUp 0.2s ease; box-shadow: 0 20px 60px var(--shadow); }
      .inp { background: var(--input-bg); border: 1px solid var(--border-strong); border-radius: 8px; padding: 9px 12px; color: var(--text); font-size: 13px; font-family: inherit; width: 100%; transition: border 0.15s; }
      .inp:focus { border-color: #C9A84C88; }
      .btn-g { background: none; border: 1px solid var(--border-strong); cursor: pointer; border-radius: 6px; padding: 6px 12px; color: var(--text-muted); font-size: 12px; font-family: inherit; transition: all 0.15s; }
      .btn-g:hover { border-color: var(--text-dim); color: var(--text); background: var(--surface-hover); }
      .btn-p { background: #C9A84C; border: none; cursor: pointer; border-radius: 6px; padding: 8px 16px; color: #0D0F14; font-size: 13px; font-weight: 700; font-family: inherit; transition: all 0.15s; }
      .btn-p:hover { background: #D4B55E; }
      .btn-d { background: none; border: 1px solid #E8453C33; cursor: pointer; border-radius: 6px; padding: 5px 8px; color: #E8453C; font-size: 11px; font-family: inherit; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
      .btn-d:hover { background: #E8453C11; border-color: #E8453C66; }
      .drag-zone { border: 2px dashed var(--border-strong); border-radius: 10px; padding: 22px 16px; text-align: center; transition: all 0.2s; cursor: pointer; }
      .drag-zone:hover, .drag-zone.over { border-color: #C9A84C; background: #C9A84C08; }
      .toggle-track { width: 38px; height: 22px; border-radius: 11px; border: none; cursor: pointer; display: flex; align-items: center; padding: 0 3px; transition: all 0.2s; }
      .toggle-thumb { width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: all 0.2s; }
      .stat-card { background: var(--stat-bg); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px; }
      .pill { padding: 7px 14px; border-radius: 20px; border: 1px solid var(--border); cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.15s; display: flex; align-items: center; gap: 7px; background: none; font-family: inherit; color: var(--text-muted); }
      .pill:hover { border-color: var(--border-strong); background: var(--surface-hover); }
      .u-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; transition: all 0.15s; }
      .u-card:hover { border-color: var(--border-strong); background: var(--surface-hover); }
      .dl-btn { background: #3B82F6; border: none; cursor: pointer; border-radius: 6px; padding: 6px 12px; color: #fff; font-size: 11px; font-weight: 600; font-family: inherit; transition: all 0.15s; }
      .dl-btn:hover { background: #2563EB; }
      .view-btn { background: none; border: 1px solid var(--border-strong); cursor: pointer; border-radius: 6px; padding: 5px 10px; color: var(--text-muted); font-size: 11px; font-family: inherit; transition: all 0.15s; }
      .view-btn:hover { color: #3B82F6; border-color: #3B82F644; background: #3B82F610; }
      .nav-tab { background: none; border: none; cursor: pointer; padding: 7px 14px; font-family: inherit; font-size: 13px; font-weight: 500; border-radius: 6px; transition: all 0.15s; color: var(--text-faint); }
      .nav-tab.active { background: var(--surface-hover); color: var(--text); }
      .nav-tab:hover:not(.active) { color: var(--text-muted); }
    `}</style>
  );
};

// ─── Theme Toggle Button ──────────────────────────────────────────────────────

const ThemeToggle = ({ theme, setTheme }) => {
  const isDark = theme === "dark";
  return (
    <div onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", padding: "5px 10px", borderRadius: 20, border: "1px solid var(--border-strong)", background: "var(--surface-hover)", transition: "all 0.2s", userSelect: "none" }}>
      <span style={{ fontSize: 13 }}>{isDark ? "☀️" : "🌙"}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>{isDark ? "Light" : "Dark"}</span>
    </div>
  );
};

// ─── Shared Utilities ─────────────────────────────────────────────────────────

const formatBytes = (b) => b < 1024 ? b + " B" : b < 1048576 ? (b/1024).toFixed(1) + " KB" : (b/1048576).toFixed(1) + " MB";

const FileIcon = ({ type }) => {
  const cfg = { pdf: { fill: "#E8453C", d: "M9 13h6M9 16h4" }, xlsx: { fill: "#1A7F4B", d: "M9 11l2 3-2 3M15 11l-2 3 2 3" } }[type] || { fill: "#6B7280", d: "M9 13h6" };
  return (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20, flexShrink: 0 }}>
      <rect width="24" height="24" rx="4" fill={cfg.fill} opacity="0.12" />
      <path d="M6 4h8l4 4v12a1 1 0 01-1 1H7a1 1 0 01-1-1V5a1 1 0 011-1z" stroke={cfg.fill} strokeWidth="1.5" fill="none" />
      <path d="M14 4v4h4" stroke={cfg.fill} strokeWidth="1.5" />
      <path d={cfg.d} stroke={cfg.fill} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

const Avatar = ({ name, color = "#C9A84C", size = 32 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color + "22", border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 700, color, flexShrink: 0 }}>
    {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
  </div>
);

const Toast = ({ msg, type }) => (
  <div style={{ position: "fixed", bottom: 24, right: 24, padding: "11px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 9999, background: type === "error" ? "#E8453C" : type === "warning" ? "#C9A84C" : "#10B981", color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", animation: "slideUp 0.25s ease" }}>
    {msg}
  </div>
);

// ─── LOGIN ────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin, users, theme, setTheme }) {
  const [mode, setMode] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const accentColor = mode === "admin" ? "#C9A84C" : "#3B82F6";

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) { setError("Please enter your email and password."); return; }
    setError(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "admin") {
        if (email.trim() === ADMIN_CREDS.email && password === ADMIN_CREDS.password) onLogin({ role: "admin", name: "Admin", email: email.trim() });
        else setError("Invalid admin credentials.");
      } else {
        const user = users.find(u => u.email === email.trim() && u.password === password && u.status === "active");
        if (user) onLogin({ role: "user", ...user });
        else setError("Invalid credentials or account inactive.");
      }
    }, 500);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text)" }}>
      <ThemeStyle mode={theme} />
      {/* Theme toggle top-right */}
      <div style={{ position: "fixed", top: 16, right: 20 }}>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      <div style={{ marginBottom: 36, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #C9A84C, #8B6B1E)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" fill="white" opacity="0.9" />
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
            </svg>
          </div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: "var(--text)" }}>VaultRoom</span>
        </div>
        <p style={{ color: "var(--text-faint)", fontSize: 13 }}>Secure document sharing for transactions</p>
      </div>

      {!mode ? (
        <div style={{ display: "flex", gap: 16 }}>
          {[{ key:"admin", label:"Admin Portal", desc:"Manage users, folders & documents", icon:"⚙️", color:"#C9A84C" },
            { key:"user",  label:"Investor Portal", desc:"Access your permitted documents", icon:"📁", color:"#3B82F6" }].map(p => (
            <div key={p.key} onClick={() => { setMode(p.key); setError(""); setEmail(""); setPassword(""); }}
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "28px 32px", cursor: "pointer", width: 200, textAlign: "center", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = p.color; e.currentTarget.style.background = "var(--surface-hover)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface)"; }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>{p.label}</div>
              <div style={{ fontSize: 12, color: "var(--text-faint)", lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "36px 40px", width: 380, boxShadow: "0 20px 60px var(--shadow)" }}>
          <div onClick={() => { setMode(null); setError(""); setEmail(""); setPassword(""); }}
            style={{ color: "var(--text-faint)", fontSize: 12, marginBottom: 24, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
            ← Back
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontFamily: "'DM Serif Display', serif", color: "var(--text)", marginBottom: 4 }}>
              {mode === "admin" ? "Admin Sign In" : "Investor Sign In"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-faint)" }}>
              {mode === "admin" ? "Full access — manage the data room" : "View and download your permitted documents"}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
              className="inp" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
              className="inp" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>

          {error && <div style={{ fontSize: 12, color: "#E8453C", background: "#E8453C11", border: "1px solid #E8453C33", borderRadius: 6, padding: "8px 12px", marginBottom: 14 }}>{error}</div>}

          <div onClick={!loading ? handleSubmit : undefined}
            style={{ width: "100%", background: accentColor, borderRadius: 8, padding: "11px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, textAlign: "center", userSelect: "none", transition: "all 0.15s" }}>
            {loading ? "Signing in…" : "Sign In"}
          </div>

          <div style={{ marginTop: 16, padding: 12, background: "var(--surface-hover)", borderRadius: 8, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span>🔒</span>
            <div style={{ fontSize: 11, color: "var(--text-faint)", lineHeight: 1.6 }}>
              {mode === "admin" ? "All admin actions are logged and timestamped." : "Access is restricted to folders you have been granted. All activity is audited."}
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 28, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 20px", maxWidth: 460, fontSize: 12, color: "var(--text-faint)", lineHeight: 2 }}>
        <span style={{ color: "#C9A84C", fontWeight: 600 }}>Demo credentials</span><br />
        <span style={{ color: "var(--text-muted)" }}>Admin:</span> admin@vaultroom.com / admin123<br />
        <span style={{ color: "var(--text-muted)" }}>Investor 1:</span> j.whitfield@capitalpartners.com / capital123<br />
        <span style={{ color: "var(--text-muted)" }}>Investor 2:</span> s.chen@mergerco.com / merger123<br />
        <span style={{ color: "var(--text-muted)" }}>Investor 3:</span> m.okafor@legaladv.com / legal123
      </div>
    </div>
  );
}

// ─── ADMIN PORTAL ─────────────────────────────────────────────────────────────

function AdminPortal({ currentUser, onLogout, sharedState, theme, setTheme, branding, setBranding }) {
  const { folders, setFolders, users, setUsers, activityLog, setActivityLog } = sharedState;
  const [activeTab, setActiveTab] = useState("files");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedSubfolder, setSelectedSubfolder] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(["f1"]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderParent, setNewFolderParent] = useState(null);
  const [showUploadPicker, setShowUploadPicker] = useState(false);
  const [pendingFiles, setPendingFiles] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", access: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(null);
  const [folderImportPreview, setFolderImportPreview] = useState(null);
  const fileInputRef = useRef();
  const logoInputRef = useRef();

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const log = (action, target, folder = "—") => setActivityLog(prev => [{ id: `a${Date.now()}`, user: "Admin", action, target, folder, time: "Just now" }, ...prev]);

  const uploadFiles = (files, tFId = selectedFolder, tSFId = selectedSubfolder) => {
    if (!tFId) { showToast("Select a folder first", "error"); return; }
    const f = folders.find(fo => fo.id === tFId);
    const sf = tSFId ? f?.subfolders?.find(s => s.id === tSFId) : null;
    const loc = sf ? `${f?.name} / ${sf.name}` : f?.name;
    const newFiles = files.map(fi => ({ id: `d${Date.now()}-${Math.random()}`, name: fi.name, size: formatBytes(fi.size), uploaded: new Date().toISOString().split("T")[0], type: fi.name.endsWith(".pdf") ? "pdf" : fi.name.match(/\.xlsx?$/) ? "xlsx" : "file", views: 0 }));
    setFolders(prev => prev.map(fo => {
      if (fo.id !== tFId) return fo;
      if (tSFId) return { ...fo, subfolders: fo.subfolders.map(s => s.id === tSFId ? { ...s, files: [...s.files, ...newFiles] } : s) };
      return { ...fo, files: [...fo.files, ...newFiles] };
    }));
    newFiles.forEach(fi => log("Uploaded", fi.name, loc));
    showToast(`${files.length} file${files.length > 1 ? "s" : ""} uploaded to ${loc}`);
  };

  const handleUploadFromAll = (files) => { setPendingFiles(files); setShowUploadPicker(true); };

  // ── Recursive folder import ──────────────────────────────────────────────────

  // Reads a FileSystemEntry recursively into a plain JS tree { name, files: [], children: [] }
  const readEntry = (entry) => new Promise((resolve) => {
    if (entry.isFile) {
      entry.file(f => resolve({ type: "file", name: f.name, size: f.size, file: f }));
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const allEntries = [];
      const readBatch = () => {
        reader.readEntries(batch => {
          if (batch.length === 0) {
            Promise.all(allEntries.map(readEntry)).then(children => {
              resolve({ type: "dir", name: entry.name, children });
            });
          } else {
            allEntries.push(...batch);
            readBatch(); // readEntries only returns ≤100 at a time
          }
        });
      };
      readBatch();
    }
  });

  // Count files in a tree node recursively
  const countFiles = (node) => node.type === "file" ? 1 : (node.children || []).reduce((s, c) => s + countFiles(c), 0);
  const countDirs  = (node) => node.type === "dir" ? 1 + (node.children || []).filter(c => c.type === "dir").reduce((s, c) => s + countDirs(c), 0) : 0;

  // Handle a raw drop — check for folders first, fall back to flat files
  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const items = Array.from(e.dataTransfer.items || []);
    const hasFolder = items.some(it => {
      const entry = it.webkitGetAsEntry?.();
      return entry?.isDirectory;
    });

    if (hasFolder) {
      // Read all dropped items (may be a mix of folders + files)
      const roots = await Promise.all(
        items.map(it => {
          const entry = it.webkitGetAsEntry?.();
          return entry ? readEntry(entry) : null;
        })
      );
      const validRoots = roots.filter(Boolean);
      // Show preview modal
      setFolderImportPreview({ roots: validRoots, targetFolderId: selectedFolder, targetSubfolderId: selectedSubfolder });
    } else {
      // Plain files — existing behaviour
      const files = Array.from(e.dataTransfer.files);
      if (!selectedFolder) handleUploadFromAll(files);
      else uploadFiles(files);
    }
  };

  // Walk the tree and commit it into the folders state
  const commitFolderImport = (roots, targetFolderId, targetSubfolderId) => {
    const today = new Date().toISOString().split("T")[0];
    const colors = ["#C9A84C","#7B8FA1","#6B9E78","#9B72CF","#E8453C","#3B82F6"];
    let totalFiles = 0;
    let totalFolders = 0;

    const makeFile = (node) => ({
      id: `d${Date.now()}-${Math.random()}`,
      name: node.name,
      size: formatBytes(node.size || 0),
      uploaded: today,
      type: node.name.endsWith(".pdf") ? "pdf" : node.name.match(/\.xlsx?$/) ? "xlsx" : "file",
      views: 0,
    });

  // Walk a directory node and produce { rootFiles, subfolders } where every nested
  // directory at ANY depth becomes its own subfolder entry, named by its full relative
  // path (e.g. "Tax / 2023"). Files live in the closest ancestor subfolder.
  const buildSubfolders = (children, pathPrefix = "") => {
    const rootFiles   = [];
    const subfolders  = [];

    const walk = (nodes, prefix) => {
      for (const node of nodes) {
        if (node.type === "file") {
          if (!prefix) {
            // Direct child of the top-level folder → root files
            rootFiles.push(makeFile(node));
            totalFiles++;
          } else {
            // Find or create the subfolder for this path
            let sf = subfolders.find(s => s._path === prefix);
            if (!sf) {
              sf = { id: `sf${Date.now()}-${Math.random()}`, name: prefix, files: [], _path: prefix };
              subfolders.push(sf);
              totalFolders++;
            }
            sf.files.push(makeFile(node));
            totalFiles++;
          }
        } else {
          // Directory → recurse, extending path
          const newPath = prefix ? `${prefix} / ${node.name}` : node.name;
          walk(node.children || [], newPath);
        }
      }
    };

    walk(children, pathPrefix);

    // Remove internal _path key before storing
    return {
      rootFiles,
      subfolders: subfolders.map(({ _path, ...sf }) => sf),
    };
  };

    setFolders(prev => {
      let next = [...prev];

      for (const root of roots) {
        if (root.type === "file") {
          // A single file dropped — handle like normal upload
          if (!targetFolderId) continue;
          next = next.map(fo => {
            if (fo.id !== targetFolderId) return fo;
            const f = makeFile(root); totalFiles++;
            if (targetSubfolderId) return { ...fo, subfolders: fo.subfolders.map(sf => sf.id === targetSubfolderId ? { ...sf, files: [...sf.files, f] } : sf) };
            return { ...fo, files: [...fo.files, f] };
          });
        } else {
          // A directory — create a new top-level folder
          const { rootFiles, subfolders } = buildSubfolders(root.children || []);
          const num = String(next.length + 1).padStart(2, "0");
          const newFolder = {
            id: `f${Date.now()}-${Math.random()}`,
            name: `${num} - ${root.name}`,
            color: colors[next.length % colors.length],
            files: rootFiles,
            subfolders,
          };
          totalFolders++;
          next = [...next, newFolder];
          setExpandedFolders(ef => [...ef, newFolder.id]);
        }
      }
      return next;
    });

    log("Folder import", `${totalFolders} folder${totalFolders !== 1 ? "s" : ""}, ${totalFiles} file${totalFiles !== 1 ? "s" : ""}`);
    showToast(`Imported ${totalFolders} folder${totalFolders !== 1 ? "s" : ""} · ${totalFiles} file${totalFiles !== 1 ? "s" : ""}`, "success");
    setFolderImportPreview(null);
  };

  const deleteFile = (fId, fileId, name, sfId = null) => {
    const f = folders.find(fo => fo.id === fId);
    const sf = sfId ? f?.subfolders?.find(s => s.id === sfId) : null;
    const loc = sf ? `${f?.name} / ${sf.name}` : f?.name;
    setShowConfirm({ title: "Delete file?", msg: `"${name}" will be permanently removed.`, onConfirm: () => {
      setFolders(prev => prev.map(fo => {
        if (fo.id !== fId) return fo;
        if (sfId) return { ...fo, subfolders: fo.subfolders.map(s => s.id === sfId ? { ...s, files: s.files.filter(d => d.id !== fileId) } : s) };
        return { ...fo, files: fo.files.filter(d => d.id !== fileId) };
      }));
      log("Deleted", name, loc); showToast("File deleted"); setShowConfirm(null);
    }});
  };

  const addUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) { showToast("All fields required", "error"); return; }
    if (users.find(u => u.email === newUser.email)) { showToast("Email already exists", "error"); return; }
    const u = { id: `u${Date.now()}`, ...newUser, lastActive: "Never", status: "active", nda: false };
    setUsers(prev => [...prev, u]); log("Invited user", newUser.email);
    setNewUser({ name: "", email: "", password: "", access: [] }); setShowAddUser(false);
    showToast(`${u.name} invited`);
  };

  const removeUser = (uid) => {
    const u = users.find(u => u.id === uid);
    setShowConfirm({ title: "Remove user?", msg: `${u?.name} will lose all access immediately.`, onConfirm: () => {
      setUsers(prev => prev.filter(u => u.id !== uid));
      if (selectedUserId === uid) setSelectedUserId(null);
      log("Removed user", u?.email); showToast("User removed"); setShowConfirm(null);
    }});
  };

  const toggleAccess = (uid, fid) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== uid) return u;
      const has = u.access.includes(fid);
      log(has ? "Revoked access to" : "Granted access to", folders.find(f => f.id === fid)?.name, u.name);
      return { ...u, access: has ? u.access.filter(id => id !== fid) : [...u.access, fid] };
    }));
  };

  const addFolder = () => {
    if (!newFolderName.trim()) return;
    const colors = ["#C9A84C","#7B8FA1","#6B9E78","#9B72CF","#E8453C","#3B82F6"];
    if (newFolderParent) {
      const sf = { id: `sf${Date.now()}`, name: newFolderName, files: [] };
      setFolders(prev => prev.map(f => f.id === newFolderParent ? { ...f, subfolders: [...(f.subfolders||[]), sf] } : f));
      setExpandedFolders(prev => prev.includes(newFolderParent) ? prev : [...prev, newFolderParent]);
      log("Created subfolder", newFolderName, folders.find(f => f.id === newFolderParent)?.name);
      showToast("Subfolder created");
    } else {
      const num = String(folders.length + 1).padStart(2, "0");
      const folder = { id: `f${Date.now()}`, name: `${num} - ${newFolderName}`, color: colors[folders.length % colors.length], files: [], subfolders: [] };
      setFolders(prev => [...prev, folder]); log("Created folder", folder.name); showToast("Folder created");
    }
    setNewFolderName(""); setNewFolderParent(null); setShowNewFolder(false);
  };

  const toggleExpand = (fid, e) => { e.stopPropagation(); setExpandedFolders(prev => prev.includes(fid) ? prev.filter(id => id !== fid) : [...prev, fid]); };

  const currentFolder = folders.find(f => f.id === selectedFolder);
  const currentSubfolder = selectedSubfolder ? currentFolder?.subfolders?.find(sf => sf.id === selectedSubfolder) : null;
  const selectedUserObj = users.find(u => u.id === selectedUserId);
  const totalFiles = folders.reduce((s, f) => s + f.files.length + (f.subfolders||[]).reduce((ss, sf) => ss + sf.files.length, 0), 0);
  const totalViews = folders.reduce((s, f) => s + f.files.reduce((ss, d) => ss + d.views, 0) + (f.subfolders||[]).reduce((ss, sf) => ss + sf.files.reduce((sss, d) => sss + d.views, 0), 0), 0);

  const activeFiles = currentSubfolder
    ? currentSubfolder.files.map(d => ({ ...d, folderName: `${currentFolder.name} / ${currentSubfolder.name}`, folderId: currentFolder.id, subfolderId: currentSubfolder.id }))
    : currentFolder
      ? currentFolder.files.map(d => ({ ...d, folderName: currentFolder.name, folderId: currentFolder.id, subfolderId: null }))
      : folders.flatMap(f => [
          ...f.files.map(d => ({ ...d, folderName: f.name, folderId: f.id, subfolderId: null })),
          ...(f.subfolders||[]).flatMap(sf => sf.files.map(d => ({ ...d, folderName: `${f.name} / ${sf.name}`, folderId: f.id, subfolderId: sf.id }))),
        ]);
  const filteredFiles = activeFiles.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--bg)", minHeight: "100vh", color: "var(--text)", display: "flex", flexDirection: "column" }}>
      <ThemeStyle mode={theme} />

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 54, background: "var(--surface)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #C9A84C, #8B6B1E)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}><rect x="3" y="11" width="18" height="11" rx="2" fill="white" opacity="0.9"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9"/></svg>
          </div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: "var(--text)" }}>VaultRoom</span>
          <div style={{ width: 1, height: 14, background: "var(--border-strong)", margin: "0 4px" }} />
          <span style={{ fontSize: 11, color: "#C9A84C", fontWeight: 600, background: "#C9A84C15", padding: "2px 8px", borderRadius: 4 }}>ADMIN PORTAL</span>
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {[["files","📁 Files"],["users","👥 Users"],["activity","📋 Audit Log"],["branding","🎨 Branding"]].map(([t,l]) => (
            <button key={t} className={`nav-tab ${activeTab===t?"active":""}`} onClick={() => setActiveTab(t)}>{l}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <Avatar name="Admin" color="#C9A84C" size={28} />
          <button className="btn-g" style={{ fontSize: 11 }} onClick={onLogout}>Sign out</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "10px 24px", display: "flex", gap: 10, borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
        {[["Total Files", totalFiles],["Users", users.length],["Total Views", totalViews],["Folders", folders.length]].map(([l,v]) => (
          <div key={l} className="stat-card" style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "var(--text-faint)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", fontFamily: "'DM Serif Display', serif" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", height: "calc(100vh - 138px)" }}>

        {/* ── FILES ── */}
        {activeTab === "files" && (
          <>
            {/* Sidebar */}
            <div style={{ width: 224, borderRight: "1px solid var(--border)", padding: 14, display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", background: "var(--surface)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Folders</span>
                <button className="btn-g" style={{ padding: "2px 8px", fontSize: 11 }} onClick={() => { setNewFolderParent(null); setShowNewFolder(true); }}>+ New</button>
              </div>

              <div className={`folder-item ${!selectedFolder ? "active" : ""}`} onClick={() => { setSelectedFolder(null); setSelectedSubfolder(null); }}>
                <span style={{ fontSize: 14 }}>🗂</span>
                <span>All Files</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-dim)" }}>{totalFiles}</span>
              </div>

              {folders.map(f => {
                const isExpanded = expandedFolders.includes(f.id);
                const isFolderSel = selectedFolder === f.id && !selectedSubfolder;
                const fCount = f.files.length + (f.subfolders||[]).reduce((s, sf) => s + sf.files.length, 0);
                return (
                  <div key={f.id}>
                    <div className={`folder-item ${isFolderSel ? "active" : ""}`} onClick={() => { setSelectedFolder(f.id); setSelectedSubfolder(null); }}>
                      {(f.subfolders||[]).length > 0
                        ? <span onClick={e => toggleExpand(f.id, e)} style={{ fontSize: 9, color: "var(--text-dim)", transition: "transform 0.15s", display: "inline-block", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0 }}>▶</span>
                        : <span style={{ width: 14, flexShrink: 0 }} />}
                      <div style={{ width: 9, height: 9, borderRadius: 2, background: f.color, flexShrink: 0 }} />
                      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={f.name}>{f.name.length > 16 ? f.name.slice(0,16)+"…" : f.name}</span>
                      <span style={{ fontSize: 10, color: "var(--text-dim)" }}>{fCount}</span>
                    </div>

                    {isExpanded && (f.subfolders||[]).map(sf => {
                      const isSubSel = selectedFolder === f.id && selectedSubfolder === sf.id;
                      return (
                        <div key={sf.id} className={`folder-item ${isSubSel ? "active" : ""}`} style={{ paddingLeft: 28 }}
                          onClick={() => { setSelectedFolder(f.id); setSelectedSubfolder(sf.id); }}>
                          <svg viewBox="0 0 16 16" fill="none" style={{ width: 12, height: 12, flexShrink: 0 }}>
                            <path d="M2 4h9l3 3v6a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" fill={f.color} opacity="0.3" stroke={f.color} strokeWidth="1.2"/>
                          </svg>
                          <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11 }}>{sf.name}</span>
                          <span style={{ fontSize: 10, color: "var(--text-dim)" }}>{sf.files.length}</span>
                        </div>
                      );
                    })}

                    {isFolderSel && (
                      <div style={{ paddingLeft: 26 }}>
                        <div onClick={() => { setNewFolderParent(f.id); setShowNewFolder(true); }}
                          style={{ fontSize: 11, color: "var(--text-faint)", cursor: "pointer", padding: "4px 8px", borderRadius: 5, display: "inline-flex", alignItems: "center", gap: 4, transition: "all 0.12s" }}
                          onMouseEnter={e => { e.currentTarget.style.color = "#C9A84C"; e.currentTarget.style.background = "#C9A84C10"; }}
                          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-faint)"; e.currentTarget.style.background = "none"; }}>
                          + subfolder
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Main panel */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Toolbar */}
              <div style={{ padding: "10px 18px", display: "flex", gap: 10, alignItems: "center", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                <div style={{ fontSize: 12, color: "var(--text-faint)", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ cursor: "pointer", color: !selectedFolder ? "var(--text)" : "var(--text-faint)" }} onClick={() => { setSelectedFolder(null); setSelectedSubfolder(null); }}>All Files</span>
                  {selectedFolder && <><span>›</span><span style={{ cursor: "pointer", color: !selectedSubfolder ? "var(--text)" : "var(--text-faint)" }} onClick={() => setSelectedSubfolder(null)}>{currentFolder?.name}</span></>}
                  {selectedSubfolder && <><span>›</span><span style={{ color: "var(--text)" }}>{currentSubfolder?.name}</span></>}
                </div>
                <input className="inp" style={{ width: 200, marginLeft: "auto" }} placeholder="Search…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <input ref={fileInputRef} type="file" multiple style={{ display: "none" }}
                  onChange={e => { const files = Array.from(e.target.files); e.target.value = ""; if (!selectedFolder) handleUploadFromAll(files); else uploadFiles(files); }} />
                <button className="btn-p" onClick={() => fileInputRef.current?.click()}>↑ Upload</button>
              </div>

              {/* Drop zone */}
              <div className={`drag-zone ${dragOver ? "over" : ""}`}
                style={{ margin: "14px 18px 0", flexShrink: 0, transition: "all 0.2s" }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 28 }}>{dragOver ? "📂" : "🗂️"}</div>
                  <div style={{ fontSize: 13, color: dragOver ? "#C9A84C" : "var(--text-muted)", fontWeight: 600, transition: "color 0.15s" }}>
                    {dragOver ? "Release to import" : "Drop files or folders here"}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)", lineHeight: 1.7, textAlign: "center", maxWidth: 380 }}>
                    {selectedSubfolder
                      ? <>Files dropped here go into <span style={{ color: "#C9A84C" }}>{currentFolder?.name} / {currentSubfolder?.name}</span><br />
                        Drop an <strong style={{ color: "var(--text-muted)" }}>entire folder</strong> to auto-create its full subfolder tree</>
                      : selectedFolder
                      ? <>Files dropped here go into <span style={{ color: "#C9A84C" }}>{currentFolder?.name}</span><br />
                        Drop an <strong style={{ color: "var(--text-muted)" }}>entire folder</strong> to auto-create its full subfolder tree</>
                      : <>Drop an <strong style={{ color: "var(--text-muted)" }}>entire folder</strong> (with nested subfolders) to recreate its full structure<br />
                        or <span style={{ color: "#C9A84C" }}>click to pick files</span> manually</>}
                  </div>
                  {!selectedFolder && !dragOver && (
                    <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                      {["📁 Drag deal folder", "📄 Or pick files"].map((label, i) => (
                        <div key={i} style={{ padding: "4px 12px", borderRadius: 20, border: "1px dashed var(--border-strong)", fontSize: 11, color: "var(--text-faint)" }}>{label}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* File list */}
              <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px" }}>
                <div className="file-row" style={{ color: "var(--text-dim)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
                  <span>Name</span><span>Size</span><span>Uploaded</span><span>Views</span><span></span>
                </div>
                {filteredFiles.length === 0
                  ? <div style={{ padding: 36, textAlign: "center", color: "var(--text-faint)", fontSize: 13 }}>{selectedFolder ? "No files yet. Upload to get started." : "No files."}</div>
                  : filteredFiles.map(file => (
                    <div key={file.id} className="file-row">
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <FileIcon type={file.type} />
                        <div>
                          <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{file.name}</div>
                          {!currentSubfolder && <div style={{ fontSize: 10, color: "var(--text-faint)" }}>{!selectedFolder ? file.folderName : selectedFolder && !selectedSubfolder && ""}</div>}
                          {!selectedFolder && <div style={{ fontSize: 10, color: "var(--text-faint)" }}>{file.folderName}</div>}
                        </div>
                      </div>
                      <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{file.size}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{file.uploaded}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{file.views}</span>
                      <button className="btn-d" onClick={() => deleteFile(file.folderId, file.id, file.name, file.subfolderId)}>🗑</button>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* ── USERS ── */}
        {activeTab === "users" && (
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            <div style={{ width: 290, borderRight: "1px solid var(--border)", padding: 16, overflowY: "auto", background: "var(--surface)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Users <span style={{ color: "var(--text-faint)", fontWeight: 400 }}>({users.length})</span></span>
                <button className="btn-p" style={{ fontSize: 11, padding: "5px 12px" }} onClick={() => setShowAddUser(true)}>+ Invite</button>
              </div>
              {users.map(u => (
                <div key={u.id} className="user-card" style={{ border: `1px solid ${selectedUserId===u.id ? "#C9A84C33" : "var(--border)"}`, background: selectedUserId===u.id ? "#C9A84C08" : "transparent" }} onClick={() => setSelectedUserId(u.id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={u.name} color="#3B82F6" size={34} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                        {u.name}
                        {u.nda && <span style={{ fontSize: 10, background: "#10B98120", color: "#10B981", padding: "1px 6px", borderRadius: 4 }}>NDA ✓</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "var(--text-faint)" }}>Last: {u.lastActive}</span>
                    <div style={{ display: "flex", gap: 3 }}>{folders.map(f => <div key={f.id} title={f.name} style={{ width: 7, height: 7, borderRadius: 2, background: u.access.includes(f.id) ? f.color : "var(--border-strong)" }} />)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
              {!selectedUserObj
                ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-faint)", fontSize: 13, gap: 8 }}><span style={{ fontSize: 32 }}>👈</span>Select a user to manage permissions</div>
                : <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <Avatar name={selectedUserObj.name} color="#3B82F6" size={44} />
                      <div>
                        <div style={{ fontSize: 17, fontFamily: "'DM Serif Display', serif", color: "var(--text)" }}>{selectedUserObj.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 6 }}>{selectedUserObj.email}</div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <span style={{ fontSize: 10, background: "#10B98120", color: "#10B981", padding: "2px 7px", borderRadius: 4 }}>● Active</span>
                          {selectedUserObj.nda
                            ? <span style={{ fontSize: 10, background: "#10B98120", color: "#10B981", padding: "2px 7px", borderRadius: 4 }}>NDA Signed</span>
                            : <span style={{ fontSize: 10, background: "#E8453C20", color: "#E8453C", padding: "2px 7px", borderRadius: 4 }}>NDA Pending</span>}
                        </div>
                      </div>
                    </div>
                    <button className="btn-d" style={{ padding: "6px 12px" }} onClick={() => removeUser(selectedUserId)}>Remove User</button>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Folder Access</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {folders.map(f => {
                      const has = selectedUserObj.access.includes(f.id);
                      return (
                        <div key={f.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 10, height: 10, borderRadius: 3, background: f.color }} />
                            <div>
                              <div style={{ fontSize: 13, color: "var(--text)" }}>{f.name}</div>
                              <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{f.files.length} files</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 11, color: has ? "#10B981" : "var(--text-faint)" }}>{has ? "Access granted" : "No access"}</span>
                            <button className="toggle-track" style={{ background: has ? "#10B98122" : "var(--border-strong)", border: `2px solid ${has ? "#10B981" : "var(--border-strong)"}` }} onClick={() => toggleAccess(selectedUserId, f.id)}>
                              <div className="toggle-thumb" style={{ background: has ? "#10B981" : "var(--text-faint)", marginLeft: has ? "auto" : "0" }} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>}
            </div>
          </div>
        )}

        {/* ── AUDIT LOG ── */}
        {activeTab === "activity" && (
          <div style={{ flex: 1, padding: "14px 22px", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Audit Log</span>
              <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{activityLog.length} events</span>
            </div>
            <div className="log-row" style={{ color: "var(--text-dim)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
              <span>User</span><span>Action</span><span>Target</span><span>Time</span>
            </div>
            {activityLog.map(log => {
              const ac = { Downloaded:"#10B981", Uploaded:"#C9A84C", Deleted:"#E8453C", Viewed:"#3B82F6" }[log.action] || "#9B72CF";
              return (
                <div key={log.id} className="log-row">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--surface-hover)", fontSize: 8, color: "var(--text-muted)", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {log.user.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                    </div>
                    <span style={{ color: "var(--text-sub)", fontSize: 12 }}>{log.user}</span>
                  </div>
                  <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, fontWeight: 500, background: ac+"20", color: ac }}>{log.action}</span>
                  <div>
                    <div style={{ color: "var(--text-sub)", fontSize: 12 }}>{log.target}</div>
                    {log.folder && log.folder !== "—" && <div style={{ fontSize: 10, color: "var(--text-faint)" }}>{log.folder}</div>}
                  </div>
                  <span style={{ color: "var(--text-faint)", fontSize: 12 }}>{log.time}</span>
                </div>
              );
            })}
          </div>
        )}
        {/* ── BRANDING ── */}
        {activeTab === "branding" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
            <input ref={logoInputRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => { setBranding(b => ({ ...b, logo: ev.target.result })); showToast("Logo uploaded"); };
                reader.readAsDataURL(file);
                e.target.value = "";
              }} />

            <div style={{ maxWidth: 680 }}>
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "var(--text)", marginBottom: 6 }}>Investor Portal Branding</h2>
                <p style={{ fontSize: 13, color: "var(--text-faint)", lineHeight: 1.6 }}>Customise the logo, name and accent colour your investors see when they log in. Changes apply instantly — no back-and-forth required.</p>
              </div>

              {/* Live preview */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Live Preview — Investor Portal Header</div>
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px var(--shadow)" }}>
                  {/* Simulated investor header */}
                  <div style={{ borderBottom: "1px solid var(--border)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 54, background: "var(--surface)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {branding.logo
                        ? <img src={branding.logo} alt="logo" style={{ height: 28, maxWidth: 100, objectFit: "contain", borderRadius: 4 }} />
                        : <div style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${branding.accentColor}, ${branding.accentColor}99)`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}><rect x="3" y="11" width="18" height="11" rx="2" fill="white" opacity="0.9"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9"/></svg>
                          </div>}
                      <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 15, color: "var(--text)" }}>
                        {branding.companyName || "VaultRoom"}
                      </span>
                      <div style={{ width: 1, height: 14, background: "var(--border-strong)", margin: "0 4px" }} />
                      <span style={{ fontSize: 11, color: branding.accentColor, fontWeight: 600, background: branding.accentColor + "18", padding: "2px 8px", borderRadius: 4 }}>INVESTOR PORTAL</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: branding.accentColor + "22", border: `1px solid ${branding.accentColor}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: branding.accentColor }}>JW</div>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>James Whitfield</span>
                    </div>
                  </div>
                  {/* Simulated project name strip */}
                  <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                    <div style={{ fontSize: 20, fontFamily: "'DM Serif Display', serif", color: "var(--text)", marginBottom: 2 }}>
                      Welcome to {branding.projectName || "the Data Room"}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-faint)" }}>3 folders · 7 documents accessible</p>
                  </div>
                  {/* Simulated folder pill */}
                  <div style={{ padding: "14px 24px", display: "flex", gap: 8, background: "var(--bg)" }}>
                    {["All Documents", "Financials", "Legal"].map((label, i) => (
                      <div key={label} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${i === 0 ? branding.accentColor + "66" : "var(--border)"}`, fontSize: 12, fontWeight: 500, color: i === 0 ? branding.accentColor : "var(--text-muted)", background: i === 0 ? branding.accentColor + "10" : "none" }}>{label}</div>
                    ))}
                    <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                      <div style={{ padding: "6px 14px", borderRadius: 6, background: branding.accentColor, color: "#fff", fontSize: 12, fontWeight: 600 }}>↓ Download</div>
                      <div style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 12 }}>👁 View</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

                {/* Logo upload */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Logo</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 12, background: "var(--surface-hover)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                      {branding.logo
                        ? <img src={branding.logo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        : <span style={{ fontSize: 24 }}>🏢</span>}
                    </div>
                    <div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <button className="btn-p" style={{ fontSize: 12, padding: "7px 14px" }} onClick={() => logoInputRef.current?.click()}>
                          {branding.logo ? "Replace Logo" : "Upload Logo"}
                        </button>
                        {branding.logo && (
                          <button className="btn-g" style={{ fontSize: 12 }} onClick={() => { setBranding(b => ({ ...b, logo: null })); showToast("Logo removed"); }}>Remove</button>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-faint)", lineHeight: 1.5 }}>PNG, JPG or SVG · Shown in the investor portal header.<br />Recommended: 200×60px or wider, transparent background.</div>
                    </div>
                  </div>
                </div>

                {/* Company name */}
                <div>
                  <label style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Company / Fund Name</label>
                  <input className="inp" placeholder="e.g. Apex Capital" value={branding.companyName} onChange={e => setBranding(b => ({ ...b, companyName: e.target.value }))} />
                  <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 6 }}>Replaces "VaultRoom" in the portal header. Leave blank to keep the default.</div>
                </div>

                {/* Project name */}
                <div>
                  <label style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Deal / Project Name</label>
                  <input className="inp" placeholder="e.g. Project Atlas" value={branding.projectName} onChange={e => setBranding(b => ({ ...b, projectName: e.target.value }))} />
                  <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 6 }}>Shown as the investor portal welcome heading.</div>
                </div>

                {/* Accent colour */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Investor Portal Accent Colour</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    {/* Preset swatches */}
                    {["#3B82F6","#10B981","#8B5CF6","#EC4899","#F59E0B","#EF4444","#0EA5E9","#14B8A6"].map(c => (
                      <div key={c} onClick={() => setBranding(b => ({ ...b, accentColor: c }))}
                        style={{ width: 32, height: 32, borderRadius: "50%", background: c, cursor: "pointer", border: branding.accentColor === c ? "3px solid var(--text)" : "3px solid transparent", boxShadow: branding.accentColor === c ? `0 0 0 2px ${c}55` : "none", transition: "all 0.15s", flexShrink: 0 }} />
                    ))}
                    {/* Custom colour input */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 4 }}>
                      <div style={{ position: "relative" }}>
                        <input type="color" value={branding.accentColor} onChange={e => setBranding(b => ({ ...b, accentColor: e.target.value }))}
                          style={{ width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0, background: "none", opacity: 0, position: "absolute", inset: 0 }} />
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface-hover)", border: "2px dashed var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, pointerEvents: "none" }}>+</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--surface-hover)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px" }}>
                        <div style={{ width: 14, height: 14, borderRadius: 3, background: branding.accentColor, flexShrink: 0 }} />
                        <input value={branding.accentColor} onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setBranding(b => ({ ...b, accentColor: e.target.value })); }}
                          style={{ background: "none", border: "none", color: "var(--text)", fontSize: 13, fontFamily: "monospace", width: 72 }} maxLength={7} />
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 10 }}>Applied to buttons, pills, tags and interactive elements in the investor view.</div>
                </div>

              </div>

              {/* Save confirmation note */}
              <div style={{ marginTop: 28, padding: "14px 18px", background: "#10B98110", border: "1px solid #10B98130", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16 }}>✅</span>
                <div style={{ fontSize: 13, color: "#10B981", lineHeight: 1.6 }}>Changes apply instantly and are visible to all investors the next time they load the portal. No configuration requests needed.</div>
              </div>

              {/* ── NDA SECTION ── */}
              <div style={{ marginTop: 44, paddingTop: 36, borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div>
                    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "var(--text)", marginBottom: 6 }}>NDA / Access Agreement</h2>
                    <p style={{ fontSize: 13, color: "var(--text-faint)", lineHeight: 1.6, maxWidth: 480 }}>
                      Configure the agreement investors must accept before entering the data room. Edit the text yourself — no vendor required.
                    </p>
                  </div>
                  {/* Enable / disable toggle */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, paddingTop: 4 }}>
                    <span style={{ fontSize: 13, color: branding.ndaEnabled ? "var(--text)" : "var(--text-faint)", fontWeight: 500 }}>
                      {branding.ndaEnabled ? "Enabled" : "Disabled"}
                    </span>
                    <button className="toggle-track" style={{ background: branding.ndaEnabled ? "#10B98122" : "var(--border-strong)", border: `2px solid ${branding.ndaEnabled ? "#10B981" : "var(--border-strong)"}` }}
                      onClick={() => setBranding(b => ({ ...b, ndaEnabled: !b.ndaEnabled }))}>
                      <div className="toggle-thumb" style={{ background: branding.ndaEnabled ? "#10B981" : "var(--text-faint)", marginLeft: branding.ndaEnabled ? "auto" : "0" }} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20, opacity: branding.ndaEnabled ? 1 : 0.4, pointerEvents: branding.ndaEnabled ? "all" : "none", transition: "opacity 0.2s" }}>

                  {/* Agreement title */}
                  <div>
                    <label style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Agreement Title</label>
                    <input className="inp" placeholder="e.g. Non-Disclosure Agreement" value={branding.ndaTitle} onChange={e => setBranding(b => ({ ...b, ndaTitle: e.target.value }))} />
                    <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 5 }}>Displayed as the heading on the splash screen.</div>
                  </div>

                  {/* Agreement body */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <label style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Agreement Text</label>
                      <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{branding.ndaBody.length} chars</span>
                    </div>
                    <textarea className="inp" value={branding.ndaBody} onChange={e => setBranding(b => ({ ...b, ndaBody: e.target.value }))}
                      style={{ minHeight: 260, resize: "vertical", lineHeight: 1.75, fontSize: 12, fontFamily: "inherit" }} />
                    <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 5 }}>Full agreement text displayed to investors. Supports plain text with line breaks.</div>
                  </div>

                  {/* Require checkbox toggle */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "var(--surface-hover)", borderRadius: 10, border: "1px solid var(--border)" }}>
                    <div>
                      <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, marginBottom: 3 }}>Require explicit checkbox confirmation</div>
                      <div style={{ fontSize: 12, color: "var(--text-faint)" }}>Investor must tick "I confirm and agree" before the Accept button activates.</div>
                    </div>
                    <button className="toggle-track" style={{ background: branding.ndaRequireCheckbox ? "#10B98122" : "var(--border-strong)", border: `2px solid ${branding.ndaRequireCheckbox ? "#10B981" : "var(--border-strong)"}`, flexShrink: 0, marginLeft: 16 }}
                      onClick={() => setBranding(b => ({ ...b, ndaRequireCheckbox: !b.ndaRequireCheckbox }))}>
                      <div className="toggle-thumb" style={{ background: branding.ndaRequireCheckbox ? "#10B981" : "var(--text-faint)", marginLeft: branding.ndaRequireCheckbox ? "auto" : "0" }} />
                    </button>
                  </div>

                  {/* NDA preview card */}
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Splash Screen Preview</div>
                    <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                      {/* Preview header */}
                      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: "var(--text)", marginBottom: 4 }}>
                          {branding.ndaTitle || "Non-Disclosure Agreement"}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-faint)" }}>
                          {branding.projectName ? `${branding.projectName} · ` : ""}Please read and accept before accessing the data room
                        </div>
                      </div>
                      {/* Preview body snippet */}
                      <div style={{ padding: "14px 20px", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7, maxHeight: 100, overflow: "hidden", position: "relative", whiteSpace: "pre-wrap" }}>
                        {branding.ndaBody.slice(0, 280)}{branding.ndaBody.length > 280 ? "…" : ""}
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: `linear-gradient(transparent, var(--bg))` }} />
                      </div>
                      {/* Preview footer */}
                      <div style={{ padding: "12px 20px 16px", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
                        {branding.ndaRequireCheckbox && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 12, color: "var(--text-faint)" }}>
                            <div style={{ width: 14, height: 14, border: "1.5px solid var(--border-strong)", borderRadius: 3, flexShrink: 0 }} />
                            I confirm I have read and agree to these terms
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1, padding: "8px", borderRadius: 7, border: "1px solid var(--border-strong)", fontSize: 12, color: "var(--text-faint)", textAlign: "center" }}>Decline & Sign Out</div>
                          <div style={{ flex: 2, padding: "8px", borderRadius: 7, background: branding.accentColor, fontSize: 12, fontWeight: 700, color: "#fff", textAlign: "center" }}>I Accept — Enter Data Room</div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      {showAddUser && (
        <div className="modal-bg" onClick={() => setShowAddUser(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", color: "var(--text)", fontSize: 18, marginBottom: 20 }}>Invite User</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["Full Name","name","text","Jane Smith"],["Email","email","email","jane@firm.com"],["Temporary Password","password","password","Set password"]].map(([label,key,type,ph]) => (
                <div key={key}>
                  <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 5 }}>{label}</label>
                  <input className="inp" type={type} placeholder={ph} value={newUser[key]} onChange={e => setNewUser(p => ({...p,[key]:e.target.value}))} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>Folder Access</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {folders.map(f => (
                    <label key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--text)" }}>
                      <input type="checkbox" checked={newUser.access.includes(f.id)} onChange={() => setNewUser(p => ({...p, access: p.access.includes(f.id) ? p.access.filter(id=>id!==f.id) : [...p.access,f.id]}))} style={{ accentColor: "#C9A84C" }} />
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: f.color }} />{f.name}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button className="btn-g" style={{ flex: 1 }} onClick={() => setShowAddUser(false)}>Cancel</button>
                <button className="btn-p" style={{ flex: 1 }} onClick={addUser}>Send Invite</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewFolder && (
        <div className="modal-bg" onClick={() => { setShowNewFolder(false); setNewFolderParent(null); }}>
          <div className="modal-box" style={{ width: 340 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", color: "var(--text)", fontSize: 18, marginBottom: 6 }}>{newFolderParent ? "New Subfolder" : "New Folder"}</h3>
            {newFolderParent && <div style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 14 }}>Inside: <span style={{ color: "#C9A84C" }}>{folders.find(f=>f.id===newFolderParent)?.name}</span></div>}
            <input className="inp" placeholder={newFolderParent ? "e.g. 2023 Archive" : "e.g. Due Diligence"} value={newFolderName} onChange={e => setNewFolderName(e.target.value)} onKeyDown={e => e.key==="Enter" && addFolder()} autoFocus />
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button className="btn-g" style={{ flex: 1 }} onClick={() => { setShowNewFolder(false); setNewFolderParent(null); }}>Cancel</button>
              <button className="btn-p" style={{ flex: 1 }} onClick={addFolder}>Create</button>
            </div>
          </div>
        </div>
      )}

      {showUploadPicker && (
        <div className="modal-bg" onClick={() => { setShowUploadPicker(false); setPendingFiles(null); }}>
          <div className="modal-box" style={{ width: 380 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", color: "var(--text)", fontSize: 18, marginBottom: 6 }}>Choose Destination</h3>
            <div style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 16 }}>Uploading {pendingFiles?.length} file{pendingFiles?.length>1?"s":""} — select folder:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 300, overflowY: "auto" }}>
              {folders.map(f => (
                <div key={f.id}>
                  <div onClick={() => { uploadFiles(pendingFiles, f.id, null); setShowUploadPicker(false); setPendingFiles(null); }}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background="var(--surface-hover)"; e.currentTarget.style.borderColor=f.color+"55"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.borderColor="var(--border)"; }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: f.color }} />
                    <span style={{ fontSize: 13, color: "var(--text)" }}>{f.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-faint)" }}>{f.files.length} files</span>
                  </div>
                  {(f.subfolders||[]).map(sf => (
                    <div key={sf.id} onClick={() => { uploadFiles(pendingFiles, f.id, sf.id); setShowUploadPicker(false); setPendingFiles(null); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px 8px 28px", borderRadius: 8, cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background="var(--surface-hover)"}
                      onMouseLeave={e => e.currentTarget.style.background="none"}>
                      <svg viewBox="0 0 16 16" fill="none" style={{ width: 12, height: 12 }}><path d="M2 4h9l3 3v6a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" fill={f.color} opacity="0.3" stroke={f.color} strokeWidth="1.2"/></svg>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{sf.name}</span>
                      <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-faint)" }}>{sf.files.length} files</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <button className="btn-g" style={{ width: "100%", marginTop: 14 }} onClick={() => { setShowUploadPicker(false); setPendingFiles(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── FOLDER IMPORT PREVIEW ── */}
      {folderImportPreview && (() => {
        const { roots, targetFolderId, targetSubfolderId } = folderImportPreview;
        const totalF = roots.reduce((s, r) => s + (r.type === "dir" ? countFiles(r) : 1), 0);
        const totalD = roots.reduce((s, r) => s + (r.type === "dir" ? countDirs(r) : 0), 0);

        // Render a compact tree node
        const TreeNode = ({ node, depth = 0 }) => (
          <div style={{ paddingLeft: depth * 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "3px 0", fontSize: 12 }}>
              {node.type === "dir"
                ? <>
                    <span style={{ fontSize: 13 }}>📁</span>
                    <span style={{ color: "var(--text)", fontWeight: 600 }}>{node.name}</span>
                    <span style={{ color: "var(--text-faint)", fontSize: 11 }}>{countFiles(node)} file{countFiles(node) !== 1 ? "s" : ""}</span>
                  </>
                : <>
                    <span style={{ fontSize: 10, color: "var(--text-dim)" }}>│</span>
                    <span style={{ fontSize: 11 }}>📄</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{node.name}</span>
                  </>}
            </div>
            {node.type === "dir" && (node.children || []).slice(0, 8).map((c, i) => <TreeNode key={i} node={c} depth={depth + 1} />)}
            {node.type === "dir" && (node.children || []).length > 8 && (
              <div style={{ paddingLeft: 16, fontSize: 11, color: "var(--text-faint)", fontStyle: "italic" }}>
                … {(node.children || []).length - 8} more items
              </div>
            )}
          </div>
        );

        return (
          <div className="modal-bg" onClick={() => setFolderImportPreview(null)}>
            <div className="modal-box" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 24 }}>📦</span>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", color: "var(--text)", fontSize: 20 }}>Import Folder Structure</h3>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 16, lineHeight: 1.65 }}>
                Your full folder hierarchy was detected below. Each top-level folder becomes a data room folder. Nested subdirectories are preserved as subfolders — no matter how deep.
              </p>

              {/* Stats pills */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {[
                  { label: `${roots.filter(r => r.type === "dir").length} top-level folder${roots.filter(r=>r.type==="dir").length!==1?"s":""}`, color: "#C9A84C" },
                  { label: `${totalD} subfolder${totalD !== 1 ? "s" : ""}`, color: "#9B72CF" },
                  { label: `${totalF} file${totalF !== 1 ? "s" : ""}`, color: "#10B981" },
                ].map(p => (
                  <div key={p.label} style={{ padding: "4px 12px", borderRadius: 20, background: p.color + "18", border: `1px solid ${p.color}44`, fontSize: 12, fontWeight: 600, color: p.color }}>{p.label}</div>
                ))}
              </div>

              {/* Tree preview */}
              <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px", maxHeight: 280, overflowY: "auto", marginBottom: 16, fontFamily: "monospace" }}>
                {roots.map((r, i) => <TreeNode key={i} node={r} depth={0} />)}
              </div>

              {/* How nesting is handled */}
              <div style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 16, padding: "10px 14px", background: "var(--surface-hover)", border: "1px solid var(--border)", borderRadius: 8, lineHeight: 1.65 }}>
                <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>How deep nesting is handled: </span>
                Directories at the first level become <strong style={{ color: "var(--text)" }}>subfolders</strong>. Deeper directories are also preserved as subfolders with path-based names (e.g. <span style={{ fontFamily: "monospace", background: "var(--border)", padding: "1px 5px", borderRadius: 3 }}>Tax / 2023</span>) — every file lands in exactly the right place.
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-g" style={{ flex: 1 }} onClick={() => setFolderImportPreview(null)}>Cancel</button>
                <button className="btn-p" style={{ flex: 2 }} onClick={() => commitFolderImport(roots, targetFolderId, targetSubfolderId)}>
                  Import {totalF} file{totalF !== 1 ? "s" : ""} into {roots.filter(r=>r.type==="dir").length} folder{roots.filter(r=>r.type==="dir").length!==1?"s":""}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {showConfirm && (
        <div className="modal-bg" onClick={() => setShowConfirm(null)}>
          <div className="modal-box" style={{ width: 340 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", color: "var(--text)", fontSize: 17, marginBottom: 10 }}>{showConfirm.title}</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.6 }}>{showConfirm.msg}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-g" style={{ flex: 1 }} onClick={() => setShowConfirm(null)}>Cancel</button>
              <button style={{ flex: 1, background: "#E8453C", border: "none", borderRadius: 6, padding: 8, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }} onClick={showConfirm.onConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

// ─── USER PORTAL ──────────────────────────────────────────────────────────────

function UserPortal({ currentUser, onLogout, sharedState, theme, setTheme, branding }) {
  const { folders, setActivityLog } = sharedState;
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const accessibleFolders = folders.filter(f => currentUser.access.includes(f.id));
  const currentFolder = accessibleFolders.find(f => f.id === selectedFolder);
  const totalAccessible = accessibleFolders.reduce((s, f) => s + f.files.length + (f.subfolders||[]).reduce((ss,sf)=>ss+sf.files.length,0), 0);

  const allFiles = (currentFolder
    ? [...currentFolder.files.map(d=>({...d, folderName:currentFolder.name})), ...(currentFolder.subfolders||[]).flatMap(sf=>sf.files.map(d=>({...d, folderName:`${currentFolder.name} / ${sf.name}`})))]
    : accessibleFolders.flatMap(f => [...f.files.map(d=>({...d, folderName:f.name})), ...(f.subfolders||[]).flatMap(sf=>sf.files.map(d=>({...d, folderName:`${f.name} / ${sf.name}`})))]))
    .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const logAction = (action, file, folderName) => setActivityLog(prev => [{ id: `a${Date.now()}`, user: currentUser.name, action, target: file.name, folder: folderName, time: "Just now" }, ...prev]);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--bg)", minHeight: "100vh", color: "var(--text)", display: "flex", flexDirection: "column" }}>
      <ThemeStyle mode={theme} />

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 54, background: "var(--surface)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {branding.logo
            ? <img src={branding.logo} alt="logo" style={{ height: 28, maxWidth: 110, objectFit: "contain", borderRadius: 4 }} />
            : <div style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${branding.accentColor}, ${branding.accentColor}99)`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}><rect x="3" y="11" width="18" height="11" rx="2" fill="white" opacity="0.9"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9"/></svg>
              </div>}
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: "var(--text)" }}>
            {branding.companyName || "VaultRoom"}
          </span>
          <div style={{ width: 1, height: 14, background: "var(--border-strong)", margin: "0 4px" }} />
          <span style={{ fontSize: 11, color: branding.accentColor, fontWeight: 600, background: branding.accentColor + "18", padding: "2px 8px", borderRadius: 4 }}>INVESTOR PORTAL</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <Avatar name={currentUser.name} color={branding.accentColor} size={28} />
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{currentUser.name}</span>
          <button className="btn-g" style={{ fontSize: 11 }} onClick={onLogout}>Sign out</button>
        </div>
      </div>

      {!currentUser.nda && (
        <div style={{ background: "#C9A84C10", borderBottom: "1px solid #C9A84C25", padding: "10px 28px", display: "flex", alignItems: "center", gap: 10 }}>
          <span>⚠️</span>
          <div style={{ fontSize: 13, color: "#C9A84C" }}>NDA pending. <span style={{ color: "var(--text-faint)" }}>Contact your administrator — access may be restricted.</span></div>
        </div>
      )}

      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "var(--text)", marginBottom: 4 }}>
            {branding.projectName ? `Welcome to ${branding.projectName}` : `Welcome, ${currentUser.name.split(" ")[0]}`}
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-faint)" }}>{accessibleFolders.length} folder{accessibleFolders.length!==1?"s":""} · {totalAccessible} document{totalAccessible!==1?"s":""}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "var(--text-faint)" }}>
          🔒 All activity is monitored and logged
        </div>
      </div>

      {/* Folder pills */}
      <div style={{ padding: "16px 28px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="pill" onClick={() => setSelectedFolder(null)} style={{ borderColor: !selectedFolder ? branding.accentColor + "66" : "var(--border)", color: !selectedFolder ? branding.accentColor : "var(--text-muted)", background: !selectedFolder ? branding.accentColor + "10" : "none" }}>
          All Documents
          <span style={{ background: !selectedFolder ? branding.accentColor : "var(--border-strong)", color: !selectedFolder ? "#fff" : "var(--text-muted)", borderRadius: 10, padding: "1px 7px", fontSize: 10 }}>{totalAccessible}</span>
        </button>
        {accessibleFolders.map(f => {
          const fTotal = f.files.length + (f.subfolders||[]).reduce((s,sf)=>s+sf.files.length,0);
          return (
            <button key={f.id} className="pill" onClick={() => setSelectedFolder(f.id)} style={{ borderColor: selectedFolder===f.id ? f.color+"66" : "var(--border)", color: selectedFolder===f.id ? f.color : "var(--text-muted)", background: selectedFolder===f.id ? f.color+"10" : "none" }}>
              <div style={{ width: 7, height: 7, borderRadius: 2, background: f.color }} />
              {f.name.replace(/^\d+ - /,"")}
              <span style={{ background: selectedFolder===f.id ? f.color+"33" : "var(--border-strong)", color: selectedFolder===f.id ? f.color : "var(--text-muted)", borderRadius: 10, padding: "1px 7px", fontSize: 10 }}>{fTotal}</span>
            </button>
          );
        })}
      </div>

      <div style={{ padding: "14px 28px 0" }}>
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search documents…" className="inp" style={{ width: 280 }} />
      </div>

      <div style={{ padding: "16px 28px 28px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, overflowY: "auto", flex: 1 }}>
        {allFiles.length === 0
          ? <div style={{ gridColumn:"1/-1", padding: 48, textAlign:"center", color:"var(--text-faint)", fontSize:13 }}>No documents found.</div>
          : allFiles.map(file => (
            <div key={file.id} className="u-card">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                <FileIcon type={file.type} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.4, marginBottom: 4 }}>{file.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{file.size} · {file.folderName?.replace(/^\d+ - /,"")}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="view-btn" onClick={() => { logAction("Viewed", file, file.folderName); showToast(`Opening ${file.name}…`); }}>👁 View</button>
                <button style={{ background: branding.accentColor, border: "none", cursor: "pointer", borderRadius: 6, padding: "6px 12px", color: "#fff", fontSize: 11, fontWeight: 600, fontFamily: "inherit", transition: "all 0.15s" }}
                  onClick={() => { logAction("Downloaded", file, file.folderName); showToast(`Downloading ${file.name}…`); }}>↓ Download</button>
              </div>
            </div>
          ))}
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

// ─── NDA SPLASH ───────────────────────────────────────────────────────────────

function NdaSplash({ session, branding, theme, setTheme, onAccept, onDecline }) {
  const [checked, setChecked] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const bodyRef = useRef();
  const accent = branding.accentColor;

  const handleScroll = () => {
    const el = bodyRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) setScrolled(true);
  };

  const canAccept = branding.ndaRequireCheckbox ? (checked && scrolled) : scrolled;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text)", padding: "24px 16px" }}>
      <ThemeStyle mode={theme} />
      <div style={{ position: "fixed", top: 16, right: 20 }}>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      {/* Card */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, width: "100%", maxWidth: 640, boxShadow: "0 24px 80px var(--shadow)", overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "28px 36px 24px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            {branding.logo
              ? <img src={branding.logo} alt="logo" style={{ height: 32, maxWidth: 120, objectFit: "contain" }} />
              : <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${accent}, ${accent}99)`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 24 24" fill="none" style={{ width: 16, height: 16 }}><rect x="3" y="11" width="18" height="11" rx="2" fill="white" opacity="0.9"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9"/></svg>
                </div>}
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: "var(--text)" }}>
              {branding.companyName || "VaultRoom"}
            </span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "var(--text)", marginBottom: 6 }}>
            {branding.ndaTitle || "Non-Disclosure Agreement"}
          </h1>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />
            <span style={{ fontSize: 12, color: "var(--text-faint)" }}>
              {branding.projectName ? `${branding.projectName} · ` : ""}Please read and accept before accessing the data room
            </span>
          </div>
        </div>

        {/* NDA body — scrollable */}
        <div ref={bodyRef} onScroll={handleScroll}
          style={{ padding: "24px 36px", maxHeight: 320, overflowY: "auto", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.85, whiteSpace: "pre-wrap", background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
          {branding.ndaBody}
        </div>

        {/* Scroll hint */}
        {!scrolled && (
          <div style={{ padding: "8px 36px", background: "var(--bg)", display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--text-faint)", borderBottom: "1px solid var(--border)" }}>
            <span style={{ animation: "bounce 1.5s infinite" }}>↓</span>
            Scroll to the bottom to continue
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: "20px 36px 28px", background: "var(--surface)" }}>
          {branding.ndaRequireCheckbox && (
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, cursor: "pointer" }}>
              <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)}
                style={{ marginTop: 2, width: 16, height: 16, accentColor: accent, flexShrink: 0, cursor: "pointer" }} />
              <span style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                I, <strong style={{ color: "var(--text)" }}>{session.name}</strong>, confirm that I have read, understood, and agree to be bound by the terms of this Non-Disclosure Agreement. I understand that all activity in this data room is monitored and logged.
              </span>
            </label>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onDecline} className="btn-g" style={{ flex: 1, padding: "11px" }}>
              Decline & Sign Out
            </button>
            <button onClick={onAccept} disabled={!canAccept}
              style={{ flex: 2, padding: "11px", borderRadius: 8, border: "none", cursor: canAccept ? "pointer" : "not-allowed", fontFamily: "inherit", fontSize: 14, fontWeight: 700, transition: "all 0.2s",
                background: canAccept ? accent : "var(--border-strong)", color: canAccept ? "#fff" : "var(--text-faint)", opacity: canAccept ? 1 : 0.6 }}>
              I Accept — Enter Data Room
            </button>
          </div>

          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-faint)" }}>
            <span>🔒</span>
            Your acceptance will be timestamped and recorded in the audit log.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [session, setSession] = useState(null);
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [activityLog, setActivityLog] = useState(INITIAL_LOG);
  const [branding, setBranding] = useState({
    companyName: "",
    projectName: "Project Atlas",
    accentColor: "#3B82F6",
    logo: null,
    ndaEnabled: true,
    ndaTitle: "Non-Disclosure Agreement",
    ndaBody: `By accessing this data room, you agree to the following terms:\n\n1. CONFIDENTIALITY\nAll materials, documents, financial data, and information contained in this data room ("Confidential Information") are strictly confidential and proprietary. You agree to keep all Confidential Information in strict confidence and not to disclose it to any third party without prior written consent.\n\n2. PERMITTED USE\nYou may access and review the Confidential Information solely for the purpose of evaluating a potential transaction. You shall not use the Confidential Information for any other purpose.\n\n3. NO COPYING OR DISTRIBUTION\nYou agree not to copy, reproduce, distribute, transmit, or disclose, in whole or in part, any Confidential Information to any person or entity.\n\n4. RETURN OR DESTRUCTION\nUpon request, you will promptly return or destroy all Confidential Information and any copies thereof.\n\n5. MONITORING\nAll activity within this data room is logged and monitored. Unauthorised use or disclosure may result in legal action.\n\nThis agreement is governed by applicable law and constitutes a binding obligation.`,
    ndaRequireCheckbox: true,
  });

  const sharedState = { folders, setFolders, users, setUsers, activityLog, setActivityLog };

  const handleLogin = (sess) => { setSession(sess); setNdaAccepted(false); };
  const handleLogout = () => { setSession(null); setNdaAccepted(false); };

  const handleNdaAccept = () => {
    setNdaAccepted(true);
    setActivityLog(prev => [{ id: `a${Date.now()}`, user: session.name, action: "Accepted NDA", target: branding.ndaTitle || "Non-Disclosure Agreement", folder: "—", time: "Just now" }, ...prev]);
    setUsers(prev => prev.map(u => u.id === session.id ? { ...u, nda: true } : u));
  };

  if (!session) return <LoginScreen onLogin={handleLogin} users={users} theme={theme} setTheme={setTheme} branding={branding} />;
  if (session.role === "admin") return <AdminPortal currentUser={session} onLogout={handleLogout} sharedState={sharedState} theme={theme} setTheme={setTheme} branding={branding} setBranding={setBranding} />;
  if (branding.ndaEnabled && !ndaAccepted) return <NdaSplash session={session} branding={branding} theme={theme} setTheme={setTheme} onAccept={handleNdaAccept} onDecline={handleLogout} />;
  return <UserPortal currentUser={session} onLogout={handleLogout} sharedState={sharedState} theme={theme} setTheme={setTheme} branding={branding} />;
}
