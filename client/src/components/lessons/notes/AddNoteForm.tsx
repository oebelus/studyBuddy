import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddNoteForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newNote = { title, content };

    fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    })
      .then(response => response.json())
      .then(() => {
        setTitle('');
        setContent('');
        // Optionally, update the list of notes
      })
      .catch(error => console.error('Error adding note:', error));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <ReactQuill value={content} onChange={setContent} className="mb-2" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Note</button>
    </form>
  );
};

export default AddNoteForm;
