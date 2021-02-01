// In this challenge, I want you to create a Dashboard for all our films. Each film should be
// displayed in our browser, in a box of its own with an image of the film of your choice, similar // to how it would
// look on Netflix.
// Please solve this using the film array, as this is an array exercise. Do not hardcode the names,
// even though it might be tempting!

const films = ['Jaws', 'Aliens', 'Bad Santa', 'Casablanca', 'Ghost', 'Twister', 'legally Blonde', 'Elf', 'Zoolander']

// your code goes here





// hint: use a for loop to create the boxes and add information to them.

//level up:
//1. Are you able to add your own personal rating to each film card too?
const main = document.querySelector('main');
const baseUrl = 'https://api.themoviedb.org/3/';
const myApiKey = '838b0a3bf7b99519f89a62d82df2b50a';
const sortOptions = document.querySelectorAll('.sortOption');
let sortByQuery = '&sort_by=popularity.desc';
let sortAsc = true;
let lastSort = document.querySelector('.sortOption');

// get available genres from API
async function getGenres() {
    // build url + query
    const genreUrl = 'genre/movie/list?api_key=';
    const url = baseUrl + genreUrl + myApiKey;
    // send it
    try{
        const response = await fetch(url);
        const data = await response.json();
        const genres = data.genres;
        genres.forEach(genre => {
            let className = genre.name.toLowerCase();
            // remove spaces for adding classes
            if(className.includes(" ")){
                const pieces = className.split(" ");
                className = pieces.join("");
            }
            // create section item
            const section = document.createElement('section');
            section.classList.add(`${className}Movies`);
            section.setAttribute('data-genreid',`${genre.id}`);
            // create title
            const title = document.createElement('h3');
            title.classList.add(`${className}Title`);
            title.textContent = `${genre.name}`;
            title.setAttribute('data-genreid',`${genre.id}`);
            // create ul
            const ul = document.createElement('ul');
            ul.classList.add(`${className}`, 'movieList');
            ul.setAttribute('data-genreid',`${genre.id}`);
            // build and add to doc
            section.appendChild(title);
            section.appendChild(ul);
            main.appendChild(section);
        });
    } catch( err) {
        console.log(err);
    }
    // repopulate movies
    populateMovies();
}

function updateSortQuery(e){
    // clear previously selected style and arrow
    lastSort.classList.remove('selected');
    const lastArrow = lastSort.querySelector('.direction');
    lastArrow.innerHTML = '';
    // add selected style
    this.classList.add('selected');
    // if direction pressed flip
    if( e.target.classList.contains('direction')){
        sortAsc = !sortAsc;
    }
    // update arrow pointer
    const arrow = this.querySelector('.direction');
    arrow.innerHTML = sortAsc? '&#9650' : '&#9661';
    // rebuild sort query
    const directionQuery = sortAsc? '.asc': '.desc';
    const baseQuery = '&sort_by=';
    const sortQuery = `${this.dataset.sort}`;
    sortByQuery = baseQuery + sortQuery + directionQuery;
    // update lastSort
    lastSort = this;
    // repopulate movies
    populateMovies();
}

// populate provided list with all movies
async function getMovies(ul, genreid) {
    // build full url + queries
    const imagePath = 'https://image.tmdb.org/t/p/w500/';
    const discoverUrl = 'discover/movie?api_key=';
    const languageQuery = '&language=en-US';
    const adultQuery = '&include_adult=false';
    const videoQuery = '&include_video=false';
    const pageQuery = '&page=1';
    const genreQuery = `&with_genres=${genreid}`;
    const fullUrl = baseUrl + discoverUrl + myApiKey + languageQuery + sortByQuery + adultQuery + videoQuery + pageQuery + genreQuery;
    // send it
    try{
        const response = await fetch(fullUrl);
        const data = await response.json();
        const movies = data.results;
        movies.forEach(movie => {
            // create list item
            const li = document.createElement('li');
            li.classList.add('movie');
            li.classList.add('hide');
            // create image
            const image = document.createElement('img');
            image.classList.add('movieImage');
            let imageSource = imagePath + movie.poster_path;
            if( movie.poster_path === null){
                imageSource = 'imgs/tbc.jpg';
            }
            image.src = imageSource;
            // create details div
            const details = document.createElement('div');
            details.classList.add('movieDetailsDiv');
            details.classList.add('hidden');
            // details title
            const title = document.createElement('h5');
            title.textContent = movie.title;
            // details overview
            const overview = document.createElement('p');
            overview.textContent = movie.overview;
            // details vote average
            const voteAverage = document.createElement('span');
            voteAverage.textContent = movie.vote_average;
            voteAverage.classList.add('voteAverage');
            // details vote count
            const voteCount = document.createElement('span');
            voteCount.textContent = movie.vote_count;
            voteCount.classList.add('voteCount');
            // details release date
            const releaseDate = document.createElement('span');
            releaseDate.textContent = movie.release_date;
            releaseDate.classList.add('releaseDate');
            // build div
            details.appendChild(title);
            details.appendChild(overview);
            details.appendChild(voteAverage);
            details.appendChild(voteCount);
            details.appendChild(releaseDate);
            // build li
            li.appendChild(image);
            li.appendChild(details);
            // add to dom
            ul.appendChild(li);
            // add event listener
            li.addEventListener('click', (e) => {
                // toggle additional details
                const selectedMovie = e.target.parentNode;
                selectedMovie.classList.toggle('selected');
                const additionalDetails = selectedMovie.childNodes[1];
                additionalDetails.classList.toggle('hidden');
            });
            // show item
            setTimeout( function(){
                li.classList.remove('hide');
            }, 500);
        });
    } catch( err) {
        console.log(err);
    }
}

function populateMovies(){
    const sections = document.querySelectorAll('section');
    sections.forEach( section => {
        const movieList = section.querySelector('ul');
        const genreid = movieList.dataset.genreid;
        movieList.innerHTML = "";
        getMovies(movieList, genreid);
    })
}

sortOptions.forEach( option => option.addEventListener('click', updateSortQuery));
getGenres();