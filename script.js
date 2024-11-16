document.querySelector('.search-btn').addEventListener('click', () => {
    const input = document.querySelector('.search-input').value.trim();
    if (input) {
        alert(`Searching for: "${input}"`);
    } else {
        alert('Please enter a search term!');
    }
});
