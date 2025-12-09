import { useState, useEffect } from 'react'

const API_URL = 'http://72.146.196.148'
function FileManager({ token, onLogout }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/files?token=${token}`)
      const data = await response.json()
      setFiles(data)
    } catch (err) {
      console.error('Error fetching files:', err)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_URL}/upload?token=${token}`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        fetchFiles()
      }
    } catch (err) {
      console.error('Error uploading file:', err)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDownload = async (fileId, filename) => {
    try {
      const response = await fetch(`${API_URL}/download/${fileId}?token=${token}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error downloading file:', err)
    }
  }

  return (
    <div className="file-manager">
      <div className="header">
        <h1 className="title">My Files</h1>
        <button onClick={onLogout} className="button button-secondary">
          Logout
        </button>
      </div>

      <div className="upload-section">
        <label className="upload-label">
          {uploading ? 'Uploading...' : 'Upload File'}
          <input
            type="file"
            onChange={handleUpload}
            style={{ display: 'none' }}
            disabled={uploading}
            accept=".pdf,.png,.jpg,.jpeg,.txt"
          />
        </label>
      </div>

      {files.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"></div>
          <p>No files uploaded yet</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>Upload your first file to get started</p>
        </div>
      ) : (
        <table className="file-table">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Uploaded</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td> {file.filename}</td>
                <td>{new Date(file.uploaded_at).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDownload(file.id, file.filename)}
                    className="download-button"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default FileManager
