/* Import */
const { nanoid } = require('nanoid');
const notes = require('./notes');

/* Handler Post /notes */
const addNoteHandler = (request, h) => {

    /* Client mengirim data catatan (title, tags, dan body) 
    yang akan disimpan dalam bentuk JSON melalui body request. */
    const { title, tags, body } = request.payload;

    /* Generate ID */
    const id = nanoid(16);

    /* Create and Update */
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    /* masukan nilai-nilai tersebut ke dalam array notes menggunakan method push(). */
    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
    };

    notes.push(newNote);

    /* sukses jika array notes bertambah */
    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    /* jika sukses = true */
    if (isSuccess) {
        /* send respond success */
        const response = h.response({
          status: 'success',
          message: 'Catatan berhasil ditambahkan',
          data: {
            noteId: id,
          },
        });

        response.code(201);
        return response;
    }

    /* jika gagal / isSuccess = false */
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });

    response.code(500);
    return response;
 
};

/*  Handler GET /notes */
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

/* Handler GET by ID */
const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  /* filet array by ID  */
  const note = notes.filter((n) => n.id === id)[0];

  /* jika ketemu send success dan ambil data */
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  /* else error */
  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });

  response.code(404);
  return response;
};


/* Handler PUT /notes:id */
const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  /* find item in array by id */
  const index = notes.findIndex((note) => note.id === id);

  /* Jika ketemu (bukan -1)
    update item */
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    /* send respond Success */
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  /* Jika fail (index = -1) */
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

/* Handler DELETE /notes:id */
const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
 
  /* find index */
  const index = notes.findIndex((note) => note.id === id);

  /* jika ketemu */
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  /* jika gagal */
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

/* eksport modul */
module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };