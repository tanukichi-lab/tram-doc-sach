// --- Code cho Chức năng Tìm kiếm ---

// Khởi tạo "database" rỗng
let searchData = [];

// 1. Tải "database" từ file JSON
fetch('search-data.json')
    .then(response => response.json())
    .then(data => {
        searchData = data; // Nạp dữ liệu vào "database"
    })
    .catch(error => console.error('Lỗi tải file search-data.json:', error));

// 2. Tìm các phần tử HTML cần thiết
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('search-results');

// 3. Hàm tô đậm chữ bị trùng
function highlightMatch(text, query) {
    // Thêm try...catch để tránh lỗi nếu text là null hoặc undefined
    try {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    } catch (e) {
        return text;
    }
}

// 4. Hàm thực hiện tìm kiếm
function performSearch(query) {
    // Xóa kết quả cũ
    resultsContainer.innerHTML = '';
    
    if (query.length < 2) { // Chỉ tìm khi gõ ít nhất 2 chữ
        resultsContainer.style.display = 'none';
        return;
    }

    const normalizedQuery = query.toLowerCase();
    
    // Lọc "database"
    const filteredData = searchData.filter(item => {
        return (
            (item.title && item.title.toLowerCase().includes(normalizedQuery)) ||
            (item.keywords && item.keywords.toLowerCase().includes(normalizedQuery)) ||
            (item.description && item.description.toLowerCase().includes(normalizedQuery))
        );
    });

    // 5. Hiển thị kết quả
    if (filteredData.length > 0) {
        filteredData.forEach(item => {
            const resultElement = document.createElement('a');
            resultElement.href = item.url;
            resultElement.classList.add('result-item');
            
            resultElement.innerHTML = `
                ${highlightMatch(item.title, query)}
                <div class="context">${highlightMatch(item.description, query)}</div>
            `;
            resultsContainer.appendChild(resultElement);
        });
        resultsContainer.style.display = 'block'; // Hiện khung kết quả
    } else {
        // Không tìm thấy
        resultsContainer.innerHTML = '<div class="no-result">Không tìm thấy kết quả nào</div>';
        resultsContainer.style.display = 'block';
    }
}

// 6. Lắng nghe các sự kiện
if (searchInput) {
    // Lắng nghe sự kiện gõ phím
    searchInput.addEventListener('input', () => {
        performSearch(searchInput.value);
    });

    // Ẩn kết quả khi bấm ra ngoài
    document.addEventListener('click', (event) => {
        // Chỉ ẩn nếu bấm ra ngoài cả ô tìm kiếm VÀ khung kết quả
        if (!searchInput.contains(event.target) && !resultsContainer.contains(event.target)) {
            resultsContainer.style.display = 'none';
        }
    });

    // Hiện kết quả khi bấm vào lại
    searchInput.addEventListener('focus', () => {
        performSearch(searchInput.value);
    });
}