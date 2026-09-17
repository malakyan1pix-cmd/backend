const notes = [];
let nextNoteId = 1;

const tasks = [];
let nextTaskId = 1;

const contacts = [];
let nextContactId = 1;

module.exports = {
    notes,
    tasks,
    contacts,
    getNextNoteId: () => nextNoteId++,
    getNextTaskId: () => nextTaskId++,
    getNextContactId: () => nextContactId++
};