// album-selector.js

document.addEventListener('DOMContentLoaded', () => {
    const albumGrid = document.getElementById('album-grid');
    albumGrid.innerHTML = albumList.map(album => `
        <div class="album">
            <a href="${album.link}">
                <img src="${album.img}" alt="${album.name}" class="album-cover">
                <div class="album-name">${album.name}</div>
            </a>
        </div>
    `).join('');
});
