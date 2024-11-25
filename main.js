const titleInput = document.getElementById('bookFormTitle');
const writerInput = document.getElementById('bookFormAuthor');
const yearInput = document.getElementById('bookFormYear');
const form = document.getElementById('bookForm');
const bookFormIsComplete = document.getElementById('bookFormIsComplete');
const checkboxComplete = document.querySelector('main section:first-child form button span');


const STORAGE_KEY = 'TODO_APPS';
let bookSelf = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Inisialisasi: Tampilkan daftar buku
showBook();

// Fungsi template untuk menampilkan buku
function templateShowBook(id, title, author, year, isComplete, buttonText) {
    return `
        <div data-bookid="${id}" data-testid="bookItem">
            <h3 data-testid="bookItemTitle">Judul: ${title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${author}</p>
            <p data-testid="bookItemYear">Tahun: ${year}</p>
            <p data-testid="bookItemIsComplete">${isComplete ? 'Selesai Dibaca' : 'Belum Selesai Dibaca'}</p>
            <div>
                <button data-testid="bookItemIsCompleteButton" type="button">${buttonText}</button>
                <button data-testid="bookItemDeleteButton">Hapus Buku</button>
            </div>
        </div>`;
}

// Toggle teks checkbox saat status selesai dibaca diubah
bookFormIsComplete.addEventListener('change', () => {
    checkboxComplete.innerHTML = bookFormIsComplete.checked
        ? 'Selesai Dibaca'
        : 'Belum Selesai Dibaca';
});

// Fungsi mencari buku berdasarkan ID
function findById(element) {
    const id = element.target.closest('[data-bookid]').dataset.bookid;
    return bookSelf.find(book => book.id == id);
}

// Fungsi untuk menampilkan buku di DOM
function showBook() {
    const [incompleteBook, completeBook] = document.querySelectorAll("section > div");

    const bookComplete = bookSelf.filter(book => book.isComplete);
    const bookIncomplete = bookSelf.filter(book => !book.isComplete);

    incompleteBook.innerHTML = bookIncomplete.length
        ? bookIncomplete.map(book =>
            templateShowBook(book.id, book.title, book.author, book.year, book.isComplete, 'Selesai Dibaca')
          ).join('')
        : "Tidak ada buku";

    completeBook.innerHTML = bookComplete.length
        ? bookComplete.map(book =>
            templateShowBook(book.id, book.title, book.author, book.year, book.isComplete, 'Belum Selesai Dibaca')
          ).join('')
        : "Tidak ada buku";

    // Pasang ulang event listener untuk tombol setelah DOM diperbarui
    attachButtonListeners();
}

// Fungsi menambahkan event listener ke tombol
function attachButtonListeners() {
    // Tombol status selesai/belum selesai
    document.querySelectorAll('button[data-testid="bookItemIsCompleteButton"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const findBook = findById(e);
            if (findBook) {
                findBook.isComplete = !findBook.isComplete;
                saveToStorage();
                showBook();
            }
        });
    });

    // Tombol hapus buku
    document.querySelectorAll('button[data-testid="bookItemDeleteButton"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const findBook = findById(e);
            if (findBook) {
                bookSelf = bookSelf.filter(book => book.id != findBook.id);
                saveToStorage();
                showBook();
            }
        });
    });

}



// Fungsi menyimpan data ke localStorage
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookSelf));
}

// Menyimpan buku baru saat form disubmit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!confirm('Masukkan Buku?')) return;

    const newBook = {
        id: +new Date(),
        title: titleInput.value,
        author: writerInput.value,
        year: Number(yearInput.value),
        isComplete: bookFormIsComplete.checked,
    };

    bookSelf.push(newBook);
    saveToStorage();
    showBook();

    // Reset form setelah submit
    form.reset();
    checkboxComplete.innerHTML = 'Belum Selesai Dibaca';
});


