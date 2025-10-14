const dataGenre = [
  { "id": 28, "name": "Action" },
  { "id": 12, "name": "Adventure" },
  { "id": 16, "name": "Animation" },
  { "id": 35, "name": "Comedy" },
  { "id": 80, "name": "Crime" },
  { "id": 99, "name": "Documentary" },
  { "id": 18, "name": "Drama" },
  { "id": 10751, "name": "Family" },
  { "id": 14, "name": "Fantasy" },
  { "id": 36, "name": "History" },
  { "id": 27, "name": "Horror" },
  { "id": 10402, "name": "Music" },
  { "id": 9648, "name": "Mystery" },
  { "id": 10749, "name": "Romance" },
  { "id": 878, "name": "Science Fiction" },
  { "id": 10770, "name": "TV Movie" },
  { "id": 53, "name": "Thriller" },
  { "id": 10752, "name": "War" },
  { "id": 37, "name": "Western" }
]
const videoPriority = [
  "Trailer",
  "Teaser",
  "Clip",
  "Featurette",
  "Behind the Scenes",
  "Bloopers",
  "Opening Credits",
  "Ending Credits",
  "Promo",
  "Interview",
  "Deleted Scene",
  "Making Of",
  "Other"
];


setTimeout(async ()=> {
    const url = new URLSearchParams(window.location.search);
    const idMovie = url.get('id');
    const typeData = url.get('typeData');

    // container Home
    const movie = await getApi(idMovie, typeData);
    const containerHome = document.getElementById('containerHome');
    const uiContainerHome = loadUiHome(movie, typeData);

    containerHome.innerHTML += uiContainerHome;
    document.getElementById('storyLine').innerHTML = movie.overview;

    document.addEventListener('click', (el) => {
        if(el.target.classList.contains('btn-home')){
            handleButton(el.target);
        }
    })

    // cast
    loadUiCast(movie.id, typeData);

    // season series
    if(typeData === 'series') seasonsOfSeries(movie.seasons)
    reviewsVideo(idMovie, typeData);
    
    // episode
    document.addEventListener('click', (el) => {
        if(el.target.classList.contains('swapSeason')) {
            const seasonNow = el.target.textContent.split(' ')[1];
            seasonsOfSeries(movie.seasons, seasonNow)
        }
    })    

    // replace content on season section
    document.addEventListener('click', el => {
        const item = el.target;
        if(item.classList.contains('swapContentOnSeason')){
            if(!item.classList.contains('activeContent')) {
                swapContentOnSeason(item);
            }
        }
    })

    similarVideo(idMovie,typeData);
    recomendationVideo(idMovie,typeData);

},0)

async function recomendationVideo(id, typeData){
    const container = document.getElementById('containerRecomendationVideo');
    const respon = await getApi(id+'/recommendations', typeData, '&certification_country=US&certification.lte=G&sort_by=popularity.desc&with_genres=16')
    let uiCardsRecomendation =  ``;
    respon.results.forEach(data => {
        const ui = `<div class="flex-none w-1/6">
                <div class="w-full aspect-2/3">
                    <img src="https://image.tmdb.org/t/p/original${data.poster_path}" class="w-full h-full object-cover rounded-xl" alt="">
                </div>
                <div class="flex h-3 justify-between mx-1 mt-1">    
                    <div class="flex">
                        <img src="img/star-f.png" alt="" class="w-3 h-3 mr-1" loading="lazy">
                        <p class="leading-none text-sm">${data.vote_average.toFixed(2)}</p>
                    </div>
                    <div class="flex">
                        <img src="img/fire.png" class="h-4 w-4 ml-3 -mt-0.5" alt="">
                        <p class="leading-none text-sm">${data.popularity}</p>
                    </div>
                </div>
            </div>`
        uiCardsRecomendation += ui;
    })
    container.previousElementSibling.textContent = `Recomendations ${typeData} for you`
    container.innerHTML += uiCardsRecomendation;
} 
async function similarVideo(id, typeData){
    const container = document.getElementById('containerSimilarVideo');
    const respon = await getApi(id+'/similar', typeData, '&certification_country=US&certification.lte=G&sort_by=popularity.desc&with_genres=16')
    
    let uiCardsSimilar =  ``;
    respon.results.forEach(data => {
        const ui = `<div class="flex-none w-1/6">
                <div class="w-full aspect-2/3">
                    <img src="https://image.tmdb.org/t/p/original${data.poster_path}" class="w-full h-full object-cover rounded-xl" alt="">
                </div>
                <div class="flex h-3 justify-between mx-1 mt-1">    
                    <div class="flex">
                        <img src="img/star-f.png" alt="" class="w-3 h-3 mr-1" loading="lazy">
                        <p class="leading-none text-sm">${data.vote_average.toFixed(2)}</p>
                    </div>
                    <div class="flex">
                        <img src="img/fire.png" class="h-4 w-4 ml-3 -mt-0.5" alt="">
                        <p class="leading-none text-sm">${data.popularity}</p>
                    </div>
                </div>
            </div>`
        uiCardsSimilar += ui;
    })
    container.previousElementSibling.textContent = `Similar ${typeData} for you`
    container.innerHTML += uiCardsSimilar;
} 

function swapContentOnSeason(item){
    const siblings = item.parentElement.children
    const sibling = Array.from(siblings).filter(e => e!=item)
    const containerSeason = document.getElementById('contentSeasons');
    const containerReview = document.getElementById('contentReview');

    containerSeason.classList.toggle('block')
    containerSeason.classList.toggle('hidden')
    containerReview.classList.toggle('flex')
    containerReview.classList.toggle('hidden')

    sibling[0].classList.remove('activeContent');
    item.classList.add('activeContent');

}

async function reviewsVideo(id, type){
    const typeData = type == 'series' ? 'tv' : 'movie'
    const container = document.getElementById('contentReview');

    const respon = await fetch(`https://api.themoviedb.org/3/${typeData+'/'+id}/reviews?api_key=8482e16292527bd819173faa9e3fb365`)
                    .then(e => e.json()).then(e => e.results);
    let cardreviews = ``;
    respon.forEach(data => {
        const iconProfile = (data.author_details.avatar_path == null) ? `<i class="fa fa-user px-2.5 py-2 border-2 border-gray-500 text-gray-500 rounded-full" aria-hidden="true"></i>` : ` <img class="w-1/4 aspect-square rounded-full mx-auto" src="https://image.tmdb.org/t/p/original${data.author_details.avatar_path}">`
        const uiCard = ` <div class="flex-none w-1/8 p-1 text-center">
        ${iconProfile}
        <h2 class="text-sm font-semibold">${data.author}</h2>
        <p class="text-2xs text-justify">"${data.content}"</p>
      </div>`
      cardreviews += uiCard
    })

    container.innerHTML +=cardreviews;
}

async function seasonsOfSeries(data, season){
    const containerContentSeasons = document.getElementById('contentSeasons');
    const seasons = data.map(e => ({name : e.name, episode_count : e.episode_count}));
    const seasonNow = (season == undefined) ? {name :seasons[0].name, episode_count : seasons[0].episode_count} : {name : seasons[season-1].name,  episode_count : seasons[season-1].episode_count};
    const uiDropdown = seasons.map(e => `<li><a class="whitespace-nowrap swapSeason">${e.name}</a></li>`).join('');
    const episodeOnSeasonNow = await epsiodeInSeries(seasonNow);

    let cardsEpisode = ``;

    episodeOnSeasonNow[0].forEach(data => {
        const uiCardEpisode = ` <div class="flex-none w-1/4 aspect-video rounded-xl bg-black relative cursor-pointer">
        <img src="https://image.tmdb.org/t/p/original${data.still_path}" class="w-full h-full object-cover rounded-xl opacity-80" alt="">
        <div class="w-full h-full absolute bottom-0 rounded-xl flex justify-center items-center text-6xl" id="coloring">
          <i class="fa fa-play-circle opacity-60" aria-hidden="true"></i>
        </div>
        <div class="absolute bottom-0 p-2">
          <h1 class="text-md font-semibold">Chapter ${data.episode_number}</h1>
          <p class="text-xs">${data.overview}</p>
        </div>
      </div>`
      cardsEpisode += uiCardEpisode;
    })

    const ui = `
    <h1 class="font-semibold text-xl">${seasonNow.name}</h1>
    <div class="w-full flex justify-between">
      <h2 class="my-1 font-semibold text-xl">${episodeOnSeasonNow[1]}</h2>
      <div class="dropdown dropdown-start">
        <div tabindex="0" role="button" class="px-4 py-1 rounded-md text-sm cursor-pointer">${seasonNow.name}<i class="fa fa-caret-down ml-1" aria-hidden="true"></i> </div>
          <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm">
            ${uiDropdown}
          </ul>
      </div>
      </div>
    <div class="w-full flex gap-3 text-white overflow-x-auto">
      ${cardsEpisode}
  
    </div>`;
    containerContentSeasons.innerHTML = ui;
}

async function epsiodeInSeries(data){
    const url = new URLSearchParams(window.location.search);
    const idMovie = url.get('id');  
    const typeData = url.get('typeData') == 'series' ? 'tv' : 'movie'

    let respon = [];
    let num_episode = 0
    for(let i=1; i <= data.episode_count; i++){
        const temp = await fetch(`https://api.themoviedb.org/3/${typeData}/${idMovie}/season/${data.name.split(' ')[1]}/episode/${i}?api_key=8482e16292527bd819173faa9e3fb365`)
                    .then(e => e.json()).then(e => e);
        if(temp != undefined){
            respon.push(temp)
            num_episode +=1;
        } 
    }
    const stringEpisode = (num_episode > 1) ? `1 - ${num_episode} Episode` : `${num_episode} Episode`;
    return [respon, stringEpisode]
}

async function loadUiCast(id, type){
    const typeData = (type == 'series') ? 'tv' : 'movie';
    const respon = await fetch(`https://api.themoviedb.org/3/${typeData }/${id}/credits?api_key=8482e16292527bd819173faa9e3fb365`)
    .then(e => e.json())
    .then(e => (e.length===0)?'Movie Not Found' : e);

    const cast = respon.cast;
    const containerCast = document.getElementById('containerCast')
    let cardCasts = ``;
    const uiCard = (data) => `<div class="flex-none w-[16.6%] h-20 flex items-center gap-1.5">
                  <div class="w-[30%] aspect-1/1">
                    <img src="https://image.tmdb.org/t/p/original${data.profile_path}" class=" w-full h-full object-cover rounded-full" alt="">
                  </div>
                  <div class="w-[70%]">
                    <h1 class="text-md font-semibold">${data.name}</h1>
                    <p class="text-xs">${data.character || data.job}</p>
                  </div>
                </div>`;
    if(cast.length == 0){
        respon.crew.forEach(data => cardCasts += (data.profile_path == null) ? '' : uiCard(data));
    }else{
        cast.forEach(data => cardCasts += (data.profile_path == null) ? '' : uiCard(data));
    }

    containerCast.innerHTML += cardCasts;
}

function loadUiHome(data, typeData){
    let firstList = '';
    if(typeData == 'series'){
        firstList = (data.seasons == 'undefined') ? data.times : data.seasons[data.seasons.length-1].name;
    }
    function findGenre(values){
        const genre = values.map(g => {
            const temp = dataGenre.find(e => e.id === g.id);
            return temp ? temp.name : null; 
        })
        return genre;
    }
    function uiGenre(values){
        return values.map((e,i) => {
            if(values[i+1] != undefined){
                return `<p class="text-xs sm:text-sm text-white">${e}</p> <div class="w-[2px] h-4 bg-white"></div>`
            }else{
                return `<p class="text-xs sm:text-sm text-white">${e}</p>`
            }
        }).join('');
    }
    const genre = findGenre(data.genres)
    return `<img src="https://image.tmdb.org/t/p/original${data.backdrop_path}" class="h-full w-full object-cover" alt="">
    <div class="absolute w-full h-1/3 bottom-0 z-10 grid grid-cols-2 gap-1">
        <div class="flex flex-col gap-1 px-4 text-white">
            <button class="w-16 h-6.5 rounded-xl bg-gray-800 text-white text-sm">${typeData}</button>
            <h1 class="mt-4 text-4xl font-bold">${data.title || data.name}</h1>
            <ul class="mt-3 flex flex-col  gap-1 sm:gap-5.5 text-xs sm:text-sm">
                <li class="whitespace-nowrap">${firstList || ''} </li>
                <li class="${firstList === '' ? '' : 'list-disc'} whitespace-nowrap">${data.release_date || data.last_air_date}</li>
                <li class="before:content-['•'] before:mr-2 before:text-lg before:leading-0 flex gap-1.5 items-center">${uiGenre(genre)}</li>
            </ul>
            <div class="mt-2">
                <button class="text-sm px-3 py-[9px] rounded-lg bg-green-700 mr-5 cursor-pointer btn-home">
                    <i class="fa fa-play-circle" aria-hidden="true"></i> Continue Wacthing
                </button>
                <button class="text-sm px-3 py-2 rounded-lg border-white border-[1px] cursor-pointer btn-home">
                    <i class="fa fa-bookmark-o" aria-hidden="true"></i> Add Wacthlist
                </button>
            </div>
        </div>
        <div class="text-white flex justify-end items-end py-3.5 px-4 gap-3">
             <button class="text-sm px-7 py-2 rounded-lg border-[1px] border-gray-500 cursor-pointer btn-home" data-link='${data.backdrop_path}' data-title='${data.title}'>
                  <i class="fa fa-download" aria-hidden="true"></i> Download
                </button>
              <button class="text-sm px-10 py-2 rounded-lg border-gray-500 border-[1px] cursor-pointer btn-home">
                  <i class="fa fa-share-alt" aria-hidden="true"></i> Share
              </button>
              <button class="text-sm px-10 py-2 rounded-lg border-gray-500 border-[1px] cursor-pointer btn-home">
                  <i class="fa fa-thumbs-o-up w-3" aria-hidden="true"></i> Like
              </button>
        </div>
    </div>`
}
function handleButton(btn){
    const btnHome = document.querySelectorAll('.btn-home');
    const findBtn = Array.from(btnHome).indexOf(btn);
    const icon = btn.children[0];

    switch(findBtn){
        case 0 :
            wacthingMovie();
            break;
        case 1 :
            icon.classList.toggle('fa-bookmark-o');
            icon.classList.toggle('fa-bookmark');
            break;
        case 2 :
            const link = btn.dataset.link;
            const title = btn.dataset.title;
            // downloadImg(link, title)
            break;
        case 3 :
            sharePage();
            break;
        case 4 :
            icon.classList.toggle('fa-thumbs-o-up');
            icon.classList.toggle('fa-thumbs-up');
            break;

    }
}
// masih belum ketemu solusi nya
async function downloadImg(path, title){
    // const res = await fetch(`https://image.tmdb.org/t/p/original${path}`);
    // const blob = await res.blob();

    const link = document.createElement('a');
    link.href = `https://image.tmdb.org/t/p/original${path}`;
    link.download = title;
    document.body.appendChild(link)
    link.click();
    document.link.remoChild(link)
}
async function wacthingMovie(){
    const url = new URLSearchParams(window.location.search);
    const id = url.get('id');
    const type = url.get('typeData');

    const typeData = (type == 'series') ? 'tv' : 'movie';
    const res = await fetch(`https://api.themoviedb.org/3/${typeData}/${id}/videos?api_key=8482e16292527bd819173faa9e3fb365`)
                .then(e => e.json())
                .then(e => (e.length===0)?'Movie Not Found' : e.results);
    const respon = await checkTrailerMovie(res);
    if(!respon){
        videoNotFound(type)
    }else{
        wacthVideoInAlert(respon);
    }

}

async function checkTrailerMovie(data){
    if(data.length == 0) return false

    const fixsData = data.filter(e => e.site === 'YouTube');
    if(data.length == 0) return false 

    let result = false;
    for(let a of videoPriority){
        for(let b of fixsData){
            if(a === b.type){
                const checkEmbeded = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=status&id=${b.key}&key=AIzaSyAS51CG4c3X3MPBvXGWIM1XdNwXIJwb9_E`)
                .then(e => e.json())
                .then(e => (e.length===0)?'Movie Not Found' : e);
                if(checkEmbeded.items.length != 0){
                    const status = checkEmbeded.items[0].status.embeddable;
                    if(status){
                        result = b.key;
                        break;
                    }
                }

            }
        }
        if(result !== false) break
    }
    return result;

}

function wacthVideoInAlert(key){
    const alert = `<iframe
        class="w-full h-full"
        src="https://www.youtube.com/embed/${key}"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        ></iframe>`;
    document.getElementById('contentModal').innerHTML = alert; 
    my_modal_2.showModal()
}

function videoNotFound(type){
    const typeData = type == 'series' ? 'Series' : 'Movie'
    const alert = ` <div class="h-9% w-4"></div>
                    <div role="alert" class="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>${typeData} not found on YouTube</span>
                   </div>`
    document.getElementById('alertVideoNotFound').innerHTML += alert;
    setTimeout(() => {
        document.getElementById('alertVideoNotFound').innerHTML = '';
    },3000)
}

function stopVideo(){
    setTimeout(() => {
        document.getElementById('contentModal').innerHTML = ''; 
    }, 200)
}

function sharePage(){
    if(navigator.share){
        navigator.share({
            title : document.title,
            url : window.location.href
        })
    }else{
        navigator.clipboard.writeText(windown.location.href);
        alert('link telah di copy')
    }
}

function getApi(id, type, query){
    const typeData = (type == 'series') ? 'tv' : 'movie';
    const overQuery = (query == undefined) ? '' : query;
    let url =`https://api.themoviedb.org/3/${typeData}/${id}?api_key=8482e16292527bd819173faa9e3fb365${overQuery}` ;
    return fetch(url)
    .then(e => e.json())
    .then(e => (e.length===0)?'Movie Not Found' : e);
}