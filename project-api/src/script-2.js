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
let second;
setTimeout(async function(){
    const navbar = document.querySelector('.navbar');
    const logo = document.getElementById('logo');
    document.addEventListener('scroll', ()=>{
        if(window.scrollY >= window.innerHeight-150){
            navbar.style.backgroundColor = 'rgba(0,0,0,0.40)';
            logo.style.backgroundColor = 'white';
        }else{
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
            logo.style.backgroundColor = 'rgba(0,0,0,0.0)';
        }
    })

    // Ui card suggestion
    const wrapperCardSuggestion = document.getElementById('wrapperCardSuggestion');
    const dataSuggestion = await getApi('movie/12/recommendations', '&language=en-US&page=1');
    let cardsSuggestion = ``;
    dataSuggestion.results.forEach((e,i) => {
        if(i<12){
            cardsSuggestion += cards(e,'start');
        }
    })
    wrapperCardSuggestion.innerHTML += cardsSuggestion;

    //Ui card The best
    const wrapperCardTheBest = document.getElementById('wrapperCardTheBest');
    const dataTheBest = await getApi('discover/tv', '&certification_country=US&certification.lte=G&sort_by=popularity.desc&with_genres=16');
    cardsTheBest =``;
    dataTheBest.results.forEach((e,i) => {
        if(i<12){
        cardsTheBest += cards(e,'start');
        }
    }) 
    wrapperCardTheBest.innerHTML = cardsTheBest;
    
    // character 
    const dataCharacter = await getApi('src/character.json');
    const wrapperCardCharacter = document.getElementById('wrapperCardCharacter');
    let cardsCharacter = ``
    dataCharacter.forEach((e,i) => {
        if(i<12){
        cardsCharacter += cards(e,'start');
        }
    })
    wrapperCardCharacter.innerHTML += cardsCharacter;

    // section info movie 
    const dataSectionInfo = await getApi('discover/movie', '&certification_country=US&certification.lte=G&sort_by=popularity.desc&with_genres=16&page=2');
    const wrapperInfo = document.getElementById('sectionInfoMovie');
    let uiSectionInfo = ``;
    let active = 0;
    uiSectionInfo += loadBgInfoMovie(dataSectionInfo.results);
    uiSectionInfo += textInfoMovie(dataSectionInfo.results, active);
    
    wrapperInfo.innerHTML += uiSectionInfo;

    // count the number of rows
    checkTitleSectionInfoMovie();

    // replace section info movie
    document.addEventListener('click', e => {
        if(e.target.classList.contains('replace')){
            active = handleButtonInfo(active, e.target, dataSectionInfo.results)
        }
    })

    // most view
    const wrapperMostView = document.getElementById('mostView');
    const dataMostView = await getApi('discover/movie', '&certification_country=US&certification.lte=G&with_genres=16')
    let cardsMostView = ``;
    dataMostView.results.forEach(e => {
        cardsMostView += cardsViewAll(e)
    })
    wrapperMostView.innerHTML += cardsMostView;

    // arrow button
    let isScrolling = true;
    const buttonsArrow = document.querySelectorAll('.arrow');
    const wrapper = document.getElementById('wrapperCardCharacter');
    const card = wrapper.children[0];
    const init = Math.floor(wrapper.clientWidth/card.clientWidth);
    const delayEfectScroll = (init <= 3) ? 400 : (init == 4) ? 450 : 700;

    buttonsArrow.forEach((e,i) => {
        e.addEventListener('click', (el)=> {
            if(!isScrolling) return;
            handleArrowButton(el.target, i);

            isScrolling = false;
            setTimeout(() => {
                isScrolling = true;
            },delayEfectScroll)
        })
    })

    loadPagination(init);
    const allCards = document.querySelectorAll('.cards');
    effectSkeleton(allCards);

},0)
function effectSkeleton(data){
        Array.from(data).forEach(e => {
            if(e.complete && e.naturalWidth > 0)
                e.parentElement.classList.remove('skeleton');
        })
}

function loadPagination(totalOfWrapper){
    const num = (totalOfWrapper <= 3) ? 4 : (totalOfWrapper == 4) ? 3 : 2;
    const pagination  = document.querySelectorAll('.pagination'); 
    Array.from(pagination).forEach(e => {
        let paginationTemp = ``; 
        for(let i=0; i< num; i++){
            let activePagination = (i!=0)?'off':'thumb-on';
            paginationTemp += `<div class="w-[5px] h-[5px] rounded-full bg-gray-500 ${activePagination}"></div>`
        }
        e.innerHTML += paginationTemp;
    })
}

function handleArrowButton(btn, i){
    const buttonsArrow = document.querySelectorAll('.arrow');
    const sibling = Math.floor(i%2==0) ? buttonsArrow[i+1] : buttonsArrow[i-1];
    const wrapper = btn.parentElement.children[2];

    const step = wrapper.clientWidth; 
    const valueOld = wrapper.scrollLeft;
    const currentScroll = wrapper.scrollLeft + ((btn.classList.contains('left')) ?  -step : step) ;
    wrapper.scrollBy({
        left : (btn.classList.contains('left')) ? -step : step,
        behavior : "smooth"
    })

    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth ;
    if (currentScroll <= 2) {
        btn.classList.add('hidden'); 
    } else if (currentScroll >= maxScroll - 2) {
        btn.classList.add('hidden'); 
    } 
    sibling.classList.remove('hidden');

    const [indexOld, indexNew] = [Math.round(valueOld/step),Math.round(currentScroll/step)]
    const containerPagination = btn.parentElement.querySelector('.pagination');

    containerPagination.children[indexNew].classList.replace('off', 'thumb-on');
    containerPagination.children[indexOld].classList.replace('thumb-on', 'off');

}

function checkTitleSectionInfoMovie(){
    const title = document.getElementById('titleInInfoMovie');
    const height = title.clientHeight;
    const lineHeight = parseFloat(window.getComputedStyle(title).lineHeight);
    const total = Math.round(height/lineHeight);
    if(total>2 && total<=5){
        title.classList.replace('text-3xl', 'text-2xl')
        title.classList.replace('mt-6', 'mt-2')
        title.classList.replace('leading-7', 'leading-6')
    }else if(total>5){
        title.classList.replace('mt-6', 'mt-2')
        title.classList.replace('text-3xl', 'text-lg')
        title.classList.replace('leading-7', 'leading-4.5')
    }
}
function handleButtonInfo(i, button, data){
    const action = button.classList.contains('next') ? i+1 : i-1;
    switch(action){
        case 0 : 
            button.classList.add('invisible')
            break;
        case 19:
            button.classList.add('invisible')
            break;
        default : 
            const sibling = Array.from(button.parentElement.children).find(el => el !== button);
            sibling.classList.remove('invisible')
    }
    
    function replaceBg(ac){
        const background = document.querySelectorAll('.background');
        background.forEach((e,i) => {
            if(i==(ac-1) || i==(ac+1)){
                e.classList.add('invisible');
            }
            background[ac].classList.remove('invisible');
        })
    }
    document.querySelector('.section-text-info-movie').innerHTML = textInfoMovie(data, action);
    checkTitleSectionInfoMovie();

    replaceBg(action);
    return action;
}

function loadBgInfoMovie(data){
    let result = ``;
    data.forEach((e,i) => {
        result += `<img src="https://image.tmdb.org/t/p/original${e.backdrop_path}" class="absolute w-full h-full object-cover opacity-65 ${i!=0 ? 'invisible' : ''} background" loading="lazy" alt="">`
    })
    return result;
}

function textInfoMovie(value, i){
    const data = value[i];
    function findGenre(values){
        const genre = values.map(g => {
            const temp = dataGenre.find(e => e.id === g);
            return temp ? temp.name : null; 
        })
        return genre;
    }
    function uiGenre(values){
        return values.map((e,i) => {
            if(values[i+1] != undefined){
                return `<p class="text-sm text-white">${e}</p> <div class="w-[2px] h-4 bg-white"></div>`
            }else{
                return `<p class="text-sm text-white">${e}</p>`
            }
        }).join('');
    }
    const genre = findGenre(data.genre_ids)
    return `
    <div class="w-full md:w-10/12 lg:w-8/12 h-full left-0 flex items-center gap-3 md:gap-4 absolute z-10 top-0 px-3 md:px-7 section-text-info-movie">
    <div class="w-1/2 md:w-48 lg:w-auto lg:h-[96%] aspect-2/3 rounded-lg shadow-sm shadow-slate-500 skeleton">
        <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" class="w-full h-full object-cover object-center rounded-lg card" alt="">
    </div>
    <div class="w-1/2 md:pb-20 lg:pb-0">
      <ul class="w-full">
        <li class="mt-6 text-3xl font-semibold leading-7 text-white" id="titleInInfoMovie">${data.title}</li>
        <li class="text-sm text-white mt-2 flex flex-wrap gap-x-1 items-center">${uiGenre(genre)}</li>
        <li class="text-sm text-white">${data.release_date}</li>
        <li class="flex gap-1 items-end mt-0.5">
          <img src="img/star-f.png" class="w-4 h-4" alt="">
          <span class="text-sm text-white leading-3">${data.vote_average.toFixed(2)}</span>
          <img src="img/fire.png" class="w-[18px] h-[18px] ml-2 -mb-[2px]" alt="">
          <span class="text-sm text-white leading-3">${data.popularity}</span>
          </li>
        <li class="mt-10">
          <button class="cursor-pointer px-5 py-1.5 text-sm rounded-lg bg-blue-400 text-white tracking-wider font-medium">Wacth Movie</button>
        </li>
      </ul>
    </div>
  </div>`
}
function cardsViewAll(data){
    return `<div class="p-1 mb-3">
                <div class="w-full aspect-2/3 skeleton"> 
                    <img class="rounded-xl w-full h-full object-cover shadow-sm card" src="https://image.tmdb.org/t/p/w500${data.poster_path}" loading="lazy" alt="" />
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
}

function cards(data,type){
    function loadUiCard(params){
        let result = `<img class="rounded-xl w-full aspect-2/3 object-cover shadow-sm" src="img/character/${data.poster_path}" alt="" />`;
        if(data[params]!=undefined){
            const uiCard = `
                <div class="w-full aspect-2/3 skeleton"> 
                    <img class="rounded-xl w-full h-full object-cover shadow-sm card" src="https://image.tmdb.org/t/p/w500${data.poster_path}" loading="lazy" alt="" />
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
                </div>`;
            result = uiCard;
        }
        return result;
    }
    const innerUiCard = loadUiCard('vote_average');
    let scrollSnap = (type==='start')?'snap-start':'';
    return `<a href="detail-movie.html?id=${data.id}" class="inline-block md:w-[calc(25%-8px)] lg:w-[calc(16.666%-8px)] sm:w-[calc(33.333%-8px)] w-[calc(50%-8px)] ${scrollSnap} mx-1 rounded-xl hover:scale-[98%] duration-200 ease-in-out">
                ${innerUiCard}
            </a>`
}

function uiPagination(pagination, totalOfWrapper){
    Array.from(pagination).forEach((e,i)=> {
        let totalTemp = (i==0)?24:12;
        let paginationTemp = ``; 
        for(let i=0; i<totalTemp/totalOfWrapper; i++){
            let activePagination = (i!=0)?'off':'thumb-on';
            paginationTemp += `<div class="w-[5px] h-[5px] rounded-full bg-gray-500 ${activePagination}"></div>`
        }
        e.innerHTML += paginationTemp;
    })
}

function uiActivePagination(pagination,index){
    Array.from(pagination).forEach((e,i)=> {
        if(i==Math.floor(index/2)){
            let indexActive = 0;
            Array.from(e.children).forEach((el,x)=>{
                if(!el.classList.contains('off')){
                    indexActive =x;
                    el.classList.replace('thumb-on', 'off')
                }
            })
            if(index%2==0){
                e.children[indexActive-1].classList.replace('off', 'thumb-on');
            }else{
                e.children[indexActive+1].classList.replace('off','thumb-on')
            }
        }
    })
}

function getApi(params,query){
    let url = (query == undefined) ? params : `https://api.themoviedb.org/3/${params}?api_key=8482e16292527bd819173faa9e3fb365${query}` ;
    return fetch(url)
    .then(e => e.json())
    .then(e => (e.length===0)?'Movie Not Found' : e);
}


// | Kebutuhan                    | Endpoint URL                       |
// | ---------------------------- | ---------------------------------- |
// | 🔥 Movie populer             | `/movie/popular`                   |
// | 🎬 Movie terbaru             | `/movie/now_playing`               |
// | 🧭 Movie mendatang           | `/movie/upcoming`                  |
// | 📺 TV Series populer         | `/tv/popular`                      |
// | 🔎 Cari film/tv show         | `/search/movie?q=...`              |
// | 🎞️ Detail film              | `/movie/{movie_id}`                |
// | 👥 Cast & crew film          | `/movie/{movie_id}/credits`        |
// | 📽️ Trailer & video film     | `/movie/{movie_id}/videos`         |
// | 🎭 Daftar genre              | `/genre/movie/list`                |
// | 🌍 Filter berdasarkan negara | Gunakan parameter `region=ID`      |
// | 🔢 Rating / Vote             | Dalam detail film (`vote_average`) |
// | 📚 Koleksi/franchise         | `/collection/{collection_id}`      |

// https://api.themoviedb.org/3/search/person?api_key=8482e16292527bd819173faa9e3fb365&query=Humphrey Bogart

// 081515315552
