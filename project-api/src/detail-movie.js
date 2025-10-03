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

setTimeout(async ()=> {
    const url = new URLSearchParams(window.location.search);
    const idMovie = url.get('id');
    const typeData = url.get('typeData');

    // container Home
    const movie = await getApi(idMovie, typeData);
    const containerHome = document.getElementById('containerHome');
    const uiContainerHome = loadUiHome(movie, typeData);

    containerHome.innerHTML += uiContainerHome;

    document.addEventListener('click', (el) => {
        if(el.target.classList.contains('btn-home')){
            handleButton(el.target);
        }
    })

},0)

function loadUiHome(data, typeData){
    const firstList = (data.seasons == 'undefined') ? data.times : data.seasons[data.seasons.length-1].name;
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
                return `<p class="text-sm text-white">${e}</p> <div class="w-[2px] h-4 bg-white"></div>`
            }else{
                return `<p class="text-sm text-white">${e}</p>`
            }
        }).join('');
    }
    const genre = findGenre(data.genres)
    return `<img src="https://image.tmdb.org/t/p/original${data.backdrop_path}" class="h-full w-full object-cover" alt="">
    <div class="absolute w-full h-1/3 bottom-0 z-10 grid grid-cols-2 gap-1">
        <div class="flex flex-col gap-1 px-4 text-white">
            <button class="w-16 h-6.5 rounded-xl bg-gray-800 text-white text-sm">${typeData}</button>
            <h1 class="mt-4 text-4xl font-bold">${data.title || data.name}</h1>
            <ul class="mt-3 flex gap-5.5 text-sm">
                <li class="">${firstList}</li>
                <li class="list-disc">${data.release_date || data.last_air_date}</li>
                <li class="list-disc flex gap-1.5 items-center">${uiGenre(genre)}</li>
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
        case 1 :
            icon.classList.toggle('fa-bookmark-o');
            icon.classList.toggle('fa-bookmark');
            break;
        case 2 :
            const link = btn.dataset.link;
            const title = btn.dataset.title;
            // downloadImg(link, title)
            break;
        case 4 :
            icon.classList.toggle('fa-thumbs-o-up');
            icon.classList.toggle('fa-thumbs-up');
            break;

    }
}
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

function getApi(id, type){
    const typeData = (type == 'series') ? 'tv' : 'movie';
    let url =`https://api.themoviedb.org/3/${typeData}/${id}?api_key=8482e16292527bd819173faa9e3fb365` ;
    return fetch(url)
    .then(e => e.json())
    .then(e => (e.length===0)?'Movie Not Found' : e);
}