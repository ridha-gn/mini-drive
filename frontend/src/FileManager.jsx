import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:8000'

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
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Files</h1>
        <button onClick={onLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={{ marginTop: '20px', marginBottom: '30px' }}>
        <label
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
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
        <p>No files uploaded yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>Filename</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Uploaded</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{file.filename}</td>
                <td style={{ padding: '10px' }}>{new Date(file.uploaded_at).toLocaleDateString()}</td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => handleDownload(file.id, file.filename)}
                    style={{ padding: '5px 10px', cursor: 'pointer' }}
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
