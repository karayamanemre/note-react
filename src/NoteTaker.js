import { useState, useEffect } from 'react';
import './NoteTaker.css';

function NoteTaker() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    setFilteredNotes(filterTag ? notes.filter(note => note.tags.includes(filterTag.trim())) : notes);
  }, [notes, filterTag]);
  
  function handleEditNote(index) {
      setEditing(true);
      setEditIndex(index);
      const selectedNote = notes[index];
      setTitle(selectedNote.title);
      setBody(selectedNote.body);
      setTags(selectedNote.tags.join(','));
  }

  function handleCancelEdit() {
  setEditing(false);
  setTitle("");
  setBody("");
  setTags("");
  }

  function handleFilterByTag(e) {
    setFilterTag(e.target.value);
  }

  function handleAddNote(e) {
    e.preventDefault();
    if (editing) {
        const updatedNotes = [...notes];
        updatedNotes[editIndex] = { title, body, tags: tags.split(',').map(tag => tag.trim()) };
        setNotes(updatedNotes);
        setEditing(false);
    } else {
        setNotes([...notes, { title, body, tags: tags.split(',').map(tag => tag.trim()) }]);
    }
    setTitle("");
    setBody("");
    setTags("");
  }

  function handleDeleteNote(index) {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
  }

  return (
    <div className='main'>
      <section className='form-container'>
        <h2>Your Note</h2>
        <form onSubmit={handleAddNote}>
          <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
              placeholder="Note description"
              value={body}
              onChange={(e) => setBody(e.target.value)}
          />
          <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
          />
          <button type="submit" className='add-btn'>{editing ? 'Save Changes' : 'Add Note'}</button>
          {editing && <button onClick={handleCancelEdit}>Cancel Edit</button>}
      </form>
        <input type="text" placeholder="Filter by tag" onChange={handleFilterByTag} />
      </section>
      <section className='notes-container'>
        {filteredNotes.map((note, index) => (
          <div className="note" key={index}>
            <h3 className='note-title'>{note.title}</h3>
            <p className='note-text'>{note.body}</p>
            <p className='tags'>Tags: {note.tags.join(', ')}</p>
            <button className='delete-btn' onClick={() => handleDeleteNote(index)}>Delete</button>
            <button className='edit-btn' onClick={() => handleEditNote(index)}>Edit</button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default NoteTaker;
