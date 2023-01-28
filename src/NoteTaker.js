import { useState, useEffect } from 'react';
import './NoteTaker.css';

function NoteTaker() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);

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

  function handleFilterByTag(e) {
    setFilterTag(e.target.value);
  }

  function handleAddNote(e) {
    e.preventDefault();
    setNotes([...notes, { title, body, tags: tags.split(',').map(tag => tag.trim()) }]);
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
          <button type="submit" className='add-btn'>Add Note</button>
        </form>
      </section>
      <section className='notes-container'>
        <input type="text" placeholder="Filter by tag" onChange={handleFilterByTag} />
        {filteredNotes.map((note, index) => (
          <div className="note" key={index}>
            <h3>{note.title}</h3>
            <p>{note.body}</p>
            <p>Tags: {note.tags.join(', ')}</p>
            <button className='delete-btn' onClick={() => handleDeleteNote(index)}>Delete</button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default NoteTaker;
