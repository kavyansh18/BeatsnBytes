console.log("Here we gooo")
let currentsong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder){
    currfolder=folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div= document.createElement("div");
    div.innerHTML=response;
    let as= div.getElementsByTagName('a');
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    //show all the songs in the playlist library section
    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=''
    for (const song of songs) {
        songul.innerHTML=songul.innerHTML + `<li> 
                            <div class="info">
                                <img class="invert" src="img/music.svg" alt="">
                                <div class="nameandartist">
                                    <div>${song.replaceAll("%20"," ").slice(0, -4 )}</div>
                                    <div>Kavyansh</div>
                                </div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="/img/play.svg" alt="">
                            </div> </li> `
    }
    
    //attach an event to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".nameandartist").firstElementChild.innerHTML)
            playmusic(e.querySelector(".nameandartist").firstElementChild.innerHTML)
    })
})
}

const playmusic = (track, pause=false)=>{
    currentsong.src= `/${currfolder}/` + track + ".mp3"
    if(!pause){
        currentsong.play()  
    }
    document.querySelector(".songinfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}
async function main(){

    //get list of songs
    await getSongs("songs/karanaujla")

    playmusic(songs[0].slice(0, -4 ),true)

    //attach an event listner to previous, playb, next
    play.addEventListener("click", ()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src ="img/pause.png"
        }
        else{
            currentsong.pause()
            play.src = "img/play.png"
        }
    })

    if(currentsong.play){
        play.src ="img/play.png"
    }

    //listen for timeupdate event
    currentsong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    previous.addEventListener("click", () => {
        currentsong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1].slice(0, -4 ))
            play.src = "img/pause.png"; 
        }
    })
    
    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("Next clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1].slice(0, -4 ))
            play.src = "img/pause.png"; 
        }
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100
        if (currentsong.volume >0){
            document.querySelector(".vol>img").src = document.querySelector(".vol>img").src.replace("mute.svg", "volume.svg")
        }
        if (currentsong.volume ==0){
            document.querySelector(".vol>img").src = document.querySelector(".vol>img").src.replace("volume.svg", "mute.svg")
        }
    })



    // Add event listener to mute the track
    document.querySelector(".vol>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume =0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("fb")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`) 
        })
    })

    //add event listener for hamburger click
    document.querySelector(".hb").addEventListener("click", ()=>{
        document.querySelector(".leftc").style.left= "0"
    })

    //add event listner to close button click
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".leftc").style.left= "-100%"
    })

    //add event listner on click when click on album show leftc songs
    document.querySelector(".a").addEventListener("click", ()=>{
        document.querySelector(".leftc").style.left= "0"
    })

    document.querySelector(".b").addEventListener("click", ()=>{
        document.querySelector(".leftc").style.left= "0"
    })

    document.querySelector(".c").addEventListener("click", ()=>{
        document.querySelector(".leftc").style.left= "0"
    })

    document.querySelector(".d").addEventListener("click", ()=>{
        document.querySelector(".leftc").style.left= "0"
    })

    document.querySelector(".e").addEventListener("click", ()=>{
        document.querySelector(".leftc").style.left= "0"
    })

}
main()
