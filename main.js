const books = [
  { id: 0, name: "Dragon Ball", author: "Toriyama Akira" },
  { id: 1, name: "Naruto", author: "Kishimoto Masashi" },
  { id: 2, name: "Hunter x Hunter", author: "Togashi Yoshihiro" },
  { id: 3, name: "Hunter x Hunter", author: "Togashi Yoshihiro" },
  { id: 4, name: "Hunter x Hunter", author: "Togashi Yoshihiro" },
  { id: 5, name: "Hunter x Hunter", author: "Togashi Yoshihiro" },
  { id: 6, name: "Hunter x Hunter", author: "Togashi Yoshihiro" },
  { id: 7, name: "Hunter x Hunter", author: "Togashi Yoshihiro" },
  { id: 8, name: "Hunter x Hunter", author: "Togashi Yoshihiro" },
  { id: 9, name: "Hunter x Hunter", author: "Togashi Yoshihiro" },
  { id: 10, name: "Hunter x Hunter", author: "Togashi Yoshihiro" },
  { id: 11, name: "Hunter x Hunter", author: "Togashi Yoshihiro" },
  { id: 12, name: "Hunter x Hunter", author: "Togashi Yoshihiro" },
];

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const body = $("body");
const root = $("#root");

let closeNameBtn = "";
let lengthBookOnPage = 5;
let currentPage = 1;
let lengthPage = calcLengthPage();

render(appComponent(), root);

// tag
const tbody = $("table>tbody");
const nameBook = $("#name");
const authorBook = $("#author");
const nameErrBook = $("#name_error");
const authorErrBook = $("#author_error");
const titleDeleleBook = $("#title-book");
const titleModalBook = $("#modal-title");
const paginationNumber = $("#paginate-book");

// button
const btnAdd = $("#add-book");
const createBook = $("#create");
const editBook = $("#edit");
const removeBook = $("#remove");
const cancelDeleteModal = $("#cancel");
const searchBook = $("#search-book");

// modal
const modalAddBook = $("#my-add-book-form");
const modalDeleteBook = $("#delete-book-modal");

// different

renderPagination(lengthPage, currentPage);

// Event
const handleOpenModalAdd = () => {
  closeNameBtn = "modalAdd";
  body.style.overflow = "hidden";
  titleModalBook.textContent = "Add book";
  editBook.style.display = "none";
  createBook.style.display = "block";
  displayTag(modalAddBook);
  clearInputFormCreate();
};

const handleCreateBook = (e) => {
  const nameValue = nameBook.value.trim();
  const authorValue = authorBook.value.trim();

  const checkValidate = validateFormCreate(nameValue, authorValue);

  e.preventDefault();
  if (checkValidate) {
    const textSearch = searchBook.value.trim();
    addBook(nameValue, authorValue);
    const page = calcLengthPage();
    console.log(page);

    const renderBooks = books.filter((b, i) => {
      return (
        i + 1 > lengthBookOnPage * currentPage - lengthBookOnPage &&
        i + 1 <= lengthBookOnPage * currentPage
      );
    });
    toast({
      title: "Success",
      message: `Book ${nameBook.value} is added successfully`,
      type: "success",
      delay: 2500,
    });
    if (textSearch) {
      searchBooks(textSearch);
    } else {
      renderTableBook(renderBooks);
    }
    checkPaginate(page, currentPage);
    clearInputFormCreate();
  }
};

const handleOpenModalDelete = (id, title = "") => {
  closeNameBtn = "modalDelete";
  body.style.overflow = "hidden";
  titleDeleleBook.textContent = title;
  removeBook.setAttribute("data-id", id);
  displayTag(modalDeleteBook);
};

const handleOpenModalEdit = (id, name = "") => {
  const book = books.find((book) => book.id === id);
  closeNameBtn = "modalAdd";
  body.style.overflow = "hidden";
  titleModalBook.textContent = "Edit book";
  editBook.style.display = "block";
  createBook.style.display = "none";
  nameBook.value = book.name;
  authorBook.value = book.author;

  editBook.setAttribute("data-id", id);
  editBook.setAttribute("data-name", name);
  displayTag(modalAddBook);
};

function handleRemoveBook() {
  const textSearch = searchBook.value.trim();

  const book = books.find((book) => book.id == this.dataset.id);
  const isDel = deleteBook(this.dataset.id);
  if (isDel) {
    const page = calcLengthPage();
    console.log(page);
    const renderBooks = books.filter((b, i) => {
      return (
        i + 1 > lengthBookOnPage * currentPage - lengthBookOnPage &&
        i + 1 <= lengthBookOnPage * currentPage
      );
    });
    if (textSearch) {
      searchBooks(textSearch);
    } else {
      renderTableBook(renderBooks);
    }
    checkPaginate(page, currentPage);

    toast({
      title: "Success",
      message: `Book ${book.name} is added successfully`,
      type: "success",
      delay: 1000,
    });
  }
}

const handleCancelModal = (e) => {
  if (closeNameBtn) {
    const closeBoxModals = $$('span[class="close"]');
    const overflow = $(".overflow");

    // Check close button
    const isCloseBtn = [...closeBoxModals].includes(e.target);
    // When the user clicks anywhere on the outside of the form addBook
    //close it
    if (e.target === overflow) {
      closeBox(closeNameBtn);
    }

    // When the user clicks the close button
    if (isCloseBtn) {
      closeBox(closeNameBtn);
    }

    // When the user clicks the cancel button
    if (e.target === cancelDeleteModal) {
      displayTag(modalDeleteBook, false);
    }
  }
};

function handleEditBook(e) {
  const textSearch = searchBook.value.trim();

  const id = this.dataset.id;
  const name = nameBook.value;
  const author = authorBook.value;
  const result = books.splice(id, 1, { id, name, author });

  e.preventDefault();
  if (result) {
    if (textSearch) {
      searchBooks(textSearch);
    } else {
      renderTableBook(books);
    }

    toast({
      title: "Success",
      message: `Book ${this.dataset.name} is edited successfully`,
      type: "success",
      delay: 1000,
    });
  }
}

function handleOnChangePage(currentPageP) {
  const cr = Number(currentPageP);
  if (cr !== currentPage) {
    const renderBooks = books.filter((b, i) => {
      return (
        i + 1 > lengthBookOnPage * cr - lengthBookOnPage &&
        i + 1 <= lengthBookOnPage * cr
      );
    });
    renderTableBook(renderBooks);
    checkPaginate(lengthPage, cr);
  }
}

btnAdd.addEventListener("click", handleOpenModalAdd);
createBook.addEventListener("click", handleCreateBook);
editBook.addEventListener("click", handleEditBook);

removeBook.addEventListener("click", handleRemoveBook);
window.addEventListener("click", handleCancelModal);
searchBook.addEventListener("input", function () {
  const textSearch = this.value.trim();

  const renderBooks = books.filter((b, i) => {
    return (
      i + 1 > lengthBookOnPage * currentPage - lengthBookOnPage &&
      i + 1 <= lengthBookOnPage * currentPage
    );
  });

  if (textSearch) {
    searchBooks(textSearch);
  } else {
    renderTableBook(renderBooks);
  }
});
// Components has not parameters
function searchAddFormComponent() {
  return `
    <div class="search_books">
        <div class="form">
            <input type="text" id="search-book" class="form__control" placeholder="Search books">
            <button id="add-book" class="form__submit">Add book</button>
        </div>
    </div>
    `;
}

function addBookModalComponent() {
  return `
        <section id="my-add-book-form" class='form-modal'>
            <div class="modal">
                <!-- Modal header -->
                <div class="modal__header">
                    <h2 id="modal-title">Add book</h2>
                    <span class="close">&times;</span>
                </div>

                <!-- Modal body -->
                <div class="modal__body">
                    <form action="#" id="form-add-book">
                        <div class="form__group">
                            <label for="name">Name</label>
                            <input type="text" id="name" class="form__control" placeholder="Enter the book title..." required>
                            <span class="form__message" id="name_error"></span>
                        </div>

                        <div class="form__group">
                            <label for="author">Author</label>
                            <input type="text" id="author" class="form__control" placeholder="Enter author..." required>
                            <span class="form__message" id="author_error"></span>
                        </div>

                        <button id="create" class="form__submit">Create</button>
                        <button id="edit" class="form__submit">Save</button>
                    </form>
                </div>
            </div>
        </section>
    `;
}

function deleteModalComponent() {
  return `
    <section id="delete-book-modal"  class='form-modal'>
      <div class="modal">
          <!-- Modal header -->
          <div class="modal__header">
            <h2>Delete book</h2>
            <span class="close">&times;</span>
          </div>
          
          <!-- Modal body -->
          <div class="modal__body">
            <p>Do you want to delete <b id="title-book">Refactoring</b> book?</p>
          </div>

          <div class="btn">
            <button id="remove" class="form__submit">Delete</button>
            <button id="cancel" class="form__submit">Cancel</button>
          </div>
      </div>
    </section>
  `;
}

function paginationComponent() {
  return `
  <div class="pagination">
    <a href="#">&laquo;</a>
    <div id="paginate-book" class="pagination__number">
      <a class="active" href="#">1</a>
      <a  href="#">2</a>
    </div>
    <a href="#">&raquo;</a>
  </div>

  `;
}

function appComponent() {
  return `
        <div class='overflow'></div>
        <div id='toast'></div>
        <main>
            ${containerComponent([
              searchAddFormComponent(),
              tableBookComponent(books),
              paginationComponent(),
            ])}
            ${addBookModalComponent()}
            ${deleteModalComponent()}
        </main>
      `;
}

//  Components has parameters
function bookComponent(book, i) {
  return `
      <tr>
          <td> ${i + 1} </td>
          <td> ${book.name} </td>
          <td> ${book.author} </td>
          <td>
            <button class="delete-book" onclick ="handleOpenModalDelete(${
              book.id
            },'${book.name}')">Delete</button>
            <button class="edit-book" onclick ="handleOpenModalEdit(${
              book.id
            },'${book.name}')">Edit</button>
          </td>
      </tr>
      `;
}

function tableBookComponent(books) {
  return `
        <table>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Name</th>
                    <th>Author</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
              ${
                books.length
                  ? books
                      .map((book, i) =>
                        i < lengthBookOnPage ? bookComponent(book, i) : ""
                      )
                      .join("")
                  : `<tr><td colspan='4' style='text-align:center;'><span>Don't have any books</span> <button style='color:red' onclick='handleOpenModalAdd()'> Add book</button></td><tr>`
              }
            </tbody>
        </table>
      `;
}

function containerComponent(html) {
  return `
        <div class="container">
            ${html.join("")}
        </div>
    `;
}

//  Functions

function render(html, root, debug) {
  if (debug) {
    root.innerText = html;
  } else {
    root.innerHTML = html;
  }
}
function renderTableBook(
  books,
  html = `<tr><td colspan='4' style='text-align:center;'><span>Don't have any books</span> <button style='color:red' onclick='handleOpenModalAdd()'> Add book</button></td><tr>`
) {
  const tbodyHTML = books.length
    ? books.map((book, i) => bookComponent(book, i)).join("")
    : html;
  render(tbodyHTML, tbody);
}

function renderPagination(lengthPage = 3, currentPage = 1) {
  const paginateHTML = Array(lengthPage)
    .fill(0)
    .map((p, i) =>
      i + 1 === currentPage
        ? `<a class="active" >${i + 1}</a>`
        : `<a onclick="handleOnChangePage(${i + 1})">
          ${i + 1}
        </a>`
    )
    .join("");
  render(paginateHTML, paginationNumber);
}

function displayTag(tag, show = true) {
  const overflow = $(".overflow");

  if (show) {
    tag.style.display = "block";
    overflow.style.display = "block";
  } else {
    tag.style.display = "none";
    overflow.style.display = "none";
  }
}

function closeBox(close) {
  switch (close) {
    case "modalAdd":
      displayTag(modalAddBook, false);
      break;
    case "modalDelete":
      displayTag(modalDeleteBook, false);
      break;
  }

  closeNameBtn = "";
}

function addBook(name = "", author = "") {
  books.push({
    id: books[books.length - 1] ? books[books.length - 1].id + 1 : 0,
    name,
    author,
  });
}

function deleteBook(id) {
  try {
    console.log(books);

    books.forEach((book, i) => {
      book.id == id && books.splice(i, 1);
    });
    console.log(books);

    // if (searchInput.value.trim() !== "") {
    //   searchBooks();
    // } else renderBooksTable(books);
    displayTag(modalDeleteBook, false);
    return true;
  } catch (error) {
    toast({
      title: "Erorr",
      message: "An error has occurred",
      type: "error",
      delay: 1000,
    });
    return false;
  }
}

function searchBooks(value) {
  const htmllll = `<tr><td colspan='4' style='text-align:center;'><span style='color:#7a7a00'>Don't have any books</span></td><tr>`;
  const newBooks = books.filter((book) =>
    book.name.toLowerCase().includes(value.toLowerCase())
  );
  renderTableBook(newBooks, htmllll);
}

function clearInputFormCreate() {
  nameBook.value = "";
  authorBook.value = "";
  nameErrBook.textContent = "";
  authorErrBook.textContent = "";

  nameBook.focus();
}

function validateFormCreate(name, author) {
  const nameErrBook = $("#name_error");
  const authorErrBook = $("#author_error");

  nameErrBook.textContent = "";
  authorErrBook.textContent = "";
  if (!name) {
    nameErrBook.textContent = "Name cannot be empty.";
  }
  if (!author) {
    authorErrBook.textContent = "Author cannot be empty.";
  }

  return !!(name.trim() && author.trim());
}

function calcLengthPage() {
  const page = Math.ceil(books.length / lengthBookOnPage);
  return page ? page : 1;
}

function checkPaginate(page, currentPageP) {
  if (page && currentPageP) {
    if (page !== lengthPage || currentPageP !== currentPage) {
      lengthPage = page;
      currentPage = currentPageP;
      renderPagination(page, currentPageP);
    }
  }
}

// Toast function
function toast({ title = "", message = "", type = "info", delay = 3000 }) {
  const main = $("#toast");
  const icons = {
    success: "fa-solid fa-circle-check",
    info: "fa-solid fa-circle-info",
    warning: "fa-sharp fa-solid fa-circle-exclamation",
    error: "fa-sharp fa-solid fa-circle-exclamation",
  };
  if (main) {
    const toastE = document.createElement("div");

    // Auto remove toast
    const idRemoveToast = setTimeout(() => {
      main.removeChild(toastE);
    }, delay + 1000);
    // Remove when click close
    toastE.onclick = (e) => {
      const btnClose = e.target.closest(".toast__close");
      if (btnClose) {
        main.removeChild(toastE);
        clearTimeout(idRemoveToast);
      }
    };

    toastE.classList.add("toast", `toast--${type}`);
    toastE.innerHTML = `
      <div class="toast__icon">
        <i class="${icons[type]}"></i>
      </div>
      <div class="toast__body">
        <h3 class="toast__title">${title}</h3>
        <p class="toast__message">${message}</p>
      </div>
      <div class="toast__close">
        <i class="fa-solid fa-xmark"></i>
      </div>
    `;
    main.appendChild(toastE);
    // Animation
    toastE.animate(
      [
        {
          opacity: 0,
          transform: "translateX(calc(100% + 32px))",
        },
        {
          opacity: 1,
          transform: "translateX(0)",
        },
      ],
      { duration: 300, easing: "ease" }
    );

    toastE.animate(
      [
        {
          opacity: 0,
        },
      ],
      {
        duration: 1000,
        easing: "linear",
        delay: delay,
        fill: "forwards",
      }
    );
  }
}
