console.log("Here we gooo")
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
async function main(){
    //get list of songs
    let songs= await getSongs()

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

    
}

main()
