document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('book-list');
    const genreFilter = document.getElementById('genre-filter');
    const sortOrder = document.getElementById('sort-order');
    const itemsPerPageInput = document.getElementById('items-per-page');
    const errorMessage = document.getElementById('error-message');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

    let books = [];
    let filteredBooks = [];
    let currentPage = 1;
    let itemsPerPage = parseInt(itemsPerPageInput.value);

    function fetchBooks() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'lab7.json', true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        books = JSON.parse(xhr.responseText);
                        populateFilters();
                        updateBookList();
                    } catch (e) {
                        console.error('Error parsing the JSON data:', e);
                        errorMessage.textContent = 'Failed to parse book data. Please try again later.';
                    }
                } else {
                    console.error('Error fetching the book data:', xhr.statusText);
                    errorMessage.textContent = 'Failed to load book data. Please try again later.';
                }
            }
        };
        xhr.send();
    }

    function populateFilters() {
        const genres = new Set(books.map(book => book.genre));
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
    }

    function updateBookList() {
        const filtered = filterBooks();
        const sorted = sortBooks(filtered);
        const paginated = paginateBooks(sorted);
        
        bookList.innerHTML = '';
        paginated.forEach(book => {
            const listItem = document.createElement('li');
            listItem.classList.add('book-item');
            listItem.innerHTML = `
                <div class="cost-label">Cost: ${book.cost}</div>
                <img src="${book.image}" class="img">
                <strong>Title:</strong> ${book.title}
                <strong>Author:</strong> ${book.author}
                <strong>Genre:</strong> ${book.genre}
                <strong>Availability:</strong>${book.Availability}
            `;
            bookList.appendChild(listItem);
        });

        updatePaginationButtons();
    }

    function filterBooks() {
        const genre = genreFilter.value;
        filteredBooks = genre ? books.filter(book => book.genre === genre) : books;
        return filteredBooks;
    }

    function sortBooks(books) {
        const order = sortOrder.value;
        return books.slice().sort((a, b) => a[order].localeCompare(b[order]));
    }

    function paginateBooks(books) {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return books.slice(start, end);
    }

    function updatePaginationButtons() {
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage * itemsPerPage >= filteredBooks.length;
    }

    genreFilter.addEventListener('change', () => {
        currentPage = 1;
        updateBookList();
    });

    sortOrder.addEventListener('change', () => {
        currentPage = 1;
        updateBookList();
    });

    itemsPerPageInput.addEventListener('input', () => {
        itemsPerPage = parseInt(itemsPerPageInput.value);
        currentPage = 1;
        updateBookList();
    });

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateBookList();
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentPage * itemsPerPage < filteredBooks.length) {
            currentPage++;
            updateBookList();
        }
    });

    fetchBooks();
});
