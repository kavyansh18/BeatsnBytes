console.log("Here we gooo")
let currentsong = new Audio();

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
async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    let div= document.createElement("div");
    div.innerHTML=response;
    let as= div.getElementsByTagName('a');
    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playmusic = (track, pause=false)=>{
    currentsong.src= "/songs/" + track + ".mp3"
    if(!pause){
        currentsong.play()  
    }
    document.querySelector(".songinfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}
async function main(){

    //get list of songs
    let songs= await getSongs()

    playmusic(songs[0].slice(0, -4 ),true)

    //show all the songs in the playlist library section
    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
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
    
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".nameandartist").firstElementChild.innerHTML)
            playmusic(e.querySelector(".nameandartist").firstElementChild.innerHTML)
    })
})

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

    //listen for timeupdate event
    currentsong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        console.log((currentsong.currentTime / currentsong.duration) * 100 + "%")
        document.querySelector(".circle").style.left=(currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })
} 
main()
