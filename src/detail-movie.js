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
    skeletonLoadCards();

    const url = new URLSearchParams(window.location.search);
    const idMovie = url.get('id');
    const typeData = url.get('typeData');

    // container Home
    const movie = await getApi(idMovie, typeData);
    const containerHome = document.getElementById('containerHome');
    const uiContainerHome = loadUiHome(movie, typeData);

    if(containerHome){
        containerHome.innerHTML += uiContainerHome;
        document.getElementById('storyLine').innerHTML = movie.overview;
    }

    document.addEventListener('click', (el) => {
        if(el.target.classList.contains('btn-home')){
            handleButton(el.target);
        }
    })

    // cast
    // loadUiCast(movie.id, typeData);

    // season series
    if(typeData === 'series') seasonsOfSeries(movie.seasons);
    // reviewsVideo(idMovie, typeData);
    
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

    // similarVideo(idMovie,typeData);
    // recomendationVideo(idMovie,typeData);
    
},0)
// primary content
async function recomendationVideo(id, typeData){
    const container = document.getElementById('containerRecomendationVideo');
    const respon = await getApi(id+'/recommendations', typeData, '&certification_country=US&certification.lte=G&sort_by=popularity.desc&with_genres=16')
    let uiCardsRecomendation =  ``;
    respon.results.forEach((data, i) => {
        if(i < 12){
        const ui = `<div class="flex-none md:w-[calc(25%-8px)] mx-[4px] lg:w-[calc(16.666%-8px)] sm:w-[calc(33.333%-8px)] w-[calc(50%-8px)]">
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
        }
    })
    container.innerHTML = '';
    container.parentElement.children[0].textContent = `Recomendations ${typeData} for you`;
    container.innerHTML += uiCardsRecomendation;
} 
async function similarVideo(id, typeData){
    const container = document.getElementById('containerSimilarVideo');
    const respon = await getApi(id+'/similar', typeData, '&certification_country=US&certification.lte=G&sort_by=popularity.desc&with_genres=16')
    
    let uiCardsSimilar =  ``;
    respon.results.forEach((data, i) => {
        if(i < 12){
        const ui = `<div class="flex-none md:w-[calc(25%-8px)] mx-[4px] lg:w-[calc(16.666%-8px)] sm:w-[calc(33.333%-8px)] w-[calc(50%-8px)]">
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
        }
    })
    container.innerHTML = '';
    container.parentElement.children[0].textContent = `Similar ${typeData} for you`
    container.innerHTML += uiCardsSimilar;
} 
let scrollListener = [null, null, null];
function handleBtnArrow(btn){
    const arrowType = btn.dataset.arrow;
    const i = btn.dataset.number;
    const container = btn.parentElement.children[2];
    const sibling = arrowType === "right" ? btn.parentElement.children[1] : btn.parentElement.children[3];

    container.scrollLeft += (arrowType == "right") ? container.clientWidth : -container.clientWidth;
    sibling.classList.replace('hidden', 'absolute')

    let scrollTimeOut;
    if (scrollListener[i]) container.removeEventListener("scroll", scrollListener[i]);
    
    scrollListener[i] = function() {
        clearTimeout(scrollTimeOut);
        scrollTimeOut = setTimeout(() => {
            cekPosisiScroll(btn, container);
        }, 120);
    };

    container.addEventListener("scroll", scrollListener[i]);

    function cekPosisiScroll(button, container){
        if(container.scrollWidth - (container.scrollLeft + container.clientWidth ) <= 2 || container.scrollLeft === 0){
            button.classList.replace('absolute', 'hidden');
        }
    }
    
}

// skeleton load
function skeletonLoadCards(){
    let uiCards = ``;
    const containerSimilar = document.getElementById('containerSimilarVideo');
    const containerRecomendation = document.getElementById('containerRecomendationVideo');

    for(let i=0; i<6; i++){
        uiCards +=`<div class="flex-none md:w-[calc(25%-8px)] mx-[4px] lg:w-[calc(16.666%-8px)] sm:w-[calc(33.333%-8px)] w-[calc(50%-8px)] aspect-3/4 skeleton"> </div>`
    }

    containerSimilar.innerHTML += uiCards;
    containerRecomendation.innerHTML += uiCards;
}
function skeletonLoadEpisode(){
    let ui = ``;
    const container = document.getElementById('contentSeasons');

    for(let i=0; i<4; i++){
        ui += `<div class="flex-none w-[calc(50%-11px)] sm:w-[calc(33.33%-11px)] lg:w-[calc(25%-11px)] aspect-video rounded-xl skeleton"> </div>`
    }
    container.innerHTML += `<div class="w-full flex gap-3">${ui}</div>`;
}

// About Season
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

    if(item.textContent == 'Reviews') checkReviewsVideo();
}

// About reviews
async function reviewsVideo(id, type){
    const typeData = type == 'series' ? 'tv' : 'movie'
    const container = document.getElementById('contentReview');

    const respon = await fetch(`https://api.themoviedb.org/3/${typeData+'/'+id}/reviews?api_key=8482e16292527bd819173faa9e3fb365`)
                    .then(e => e.json()).then(e => e.results);
    let cardreviews = ``;
    respon.forEach(data => {
        const srcIconProfile = (data.author_details.avatar_path == null) ? '../img/profile-picture.png' : `https://image.tmdb.org/t/p/original${data.author_details.avatar_path}`;
        const uiCard = ` <div class="relative flex-none w-[calc(50%-4px)] sm:w-[calc(33.33%-8px)] md:1/4 lg:w-[calc(16.666%-8px)] bg-slate-200 rounded-md h-40 p-1 text-center">
        <img class="w-1/4 sm:w-1/6 lg:w-1/4 aspect-square rounded-full mx-auto" src="${srcIconProfile}">
        <h2 class="text-sm font-semibold">${data.author}</h2>
        <div class="h-[48%] overflow-hidden px-0.5"> 
            <p class="text-2xs leading-3.5 text-justify text-review">"${data.content}"</p>
        </div>
        <p class="leading-2 text-xs text-start tracking-wider hidden detail-review-video">....
            <button class="underline text-2xs text-blue-600 cursor-pointer" data-img="${srcIconProfile}" data-author="${data.author}" data-content="${data.content}" onclick="openModalReview(this)">Detail </button>
        </p>
      </div>`
      cardreviews += uiCard;
    })
    if(cardreviews === '') cardreviews = `<h1 class="text-xl font-bold text-gray-400"> Belum ada review </h1>`
    
    container.innerHTML +=cardreviews;
}
function openModalReview(btn){
    const img = btn.dataset.img;
    const author = btn.dataset.author;
    const content = btn.dataset.content;
    const modalReview = document.getElementById('my_modal_3');
    const uiModalReview = `<div class="modal-box">
                            <form method="dialog">
                            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onclick="clearModalReview()">✕</button>
                            </form>
                            <img class="w-1/8 aspect-square rounded-full mx-auto" src="${img}">
                            <h2 class="text-sm text-center font-semibold">${author}</h2>
                            <div class="h-full overflow-hidden"> 
                                <p class="text-2xs leading-3.5 text-justify">"${content}"</p>
                            </div>
                        </div>`;
     
    modalReview.innerHTML += uiModalReview;
    modalReview.showModal();
}
function clearModalReview(){
    setTimeout(() => {
        const modalReview = document.getElementById('my_modal_3');
        modalReview.innerHTML ='';
    }, 50)
}
function checkReviewsVideo(){
    const container = document.getElementById('contentReview');
    
    const elements = container.querySelectorAll('.text-review');
    const detailReview = container.querySelectorAll('.detail-review-video');
    Array.from(elements).forEach((el,i) => {
        const bottomContainer = container.children[i].getBoundingClientRect().bottom;
        const bottomElement = el.getBoundingClientRect().bottom;
        if(bottomElement > bottomContainer) detailReview[i].classList.remove('hidden');
    })
}

// About Seasons
async function seasonsOfSeries(data, season){
    const containerContentSeasons = document.getElementById('contentSeasons');
    containerContentSeasons.innerHTML = '';
    skeletonLoadEpisode();
    const numberSeason = (season == undefined) ? data[0].season_number : season;
    const seasons = data.map(e => ({id : e.season_number, episode_count : e.episode_count})); 

    function checkSeasonNow(value, number, specialSeason){
        let temp = value.find(e => e.id == number);
        if(temp.id == 0) temp.id = specialSeason ;
        return temp;
    }
    const seasonNow = checkSeasonNow(seasons, numberSeason, data[0].name);
    const uiDropdown = seasons.map(e => `<li><a class="whitespace-nowrap swapSeason">Seasons ${e.id == 0 ? data[0].name : e.id}</a></li>`).join('');
    const episodeOnSeasonNow = await epsiodeInSeries(seasonNow);

    let cardsEpisode = ``;
    episodeOnSeasonNow[0].forEach(data => {
        const uiCardEpisode = ` <div class="flex-none snap-start w-[calc(50%-11px)] sm:w-[calc(33.33%-11px)] lg:w-[calc(25%-11px)] aspect-video rounded-xl bg-black relative cursor-pointer">
        <img src="https://image.tmdb.org/t/p/original${data.still_path}" class="w-full h-full object-cover rounded-xl opacity-80" alt="">
        <div class="w-full h-full absolute bottom-0 rounded-xl flex justify-center items-center text-2xl sm:text-4xl md:text-6xl" id="coloring">
          <i class="fa fa-play-circle opacity-60" aria-hidden="true"></i>
        </div>
        <div class="absolute bottom-0 max-h-full overflow-y-auto px-2 content-card-episode">
          <h1 class="text-sm sm:text-md font-semibold">Chapter ${data.episode_number}</h1>
          <p class="text-2xs leading-3 text-overview desc clamp">${data.overview}</p>
        </div>
        <div class="absolute hidden bottom-1 px-2 detail-text-overview"> 
            <p class=" leading-2 text-xs text-start tracking-wider">
                <button class="underline text-2xs cursor-pointer text-blue-400" onclick="detailOverview(this)">Lebih banyak </button>
            </p>
        </div>
      </div>`
      cardsEpisode += uiCardEpisode;
    })

    const ui = `
    <h1 class="font-semibold text-xl">Seasons ${seasonNow.id}</h1>
    <div class="w-full flex justify-between">
      <h2 class="my-1 font-semibold text-xl">${episodeOnSeasonNow[1]}</h2>
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="px-4 py-1 rounded-md text-sm cursor-pointer">Seasons ${seasonNow.id}<i class="fa fa-caret-down ml-1" aria-hidden="true"></i> </div>
          <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box p-2 shadow-sm absolute z-100">
            ${uiDropdown}
          </ul>
      </div>
      </div>
    <div class="w-full px-2 md:px-4 relative"> 
        <h1 class="text-2xl font-semibold"></h1>
        <button class="hidden invisible sm:visible shadow-xs shadow-gray-500 sm:cursor-pointer z-50 absolute bottom-1/2 translate-y-1/3 left-0 w-8 h-8 bg-white text-[#555] rounded-full text-3xl text-center font-bold" data-number="0" data-arrow="left" onclick="handleBtnArrow(this)"><
        </button>
        <div class="w-full flex gap-3 text-white overflow-y-hidden overflow-x-auto snap-x container-card-episode">
            ${cardsEpisode}
        </div>
        <button class="z-50 sm:cursor-pointer shadow-xs ${episodeOnSeasonNow[0].length<4 ? 'hidden' : ''} shadow-gray-500 invisible sm:visible absolute bottom-1/2 translate-y-1/3 right-2 w-8 h-8 bg-white text-[#555] rounded-full text-3xl text-center font-bold" data-number="0" data-arrow="right" onclick="handleBtnArrow(this)">>
        </button>
    </div>`;
    containerContentSeasons.innerHTML = '';
    containerContentSeasons.innerHTML = ui;
    checkCardEpisodeInseries(containerContentSeasons);
}
async function epsiodeInSeries(data){
    const url = new URLSearchParams(window.location.search);
    const idMovie = url.get('id');  
    const typeData = url.get('typeData') == 'series' ? 'tv' : 'movie';
    const res = await fetch(`https://api.themoviedb.org/3/${typeData}/${idMovie}/season/${data.id}?api_key=8482e16292527bd819173faa9e3fb365`)
                    .then(e => e.json()).then(e => e);
    const stringEpisode = (res.episodes.length > 1) ? `1 - ${res.episodes.length} Episode` : `${res.episodes.length} Episode`;
    return [res.episodes, stringEpisode]
}
function detailOverview(button){
    const contentCard = button.parentElement.parentElement.previousElementSibling.querySelector('.desc');

    contentCard.classList.toggle('clamp');
    contentCard.classList.toggle('expanded');
    button.textContent = (button.textContent=="Lebih banyak ") ? "Lebih sedikit" : "Lebih banyak";
}
function checkCardEpisodeInseries(container){
    const containerCard = container.querySelector('.container-card-episode');
    const card = containerCard.children;
    const textOverview = container.querySelectorAll('.text-overview');

    for(let i=0; i<textOverview.length; i++){
        const minHeight = textOverview[i].clientHeight + (textOverview[i].clientHeight/2);
        if(textOverview[i].scrollHeight > (minHeight === 0 ? 0 : minHeight-1)) showButtonDetail(card[i]);
    }

    function showButtonDetail(container){
        const buttonDetail = container.querySelector('.detail-text-overview');
        const contentCard = container.querySelector('.content-card-episode');

        buttonDetail.classList.replace('hidden', 'block')
        contentCard.classList.add('bottom-3');
    }
}

// About Cast
async function loadUiCast(id, type){
    const typeData = (type == 'series') ? 'tv' : 'movie';
    const respon = await fetch(`https://api.themoviedb.org/3/${typeData }/${id}/credits?api_key=8482e16292527bd819173faa9e3fb365`)
    .then(e => e.json())
    .then(e => (e.length===0)?'Movie Not Found' : e);

    const cast = respon.cast;
    const containerCast = document.getElementById('containerCast')
    let cardCasts = ``;
    const uiCard = (data) => `<div class="flex-none w-1/3 sm:w-1/4 lg:w-[calc(16.6%-3px)] h-min-20 flex flex-col md:flex-row items-center gap-1.5">
                  <div class="flex-none w-[50%] md:w-[30%]">
                    <img src="https://image.tmdb.org/t/p/original${data.profile_path}" class=" w-full aspect-1/1 object-cover rounded-full" alt="">
                  </div>
                  <div class="w-full md:w-[70%] h-full flex flex-col justify-center text-center md:text-start">
                    <h1 class="text-xs md:text-md font-semibold original-name">${data.name}</h1>
                    <p class="text-[9px] md:text-[11px] leading-3.5 role">${data.character || data.job}</p>
                  </div>
                </div>`;
    if(cast.length == 0){
        respon.crew.forEach(data => cardCasts += (data.profile_path == null) ? '' : uiCard(data));
    }else{
        cast.forEach(data => cardCasts += (data.profile_path == null) ? '' : uiCard(data));
    }

    containerCast.innerHTML += cardCasts;
    checkCardCast(containerCast);
    
}

function checkCardCast(container){
    const cardCast = container.children;
    Array.from(cardCast).forEach(el => {
        const name = el.querySelector('.original-name');
        const totalLineName = Math.round(name.clientHeight / parseFloat(window.getComputedStyle(name).lineHeight));

        const role = el.querySelector('.role');
        const totalLineRole = Math.round(role.clientHeight / parseFloat(window.getComputedStyle(role).lineHeight));

        if(totalLineName>1){
            name.classList.add('leading-4')        
        } else if(totalLineName>1 && totalLineRole>1){
            name.classList.add('leading-4 text-sm')            
            role.classList.add('leading-3 text-2xs')            
        }    
    })
}

// Home Content
function loadUiHome(data, typeData){
    const storyLine = document.getElementById('storyLine');
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
    storyLine.textContent += data.overview;
    const genre = findGenre(data.genres)
    return `<img src="https://image.tmdb.org/t/p/original${data.backdrop_path}" class="h-full w-full object-cover" alt="">
    <div class="absolute w-full min-h-1/3 bottom-0 z-10 grid md:grid-cols-2 gap-1">
        <div class="relative w-full flex flex-col justify-end gap-1 px-4 pb-3.5 text-white" id="partOfContainerHome">
            <button class="w-16 h-6.5 rounded-xl bg-gray-800 text-white text-sm">${typeData}</button>
            <h1 class="mt-1 md:mt-4 text-4xl font-bold">${data.title || data.name}</h1>
            <ul class="mt-3 w-full flex flex-wrap md:flex-nowrap gap-x-5.5 text-xs sm:text-sm">
                <li class="w-auto whitespace-nowrap">${firstList || ''} </li>
                <li class="w-1/2 md:w-auto ${firstList === '' ? '' : 'list-disc'} whitespace-nowrap">${data.release_date || data.last_air_date}</li>
                <li class="w-full md:w-auto md:before:content-['•'] md:before:mr-2 md:before:text-lg md:before:leading-0 flex gap-1.5 items-center">${uiGenre(genre)}</li>
            </ul>
            <div class="mt-2">
                <button class="text-sm w-[55%] lg:w-[35%] py-[9px] rounded-lg bg-green-700 mr-2 lg:mr-5 cursor-pointer btn-home whitespace-nowrap" id="continueWacthing">
                    <i class="fa fa-play-circle" aria-hidden="true"></i> Continue Wacthing
                </button>
                <button class="hidden md:inline-block text-sm w-[40%] lg:w-[28%] py-2 rounded-lg border-white border-[1px] cursor-pointer btn-home whitespace-nowrap" id="addWacthlist">
                    <i class="fa fa-bookmark-o" aria-hidden="true"></i> Add Wacthlist
                </button>
                <button class="md:hidden mr-2 text-sm w-[23%] py-2 rounded-lg border-gray-500 border-[1px] cursor-pointer btn-home whitespace-nowrap" id="like">
                  <i class="fa fa-thumbs-o-up w-3" aria-hidden="true"></i> Like
                </button>
                <button class="md:hidden text-sm w-[13%] py-2 rounded-lg border-gray-500 border-[1px] cursor-pointer " onclick="detailButtons(this)">
                  <i class="fa fa-caret-up" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        <div class="hidden md:flex text-white justify-end items-end py-3.5 px-4 gap-3">
             <button class="text-sm w-[31%] lg:w-[20%] py-2 rounded-lg border-[1px] border-gray-500 cursor-pointer btn-home whitespace-nowrap" id="download" data-link='${data.backdrop_path}' data-title='${data.title}'>
                  <i class="fa fa-download" aria-hidden="true"></i> Download
                </button>
              <button class="text-sm w-[31%] lg:w-[20%] py-2 rounded-lg border-gray-500 border-[1px] cursor-pointer btn-home whitespace-nowrap" id="share">
                  <i class="fa fa-share-alt" aria-hidden="true"></i> Share
              </button>
              <button class="text-sm w-[31%] lg:w-[20%] py-2 rounded-lg border-gray-500 border-[1px] cursor-pointer btn-home whitespace-nowrap" id="like">
                  <i class="fa fa-thumbs-o-up w-3" aria-hidden="true"></i> Like
              </button>
        </div>
    </div>`
}
function handleButton(btn){
    const findBtn = btn.id;
    const icon = btn.children[0];

    switch(findBtn){
        case 'continueWacthing' :
            wacthingMovie();
            break;
        case 'addWacthlist' :
            icon.classList.toggle('fa-bookmark-o');
            icon.classList.toggle('fa-bookmark');
            break;
        case 'download' :
            const link = btn.dataset.link;
            const title = btn.dataset.title;
            // downloadImg(link, title)
            break;
        case 'share':
            sharePage();
            break;
        case 'like' :
            icon.classList.toggle('fa-thumbs-o-up');
            icon.classList.toggle('fa-thumbs-up');
            break;

    }
}
function detailButtons(button){
    const containerHome = document.getElementById('partOfContainerHome');
    const ui = `<div class="w-1/3 py-2 rounded-lg absolute bottom-1/4 right-2 z-50 text-center detailButtonsOnDetailMovie">  
                <button class="text-2xs w-10/12 py-1 rounded-lg bg-gray-500 cursor-pointer btn-home whitespace-nowrap" id="addWacthlist">
                    <i class="fa fa-bookmark-o" aria-hidden="true"></i> Add Wacthlist
                </button>
                <button class="text-2xs mt-1 w-10/12 py-1 rounded-lg bg-gray-500 cursor-pointer btn-home whitespace-nowrap" id="download">
                    <i class="fa fa-download" aria-hidden="true"></i> Download
                </button>
                <button class="text-2xs mt-1 w-10/12 py-1 rounded-lg bg-gray-500 cursor-pointer btn-home whitespace-nowrap" id="share">
                    <i class="fa fa-share-alt" aria-hidden="true"></i> Share
                </button>
        </div>`;
    if(button.classList.contains('active')){
       button.classList.remove('active')
       containerHome.querySelector('.detailButtonsOnDetailMovie').remove();
    }else{
        button.classList.add('active')
        containerHome.innerHTML += ui;
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

// Fetch API
function getApi(id, type, query){
    const typeData = (type == 'series') ? 'tv' : 'movie';
    const overQuery = (query == undefined) ? '' : query;
    let url =`https://api.themoviedb.org/3/${typeData}/${id}?api_key=8482e16292527bd819173faa9e3fb365${overQuery}` ;
    return fetch(url)
    .then(e => e.json())
    .then(e => (e.length===0)?'Movie Not Found' : e);
}