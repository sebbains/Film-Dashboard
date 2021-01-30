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

const movieList = document.querySelector('.movieList');

async function getMovies() {
    // grab selections
    // const fromCurrency = inputOriginalCurrency.value;
    // const toCurrency = inputNewCurrency.value;
    const imagePath = 'https://image.tmdb.org/t/p/w500/';
    // personal key
    const apiKey = '838b0a3bf7b99519f89a62d82df2b50a';
    // encode currency and build the query
    // const fromCurrencyURI = encodeURIComponent(fromCurrency);
    // const toCurrencyURI = encodeURIComponent(toCurrency);
    // const query = fromCurrencyURI + "_" + toCurrencyURI;
    // add the key and query to final url
    const url =
      'https://api.themoviedb.org/3/discover/movie?api_key=' +
      apiKey +
      '&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1'
    // send it
    const response = await fetch(url);
    const data = await response.json();
    // const FXRate = data[query];
    const movies = data.results;
    // console.log(movies);
    movies.forEach(movie => {
        // create list item
        const li = document.createElement('li');
        li.classList.add('movie');
        li.classList.add('hide');
        // create image
        const image = document.createElement('img');
        image.classList.add('movieImage');
        image.src = imagePath + movie.poster_path;
        // create title
        const title = document.createElement('span');
        title.textContent = movie.title;
        // build and add
        li.appendChild(image);
        li.appendChild(title);
        movieList.appendChild(li);
        // show item
        setTimeout( function(){
            li.classList.remove('hide');
        }, 500);
    });
}