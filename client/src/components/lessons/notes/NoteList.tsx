import React, { useState, useEffect } from 'react';
import Note from './Note';

interface Note {
  id: string;
  title: string;
  content: string;
}

const NotesList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = () => {
      fetch('/api/notes')
        .then(response => response.json())
        .then(data => setNotes(data))
        .catch(error => console.error('Error fetching notes:', error));
    };

    fetchNotes();
    const intervalId = setInterval(fetchNotes, 5000); // Polling every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = (id: string) => {
    fetch(`/api/notes/${id}`, {
      method: 'DELETE',
    })
      .then(() => setNotes(notes.filter(note => note.id !== id)))
      .catch(error => console.error('Error deleting note:', error));
  };

  return (
    <div>
      {notes.map(note => (
        <Note key={note.id} id={note.id} content={note.content} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default NotesList;
