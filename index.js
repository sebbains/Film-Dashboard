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
let sortAsc = false;
let lastSort = document.querySelector('.sortOption');
let isDown = false;
let startX;
let scrollLeft;

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

function updateSortQuery(){
    // ternary flips direction if same sort was clicked otherwise default desc
    sortAsc = ( lastSort === this)? !sortAsc : false;
    // clear previously selected style and arrow
    lastSort.classList.remove('selected');
    const lastArrow = lastSort.querySelector('.direction');
    lastArrow.innerHTML = '';
    // add selected style
    this.classList.add('selected');
    // update arrow pointer
    const arrow = this.querySelector('.direction');
    arrow.innerHTML = sortAsc? '&#9651' :'&#9660';
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
            const title = document.createElement('h4');
            title.textContent = movie.title;
            // details overview
            const overview = document.createElement('p');
            const textSummary = (movie.overview.length >175)? `${movie.overview.substring(0,175)}...` : `${movie.overview.substring(0,200)}`;
            overview.classList.add('overview');
            overview.innerHTML = textSummary;
            // overview readmore
            const readMore = document.createElement('span');
            readMore.innerText = 'read more';
            readMore.classList.add('readMore');
            // hidden full text
            const fullText = document.createElement('p');
            fullText.innerText = movie.overview;
            fullText.classList.add('fullText');
            // mini details container
            const miniDetails = document.createElement('div');
            miniDetails.classList.add('minis');
            // mini details vote average
            const voteAverage = document.createElement('span');
            const face = (movie.vote_average >= 6.66)? 'smile' :(movie.vote_average >= 3.33)? 'meh' : 'frown';
            const style = (movie.vote_average >= 6.66)? 'good' :(movie.vote_average >= 3.33)? 'bad' : 'ugly';
            voteAverage.innerHTML = `<i class="fas fa-${face}"></i> ${movie.vote_average}`;
            voteAverage.classList.add('voteAverage');
            voteAverage.classList.add(`${style}`);
            // mini details vote count
            const voteCount = document.createElement('span');
            voteCount.innerHTML = `<i class="fas fa-vote-yea"></i> ${movie.vote_count}`;
            voteCount.classList.add('voteCount');
            // mini details release date
            const releaseDate = document.createElement('span');
            releaseDate.innerHTML = `<i class="fas fa-calendar-day"></i> ${movie.release_date}`;
            releaseDate.classList.add('releaseDate');
            // build mini details
            miniDetails.appendChild(voteAverage);
            miniDetails.appendChild(voteCount);
            miniDetails.appendChild(releaseDate);
            // build details
            details.appendChild(title);
            details.appendChild(overview);
            if(movie.overview.length >175){
                details.appendChild(readMore);
            };
            details.appendChild(fullText);
            details.appendChild(miniDetails);
            // build li
            li.appendChild(image);
            li.appendChild(details);
            // add to dom
            ul.appendChild(li);
            // add event listener to show details
            li.addEventListener('click', (e) => {
                // toggle additional details view
                const selectedMovie = e.target.parentNode;
                selectedMovie.classList.toggle('selected');
                const additionalDetails = selectedMovie.childNodes[1];
                // wait until expanded to show details
                if( !additionalDetails.classList.contains('hidden')){
                    additionalDetails.classList.add('hidden');
                } else{
                    setTimeout( function(){
                        additionalDetails.classList.remove('hidden');
                    }, 1500);
                }
            });
            // show item
            setTimeout( function(){
                li.classList.remove('hide');
            }, 500);
            // add readMore event listeners
            readMore.addEventListener('click', (e) => {
                const readMore = e.target;
                // hide current and previous text
                readMore.previousSibling.style.display = "none";
                readMore.style.display = "none";
                // show full text
                readMore.nextSibling.style.display = "block";
                // increase grand parent width
                readMore.parentNode.parentNode.classList.add('extraWide');
            });
        });
    } catch( err) {
        console.log(err);
    }
    // add ul event listeners for scroll movement
    ul.addEventListener('mousedown', (e) => {
        isDown = true;
        ul.classList.add('active');
        // grab start point
        startX = e.pageX - ul.offsetLeft; // deducts any margin
        scrollLeft = ul.scrollLeft;
    });

    ul.addEventListener('mouseleave', () => {
        isDown = false;
        ul.classList.remove('active');
    });

    ul.addEventListener('mouseup', () => {
        isDown = false;
        ul.classList.remove('active');
    });

    ul.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        // grab end point
        const endX = e.pageX - ul.offsetLeft; // deducts any margin
        // difference
        const walk = (endX - startX) * 2; // increase scroll effect
        // and apply
        ul.scrollLeft = scrollLeft - walk;
    });
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
const loader = document.querySelector('.loader');
const loaderBack = loader.parentNode;
loader.classList.remove('hidden');
setTimeout(function(){
    loader.classList.add('hidden');
    setTimeout(function(){
        loaderBack.classList.add('hidden');
    }, 500);
}, 1500);