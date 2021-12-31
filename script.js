const imagesContainer = document.querySelector('.images-container');
const saveBtn = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');
const resultsNav = document.getElementById('results-nav');
const favoritesNav = document.getElementById('favoritesNav');

let photosArray = [];
let savedFavorites = {};



// Display photos function
function displayPhotos(e) {
    const currentArray = e === 'favorites' ? Object.values(savedFavorites) : photosArray
    // Run for each element returned
    currentArray.forEach((photo) => {
        // Create Card <div>
        const cardElement = document.createElement('div');
        cardElement.classList.add("card");
        // Create <anchor>
        const item = document.createElement('a');
        item.href = photo.hdurl;
        item.target = '_blank';
        // Create <image>
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = 'NASA Picture of the Dat';
        img.classList.add("card-img-top");
        // include <img> in <a>
        item.appendChild(img);
        // include <a> in <image-container>
        cardElement.appendChild(item);
        // Create Card <div>
        const cardBody = document.createElement('div');
        cardBody.classList.add("card-body");
        // Create <h5>
        const title = document.createElement('h5');
        title.classList.add("card-title");
        title.textContent = photo.title
        // Create <p> Add To Favorites
        const favorites = document.createElement('p');
        favorites.classList.add("clickable");
        if (e === 'results') {
            favorites.textContent = 'Add to Favorites';
            favorites.setAttribute('onclick', `saveFavorites('${photo.url}')`)
        }
        else {
            favorites.textContent = 'Remove Favorite';
            favorites.setAttribute('onclick', `removeFavorites('${photo.url}')`)
        };
        // Create <p> description
        const description = document.createElement('p');
        description.classList.add("card-text");
        description.textContent = photo.explanation;
        // Create <small>
        const textMuted = document.createElement('small');
        textMuted.classList.add("text-muted");
        // Create <strong>
        const date = document.createElement('strong');
        date.textContent = photo.date;
        // Create <span>
        const copyright = document.createElement('span');
        if (photo.copyright) {
            copyright.textContent = ` Copyright: ${photo.copyright}`;
        }
        // include <strong> and <span> in <small>
        textMuted.append(date, copyright);
        // include
        cardBody.append(title, favorites, description, textMuted);
        cardElement.appendChild(cardBody)
        imagesContainer.append(cardElement);
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (currentArray === photosArray) {
        favoritesNav.hidden = true;
        resultsNav.hidden = false;
    } else {
        favoritesNav.hidden = false;
        resultsNav.hidden = true;
    }
    loader.hidden = true;
}

function displayFavorites() {
    if (localStorage.getItem('favorites')) {
        savedFavorites = JSON.parse(localStorage.getItem('favorites'))
        imagesContainer.textContent = '';
        displayPhotos('favorites');
    }
}

/* Fetch From API */
async function fetchPictures() {
    loader.hidden = false;
    const apiurl = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=10'
    try {
        const response = await fetch(apiurl);
        photosArray = await response.json();
        displayPhotos('results');
    }
    catch (error) {
        console.log(error);
    }
}


function saveFavorites(e) {
    photosArray.forEach((photo) => {
        if (e === photo.url && !savedFavorites[e]) {
            savedFavorites[photo.url] = photo;
            // Show saved button
            saveBtn.hidden = false;
            setTimeout(() => {
                saveBtn.hidden = true;
            }, 1500)
        }
        // Addd to local storage
        localStorage.setItem('favorites', JSON.stringify(savedFavorites))
    });
    // Show saved button

}
;

function removeFavorites(e) {
    if (savedFavorites[e]) {
        delete savedFavorites[e];
        // Update local storage
        localStorage.setItem('favorites', JSON.stringify(savedFavorites))
        // Update DOM
        displayFavorites('favorites');
    }
}


fetchPictures();