import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5216/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }); 
      const newFileList = [
        ...fileList,
        {
          id: fileList.length + 1,
          filename: selectedFile.name,
          downloadLink: 'http://localhost:5216'+response.data.downloadLink,
        },
      ];

      setFileList(newFileList);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleRemoveFile = (id) => {
    const newFileList = fileList.filter((file) => file.id !== id);
    setFileList(newFileList);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">HTML to PDF Converter</h1>
      <div className="file-upload-container">
        <label htmlFor="file-input" className="custom-file-input">
          Choose File
        </label>
        <input type="file" id="file-input" onChange={handleFileChange} />
        <button className="upload-button" onClick={handleFileUpload}>
          Upload
        </button>
      </div>

      <ul className="file-list">
        {fileList.map((file) => (
          <li key={file.id} className="file-item">
            <span className="file-name">{file.filename}</span>
            <a href={file.downloadLink} download className="download-link">
              Download
            </a>
            <button onClick={() => handleRemoveFile(file.id)} className="remove-button">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;