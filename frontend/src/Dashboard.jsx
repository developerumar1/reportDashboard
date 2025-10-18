import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const [path, setPath] = useState("/");
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");

  useEffect(() => {
    loadDir("/");
  }, []);

  async function loadDir(p = "/") {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/list?path=${encodeURIComponent(p)}`);
      if (!res.ok) throw new Error(`Failed to list: ${res.status}`);
      const data = await res.json();
      setFolders(data.filter((item) => item.isFolder));
      setFiles(data.filter((item) => !item.isFolder));
      setPath(p);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error loading directory");
      setFolders([]);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleView() {
    setView(view === "grid" ? "list" : "grid");
  }

  function openFile(item) {
    const url = `${API}/api/file?path=${encodeURIComponent(item.path)}`;
    window.open(url, "_blank");
  }

  function downloadItem(item) {
    const url = `${API}/api/download?path=${encodeURIComponent(item.path)}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function handleItemClick(item) {
    if (item.isFolder) loadDir(item.path);
    else openFile(item);
  }

  function handleContextMenu(e, item) {
    e.preventDefault();
    downloadItem(item);
  }

  function handleBreadcrumbClick(index) {
    if (index === -1) {
      loadDir("/"); 
      return;
    }
    const parts = path.split("/").filter(Boolean);
    const newPath =  parts.slice(0, index + 1).join("/");
    loadDir(newPath);
  }

  const pathParts = path.split("/").filter(Boolean);
  return (
    <div className="dashboard-container full">
      <div className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="breadcrumbs">
           <span
                className={`crumb`}
                onClick={() => loadDir('/')}
                style={{ cursor: "pointer" }}
              >
                /
              </span>
          {pathParts.map((part, i) => (
            <React.Fragment key={i}>
              <span className="sep"> &gt; </span>
              <span
                className={`crumb`}
                onClick={() => handleBreadcrumbClick(i)}
                style={{ cursor: "pointer" }}
              >
                {part}
              </span>
            </React.Fragment>
          ))}
        </div>
        <button className="view-toggle-btn" onClick={toggleView}>
          {view === "grid" ? "Switch to List View" : "Switch to Grid View"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <div className="section">
        <h4>Folders</h4>
        <div className={view === "grid" ? "grid" : "list"}>
          {folders.map((folder) => (
            <div
              key={folder.path}
              className="item"
              onClick={() => handleItemClick(folder)}
              onContextMenu={(e) => handleContextMenu(e, folder)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
              </svg>
              <div className="name">{folder.name}</div>
            </div>
          ))}
          {folders.length === 0 && <div className="empty">No folders</div>}
        </div>
      </div>

      <div className="section">
        <h4>Files</h4>
        <div className={view === "grid" ? "grid" : "list"}>
          {files.map((file) => (
            <div
              key={file.path}
              className="item"
              onClick={() => handleItemClick(file)}
              onContextMenu={(e) => handleContextMenu(e, file)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 2h6l6 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h4z"/>
              </svg>
              <div className="name">{file.name}</div>
            </div>
          ))}
          {files.length === 0 && <div className="empty">No files</div>}
        </div>
      </div>
    </div>
  );
}
