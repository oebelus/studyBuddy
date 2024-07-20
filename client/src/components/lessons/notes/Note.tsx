import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface NoteProps {
  id: string;
  content: string;
  onDelete: (id: string) => void;
}

const Note: React.FC<NoteProps> = ({ id, content, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [currentContent, setCurrentContent] = useState(content);

  const handleSave = () => {
    fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: currentContent }),
    })
      .then(response => response.json())
      .then(data => {
        setEditMode(false);
        setCurrentContent(data.content);
      })
      .catch(error => console.error('Error saving note:', error));
  };

  return (
    <div className="border p-4 rounded shadow-md mb-4">
      
      {editMode ? (
        <>
          <ReactQuill value={currentContent} onChange={setCurrentContent} />
          <button className="mt-2 text-blue-500" onClick={handleSave}>
            Save
          </button>
        </>
      ) : (
        <>
          <div dangerouslySetInnerHTML={{ __html: currentContent }} />
          <button className="mt-2 text-blue-500" onClick={() => setEditMode(true)}>
            Edit
          </button>
        </>
      )}
      <button className="mt-2 text-red-500" onClick={() => onDelete(id)}>
        Delete
      </button>
    </div>
  );
};

export default Note;
