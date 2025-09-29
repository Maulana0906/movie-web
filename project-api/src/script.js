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


    const containerHome = document.getElementById('backgroundContent');
    const thumbButton = document.getElementById('thumbButton');
    const textContainerHome = document.getElementById('textContainerHome');
    let homeMovies = await getApi('movie/now_playing');
    second = homeMovies;
    let active = 0;
    //ui home
    homeMovies.results.forEach((e,i) => {
        const bgWrapper = document.createElement('div');
        let hiddenClass = (i==active)?'background-on':'background-off';
        bgWrapper.className = `w-full h-full bg-cover bg-center mb-4 ${hiddenClass} absolute z-[${i}] `;
        bgWrapper.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${e.backdrop_path}')`;
        containerHome.appendChild(bgWrapper);

        const thumb = document.createElement('div');
        let filter = (active!=i) ? 'off' : 'on';
        let classActive = (i==active)?'thumb-on' : 'thumb-off';
        thumb.className = `inline-block mx-1 md:w-24 md:h-[140px] w-[70px] h-[100px] ${classActive} rounded-lg overflow-hidden cursor-pointer relative duration-200 ease-in-out`;
        thumb.innerHTML = `<div class="h-full w-full absolute ${filter} bg-gray-900 duration-200 ease-in-out"> </div> 
        <img class='w-full h-full object-cover' src="https://image.tmdb.org/t/p/w500${e.poster_path}" /> `;

        thumbButton.appendChild(thumb);
        if(active==i){
            textContainerHome.innerHTML= textHome(e);
            textContainerHome.children[2].innerHTML += showMore();

        }
    }); 

    // uiThumbnail button
    const thumbnails = thumbButton.children;
    let isScrolling = false;
    Array.from(thumbnails).forEach((e,i)=> {
        e.addEventListener('click', (el)=> {
            if (isScrolling) return;
            isScrolling = true;
            let x = thumbnails.length;
            uiTumbButton(i,thumbnails,containerHome);
            let thumbnailsWidth = el.target.offsetWidth + 8;
            let count = 0;
            if(i>1 && active>1 && i<=x-2 && active <=x-3){
                count = i -active;
            }else if(active<=1 || active>=x-2){
                if(active<=1 && i>1){count=i-1;}
                else if(active>=x-2 && i===x-4){count = -1}
            }else if(active>1 && i===1){
                count = -1;
            }
            thumbButton.scrollLeft += (thumbnailsWidth *count);
            active = i;
            let temp = textHome(second.results[i]);
            textContainerHome.innerHTML = temp;
            textContainerHome.children[2].innerHTML += showMore();
            setTimeout(() => {
                isScrolling = false;
            }, 300);
        })
    })

    // More deskripsi
    document.addEventListener('click', (e)=> {
        if(e.target.classList.contains('showMoreDeskripsi')){
            let textDeskripsi = document.getElementById('deskripsi');
            let parentTextDeskripsi = textDeskripsi.parentElement;
            textDeskripsi.classList.toggle('heightAuto');
            parentTextDeskripsi.classList.toggle('heightAuto')
            if(e.target.textContent == 'more') {
                e.target.textContent = 'less'
                e.target.previousElementSibling.textContent = ''
            }
            else{
                e.target.textContent = 'more'
                e.target.previousElementSibling.textContent = '. . . .'
            }
            
        }
    })
    // Ui card trends
    const wrapperCardTrends = document.getElementById('wrapperCardTrends');
    const dataTrendsSeries = await getApi('tv/popular');
    const dataTrendsMovies = await getApi('movie/popular');
    let cardTrends = ``;
    for(let i=0; i<12; i++){
        cardTrends += cards(dataTrendsMovies.results[i],'start');
        cardTrends += cards(dataTrendsSeries.results[i],'end')
    }
    wrapperCardTrends.innerHTML += cardTrends;

    //Ui card Movies
    const wrapperCardMovies = document.getElementById('wrapperCardMovies');
    const dataMoviesRandom = await getApi('discover/movie');
    cardMovies =``;
    for(let i=0; i<12; i++){    
        if(i%2==0){
            cardMovies += cards(dataMoviesRandom.results[i],'start')
        }else{
            cardMovies += cards(dataMoviesRandom.results[i], 'end')
        }
    }
    wrapperCardMovies.innerHTML += cardMovies;
    
    // button arrow
    const arrow = document.querySelectorAll('.arrow');
    let countScrollBigData = 0;
    let countScrollSmallData = [0,0,0];
    let totalOfWrapper = Math.floor(wrapperCardTrends.offsetWidth / wrapperCardTrends.children[0].offsetWidth);
    let fullWidthBigData, fullWidthSmallData;
    let delayEfectScroll = 0;
    if(totalOfWrapper===3){
        fullWidthBigData = wrapperCardTrends.offsetWidth*7;
        fullWidthSmallData = wrapperCardTrends.offsetWidth*3;
        delayEfectScroll = 410;
    }else if(totalOfWrapper>3){
        fullWidthBigData = (totalOfWrapper===4)?wrapperCardTrends.offsetWidth*5 : wrapperCardTrends.offsetWidth * 3;
        fullWidthSmallData = (totalOfWrapper===4)?wrapperCardTrends.offsetWidth*2 : wrapperCardTrends.offsetWidth * 1;
        delayEfectScroll = (totalOfWrapper ===4)?450:700;
    }
    // arrow cards
    Array.from(arrow).forEach((e,i) =>{
        e.addEventListener('click', ()=> {
            if(isScrolling) return;
            if(e.classList.contains('right')){
                isScrolling = true;
                e.previousElementSibling.scrollLeft +=wrapperCardMovies.offsetWidth;
                countScrollBigData += wrapperCardMovies.offsetWidth;
                countScrollSmallData[Math.floor(i/2)-1] += wrapperCardMovies.offsetWidth
            }else if(e.classList.contains('left')){
                isScrolling = true;
                e.nextElementSibling.scrollLeft -=wrapperCardMovies.offsetWidth;
                countScrollBigData -= wrapperCardMovies.offsetWidth;
                countScrollSmallData[Math.floor(i/2)-1] -= wrapperCardMovies.offsetWidth
            }
            setTimeout(() => {
                isScrolling = false;
                if(i<2){
                    (countScrollBigData >0)?arrow[0].style.display ='block':arrow[0].style.display = 'none';
                    (countScrollBigData==fullWidthBigData)?arrow[1].style.display = 'none':arrow[1].style.display = 'block';
                }else {
                    countScrollSmallData.forEach((el,x)=> {
                        if(Math.floor(i/2)== (x+1)){
                            let left = (i%2==0)?i:i-1;
                            let right = (i%2==0)?i+1:i;
                            (el==0)?arrow[left].style.display ="none":arrow[left].style.display = "block";
                            (el==fullWidthSmallData)?arrow[right].style.display ="none":arrow[right].style.display = "block";
                        }
                    })
                }
            uiActivePagination(pagination,i);    
            }, delayEfectScroll);
        })
    })
    const pagination  = document.querySelectorAll('.pagination');
    uiPagination(pagination, totalOfWrapper);
    const categorySmallData = document.querySelectorAll('.category-small-data');
    uiArrowCategory(categorySmallData);
    
    // series 
    const dataSeries = await getApi('discover/tv');
    const wrapperCardSeries = document.getElementById('wrapperCardSeries');
    let cardSeries = ``
    dataSeries.results.forEach((e,i) => {
        cardSeries += (i%2==0) ? cards(e,'start') : cards(e,'end');
    })
    wrapperCardSeries.innerHTML = cardSeries;
    const pricing = document.querySelectorAll('.pricing');
    Array.from(pricing).forEach(el => {
        el.addEventListener('mouseenter', ()=> {
            el.children[0].style.margin = '-12px 0 12px 9px';
            el.children[0].style.transform = "rotate(5deg)";
        })
        el.addEventListener('mouseleave', ()=> {
            el.children[0].style.margin = '0';
            el.children[0].style.transform = "rotate(0)";
        })
    })
    const wrapperCardCollection = document.getElementById('wrapperCardCollection');
    const queryCollection = ['marvel', 'dc', 'godzilla', 'musicals','anime'];
    let dataCollection = [];
    for(let a of queryCollection){
        dataCollection.push(await getApi('search/collection', `&query=${a}`));
    }
    const uiCardsCollection = collectionCards(dataCollection);
    wrapperCardCollection.innerHTML += uiCardsCollection;


    const dataPeople1 = await getApi('person/popular', `&page=1`);
    const dataPeople2 = await getApi('person/popular', `&page=2`);
    const wrapperCardActors = document.getElementById('wrapperCardActors');
    const allDataPeople = [...dataPeople1.results, ...dataPeople2.results]
    
    wrapperCardActors.innerHTML += actorCards(allDataPeople)

    const allCards = document.querySelectorAll('.card');
    effectSkeleton(allCards)
},0)
function effectSkeleton(data){
        Array.from(data).forEach(e => {
            if(e.complete && e.naturalWidth > 0)
                (e.parentElement) ? e.parentElement.classList.remove('skeleton') : e.classList.remove('skeleton');
        })
}

function uiTumbButton(index,thumbnails,containerHome){
    const bgWrappers = containerHome.children;
    Array.from(thumbnails).forEach((e,i)=> {
        const thumbnailsInner = e.children[0];
        if(i==index){
            thumbnailsInner.classList.replace('off', 'on');
            e.classList.replace('thumb-off','thumb-on');
            bgWrappers[i].classList.replace('background-off', 'background-on')            
        }else{
            e.classList.replace('thumb-on','thumb-off')
            thumbnailsInner.classList.replace('on', 'off');
            bgWrappers[i].classList.replace('background-on', 'background-off');
        }
    })

}
function showMore(){
    const textNone = document.getElementById('textDeskripsiNone');
    const deskripsi = document.getElementById('deskripsi');
    const lineHeightTextNone = textNone.offsetHeight/16;
    const lineHeightDeskripsi = deskripsi.offsetHeight/16;
    if(lineHeightTextNone>2 && lineHeightDeskripsi==2 ){
        return `
        <div class="flex w-full justify-between">
        <p class="text-sm text-thin leading-none tracking-tighter">. . . .</p>
        <p class="leading-none cursor-pointer text-sm showMoreDeskripsi" style="text-decoration: underline">more</p> </div>`
    }else {
        return ''
    }
}
function textHome(data){
    let findGenre = function(x) {
        for(let a of dataGenre){
             if(a.id == x){return a.name}
        }
    }
    let titleSize = data.original_title.split('').length > 23 ? 'text-2xl' : 'text-3xl';
    let genre = data.genre_ids.map((e,i) => 
        (data.genre_ids[i+1] !=undefined)?`<h3 class="font-semibold">${findGenre(e)}</h3> <div class=" h-4 bg-white" style="width: 2px;"></div>`
        :`<h3 class="font-semibold">${findGenre(e)}</h3>`
    ).join('');
    return `
    <h1 class="sm:text-5xl ${titleSize} mb-1 font-semibold">${data.title}</h1>
    <div class="my-1 flex items-center gap-1 text-sm sm:text-md">
        ${genre}
    </div>
    <div class="w-full h-[42px] sm:h-auto p-0 relative">
    <p class="leading-4 h-8 sm:h-auto overflow-y-hidden text-sm font-thin" id="deskripsi">${data.overview}</p>
    <p class="absolute top-0 leading-4 text-sm font-thin cursor-none invisible" id="textDeskripsiNone"> ${data.overview} </p>
    </div>
    <div class="flex items-center sm:gap-1 gap-4 md:mt-1">
        <div class="flex h-3 mx-1">
            <img src="img/star-f.png" alt="" class="w-3 h-3 mr-1">
            <p class="leading-none text-sm">${data.vote_average.toFixed(2)}</p>
            <img src="img/fire.png" class="h-4 w-4 ml-3 -mt-0.5" alt="">
            <p class="leading-none text-sm">${data.popularity}</p>
        </div>
      <button type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-4 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
      Detail <i class="fa fa-long-arrow-right" aria-hidden="true"></i></button>
    </div>
    `
}
function cards(data,type){
let scrollSnap = (type==='start')?'snap-start':'';
    return `
<div class="inline-block md:w-[calc(25%-8px)] lg:w-[calc(16.666%-8px)] sm:w-[calc(33.333%-8px)] mx-[4px] w-[calc(50%-8px)] ${scrollSnap} rounded-xl  hover:scale-[98%] duration-200 ease-in-out">
    <div class="w-full aspect-2/3 skeleton"> 
        <img class="rounded-xl w-full h-full object-cover shadow-sm card" src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="" />
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
</div>
`
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
function uiArrowCategory(categorySmallData){
    let categoryTemp = ``;
    dataGenre.forEach(e =>{
        categoryTemp +=`<li class="px-2 py-1.5 whitespace-nowrap border-[1px] border-[#333] cursor-pointer rounded-2xl">${e.name}</li>`
    })
    Array.from(categorySmallData).forEach(e => {
        e.innerHTML = categoryTemp;
        e.parentElement.addEventListener("mouseenter", ()=> {
            e.previousElementSibling.classList.add('active-arrow-category')
            e.nextElementSibling.classList.add('active-arrow-category')
        });
        e.parentElement.addEventListener("mouseleave", ()=> {
            e.previousElementSibling.classList.remove('active-arrow-category')
            e.nextElementSibling.classList.remove('active-arrow-category')
        });
    })
    const arrowCategory = document.querySelectorAll('.arrow-category');
    Array.from(arrowCategory).forEach((el, x)=> {
        el.addEventListener('click', ()=> {
            if(x%2==0){
                el.nextElementSibling.scrollLeft -= 100;
            }else{
                el.previousElementSibling.scrollLeft += 100;
            }
        })
    })
 
    
}
function collectionCards(values){
    let result = ``;
    for(let data of values){
        let temp =[];
        data.results.reverse().forEach((e,i) => {
            if(temp.length<3 && e.poster_path!=null){temp.push(e.poster_path)}
        })
        result += `
        <div class="flex-none w-[47%] sm:w-1/3 lg:w-[19%] m-0 leading-0 relative min-h-[253px] sm:min-h-[340px] md:min-h-[410px] xl:min-h-[370px] ">
            <img src="https://image.tmdb.org/t/p/w500${temp[2]}" loading="lazy" class="w-10/12 h-auto absolute translate-[12%] opacity-65 rounded-xl shadow-md shadow-gray-600 ">
            <img src="https://image.tmdb.org/t/p/w500${temp[1]}" loading="lazy" class="w-10/12 h-auto absolute translate-[6%] opacity-80 rounded-xl shadow-md shadow-gray-600">
            <img src="https://image.tmdb.org/t/p/w500${temp[0]}" loading="lazy" class="w-10/12 h-auto absolute z-30 rounded-xl shadow-md shadow-gray-600 skeleton card">
        </div>
        `
    }
    return result;
}
function actorCards(dataPeople){
    let result = ``;
    let countImg = 0;
    for(let value of dataPeople){
        if(value.profile_path!==null & countImg<24){
            countImg +=1;
            result += `<div class="flex-none w-[calc(25%-8px)] sm:w-[calc(16.66%-8px)] md:w-[calc(12.5%-8px)] lg:w-[calc(8.33%-8px)] rounded-full duration-300 ease-in-out hover:scale-95 skeleton"> 
                <img class="w-full h-full object-cover shadow-md shadow-gray-500 rounded-full card" src="https://image.tmdb.org/t/p/w500${value.profile_path}" />
            </div>
            `
        }
    }
   
    return result;
}
function getApi(x,query){
    let queryCollection = (query!=undefined)? query:'';
    return fetch(`https://api.themoviedb.org/3/${x}?api_key=8482e16292527bd819173faa9e3fb365${queryCollection}`)
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