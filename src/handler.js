// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  // eslint-disable-next-line no-unneeded-ternary
  const finished = pageCount === readPage ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
        finish: finished,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// eslint-disable-next-line no-unused-vars
const getAllBookHandler = (request, h) => {
  const data = [];
  const { reading, finished, name } = request.query;

  // Mengambil data buku berdasarkan query parameter reading
  if (reading) {
    if (reading === '1') {
      const index = books.filter((book) => book.reading === true);

      index.forEach((book) => {
        data.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
          // finished: book.finished,
        });
      });

      const response = h.response({
        status: 'success',
        data: {
          books: data,
        },
      });
      response.code(200);
      return response;
    }
    if (reading === '0') {
      const index = books.filter((book) => book.reading === false);

      index.forEach((book) => {
        data.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
          // finished: book.finished,
        });
      });

      const response = h.response({
        status: 'success',
        data: {
          books: data,
        },
      });
      response.code(200);
      return response;
    }
  }

  // Mengambil data buku berdasarkan query parameter finished
  if (finished) {
    if (finished === '1') {
      const index = books.filter((book) => book.finished === true);

      index.forEach((book) => {
        data.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
          // finished: book.finished,
        });
      });

      const response = h.response({
        status: 'success',
        data: {
          books: data,
        },
      });
      response.code(200);
      return response;
    }
    if (finished === '0') {
      const index = books.filter((book) => book.finished === false);

      index.forEach((book) => {
        data.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
          // finished: book.finished,
        });
      });

      const response = h.response({
        status: 'success',
        data: {
          books: data,
        },
      });
      response.code(200);
      return response;
    }
  }

  // mengambil data buku berdasarkan query parameter name
  if (name) {
    // eslint-disable-next-line max-len
    // const index = books.filter((book) => book.name.toLowerCase().split(' ')[0] === name.toLowerCase());
    const index = books.filter((book) => book.name.toLowerCase().split(' ').find((n) => n === name.toLowerCase()));
    // console.log(index);
    index.forEach((book) => {
      data.push({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      });
    });
    const response = h.response({
      status: 'success',
      data: {
        books: data,
      },
    });
    response.code(200);
    return response;
  }

  // melakukan foreach untuk mendapatkan data buku secara keseluruhan
  books.forEach((book) => {
    data.push({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    });
  });
  const response = h.response({
    status: 'success',
    data: {
      books: data,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((i) => i.id === bookId)[0];

  if (book !== undefined) {
    // Mengambil detail semua buku jika book ada
    if (book) {
      const response = h.response({
        status: 'success',
        data: {
          book,
        },
      });
      response.code(200);
      return response;
    }
    // mengambil detail bukur berdasarkan finished === true
    if (book.finished === true) {
      const response = h.response({
        status: 'success',
        data: {
          book,
        },
      });
      response.code(200);
      return response;
    }
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((i) => i.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
