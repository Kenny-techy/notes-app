let notes = [];

let editingNoteId = null;

function saveNote(event) {
  event.preventDefault();
  const title = document.getElementById("titleInput").value.trim();
  const content = document.getElementById("contentInput").value.trim();

  if (editingNoteId) {
    const noteIndex = notes.findIndex((note) => note.id === editingNoteId);
    notes[noteIndex] = {
      ...notes[noteIndex],
      title: title,
      content: content,
    };
  } else {
    notes.push({
      id: generateId(),
      title: title,
      content: content,
    });
  }
  closeNoteModal();
  saveNotes();
  renderNotes();
}

function saveNotes() {
  localStorage.setItem("quickNotes", JSON.stringify(notes));
}

function generateId() {
  return Date.now().toString();
}

function renderNotes() {
  const notesContainer = document.getElementById("notesContainer");
  if (notes.length === 0) {
    notesContainer.innerHTML = `
      <div class="no-notes-container">
        <h2>No notes yet</h2>
        <p>Create your first note to get started</p>
        <button class="add-note-button" onclick="openNoteModal()">+ Add Your First Note</button>
      </div>
    `;
    return;
  }
  notesContainer.innerHTML = notes
    .map(
      (note) => `
    <div class="note-card">
      <h3 class="note-title">${note.title}</h3>
      <p class="note-content">${note.content}</p>
      <div class="options">
        <button class="edit-btn" onclick="openNoteModal('${note.id}')">
          <i class='bx bxs-pencil' ></i>
        </button>
        <button class="delete-btn" onclick="deleteNote('${note.id}')">
          <i class='bx bx-x' ></i>
        </button>
      </div>
    </div>`,
    )
    .join("");
}

function deleteNote(noteId) {
  notes = notes.filter((note) => note.id != noteId);
  saveNotes();
  renderNotes();
}

function loadNotes() {
  const savedNotes = localStorage.getItem("quickNotes");
  return savedNotes ? JSON.parse(savedNotes) : [];
}

function openNoteModal(noteId = null) {
  const modal = document.getElementById("modal");
  const titleInput = document.getElementById("titleInput");
  const contentInput = document.getElementById("contentInput");

  if (noteId) {
    const noteToEdit = notes.find((note) => note.id === noteId);
    editingNoteId = noteId;
    document.getElementById("modalTitle").textContent = "Edit Note";
    titleInput.value = noteToEdit.title;
    contentInput.value = noteToEdit.content;
  } else {
    editingNoteId = null;
    document.getElementById("modalTitle").textContent = "Edit Note";
    titleInput.value = "";
    contentInput.value = "";
  }

  modal.showModal();
}

function closeNoteModal() {
  document.getElementById("modal").close();
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}

document.addEventListener("DOMContentLoaded", function () {
  notes = loadNotes();
  renderNotes();
  const noteForm = document.getElementById("noteForm");
  noteForm.addEventListener("submit", saveNote);

  const closeIcon = document.getElementById("closeIcon");
  closeIcon.addEventListener("click", closeNoteModal);

  const themeToggleButton = document.getElementById("themeToggleButton");
  themeToggleButton.addEventListener("click", toggleTheme);
});
