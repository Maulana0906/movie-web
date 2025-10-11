const url = new URLSearchParams(window.location.search);
const key = url.get('key');

setTimeout(async() => {
    const iFrame = `<iframe
        class="w-[77%] mx-auto aspect-video"
        src="https://www.youtube.com/embed/${key}"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        ></iframe>`;
    
    const container = document.getElementById('container');
    container.innerHTML += iFrame;

},0)