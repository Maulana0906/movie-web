setTimeout(async ()=> {
    const url = new URLSearchParams(window.location.search);
    const idMovie = url.get('id');

    // container Home
    const movie = await getApi(idMovie);
    const containerHome = document.getElementById('containerHome');
    const uiContainerHome = loadUiHome(movie.results);







},0)

function loadUiHome(data){
    return `<img src="img/image 203.png" class="h-full w-full object-cover" alt="">
    <div class="absolute w-full h-1/3 bottom-0 z-10 grid grid-cols-2 gap-1">
        <div class="flex flex-col gap-1 px-4 text-white">
            <button class="w-16 h-6.5 rounded-xl bg-gray-800 text-white text-sm">Series</button>
            <h1 class="mt-4 text-4xl font-bold">The jumpscare</h1>
            <ul class="mt-3 flex gap-5.5 text-sm">
                <li class="">115 minutes</li>
                <li class="list-disc">21-5-2025</li>
                <li class="list-disc">Action | Family | Comedy</li>
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
             <button class="text-sm px-7 py-2 rounded-lg border-[1px] border-gray-500 cursor-pointer btn-home">
                  <i class="fa fa-download" aria-hidden="true"></i> Download
                </button>
              <button class="text-sm px-10 py-2 rounded-lg border-gray-500 border-[1px] cursor-pointer btn-home">
                  <i class="fa fa-share-alt" aria-hidden="true"></i> Share
              </button>
              <button class="text-sm px-10 py-2 rounded-lg border-gray-500 border-[1px] cursor-pointer btn-home">
                  <i class="fa fa-thumbs-o-up" aria-hidden="true"></i> Like
              </button>
        </div>
    </div>`
}



function getApi(params){
    let url =`https://api.themoviedb.org/3/movie/${params}?api_key=8482e16292527bd819173faa9e3fb365` ;
    return fetch(url)
    .then(e => e.json())
    .then(e => (e.length===0)?'Movie Not Found' : e);
}