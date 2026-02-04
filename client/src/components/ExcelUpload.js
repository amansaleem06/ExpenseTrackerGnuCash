// ========================================
// Excel Upload Component
// ========================================
// Purpose: Allow users to upload and import expenses from Excel files
// Features: File validation, progress feedback, and data persistence
// ========================================

import React, { useState } from 'react';

// Component for uploading Excel files with expense data
// Supports: Date, Description, Amount, Account, Expense Type columns
const ExcelUpload = ({ onUpload, apiUrl }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  // Handle file selection and clear previous results
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  // Upload Excel file to server for data import and persistence
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setResult(null);

    try {
      // Send file to backend for processing
      const response = await fetch(`${apiUrl}/upload/excel`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setResult(data);
      
      // Refresh data if expenses were successfully imported
      if (data.imported > 0) {
        onUpload();
      }
    } catch (error) {
      console.error('Upload error:', error);
      setResult({ error: 'Failed to upload file. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <h2>Upload Excel File</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Upload your Excel file to import expenses. The file should have columns: Date, Description, Amount, Account, and Expense Type.
      </p>

      {/* File upload area with click-to-select functionality */}
      <div className="upload-area" onClick={() => document.getElementById('file-input').click()}>
        <input
          type="file"
          id="file-input"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
        />
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📁</div>
          <div className="upload-text">
            {file ? file.name : 'Click to select Excel file'}
          </div>
        </div>
      </div>

      {/* Upload button shown when file is selected */}
      {file && (
        <button 
          className="btn btn-primary" 
          onClick={handleUpload}
          disabled={uploading}
          style={{ marginTop: '20px' }}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      )}

      {/* Display upload results: success or error messages */}
      {result && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: result.error ? '#ffebee' : '#e8f5e9',
          borderRadius: '8px',
          color: result.error ? '#c62828' : '#2e7d32'
        }}>
          {result.error ? (
            <p><strong>Error:</strong> {result.error}</p>
          ) : (
            <div>
              <p><strong>Success!</strong></p>
              <p>Imported: {result.imported} expenses</p>
              {result.errors > 0 && (
                <p style={{ color: '#d32f2f', marginTop: '10px' }}>
                  Errors: {result.errors}
                  {result.errorDetails && result.errorDetails.length > 0 && (
                    <ul style={{ marginTop: '10px', textAlign: 'left' }}>
                      {result.errorDetails.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExcelUpload;
