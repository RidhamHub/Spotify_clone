console.log("lest write JS for spotify");

//global variables.....
let currensong = new Audio();
let songs;


async function getsongs(){

    let a =await fetch("songs/");
    let response = await a.text();
    // console.log(response); //tabular form mali je je jotu hoy e lai levi have 

    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];  
        
        if(element.href.endsWith(".m4a") || (element.href.endsWith(".mp3"))){
            songs.push(element.href.split("/songs/")[1])
        }
    }

    // console.log(songs)
    return songs
}   

function convertToMinutesSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    return `${minutes}:${formattedSeconds}`;
}


const playMusic = (track)=>{
    // let audio = new Audio("/video 84_Spotify/songs/"+track)
    // console.log(audio)
    currensong.src = "/video 84_Spotify/songs/"+track
    currensong.play()
    document.querySelector(".songinfo").innerHTML =decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
    play.src = "pause.svg"
}

async function main() {

   

    // get the list of all songs....
    songs =await getsongs()
    console.log(songs)  

    // show all the numbers in play list
    let songUL = document.querySelector(".songList ul")
    // console.log(songUL)
    for (const song of songs) {
        songUL.innerHTML += `<li>
                        <img class="invert" src="music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20" , " ")} </div> 
                            <div>Ridham </div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert" src="play.svg" alt="">
                        </div>
                       </li>` 
        
    }

    // Attach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click" , element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
        // aa chhe ne list no pelo div apse
        
    });

    // Attach an event listner to NEXT , PAUSE , PREVIOUS...
    play.addEventListener("click" , ()=>{
        if(currensong.paused){
            currensong.play()
            play.src = "pause.svg"
        }
        else{
            currensong.pause()
            play.src = "play.svg"
        }
    }) 

    // isten for time update event
    currensong.addEventListener("timeupdate",()=>{
        // console.log(currensong.currentTime, currensong.duration)
        document.querySelector(".songtime").innerHTML = 
        `${convertToMinutesSeconds(currensong.currentTime)} / 
        ${convertToMinutesSeconds(currensong.duration)}`

        document.querySelector(".circle").style.left = (currensong.currentTime/currensong.duration )*100 + "%"
    })

    // add event litener for seekbar circle 
    document.querySelector(".seekbar").addEventListener("click" ,(e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100 ;
        document.querySelector(".circle").style.left = percent + "%" ;
        
       currensong.currentTime = (currensong.duration * percent) /100
    })
    

    // add event litener for hamburger
    document.querySelector(".hamburger").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "0"

    })

    // add event litener for close button
    document.querySelector(".close").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "-110%"

    })

    // add event litener for  previous button
    previous.addEventListener("click" , ()=>{
        console.log("previous clicked")
        // console.log(currensong.src)  
        // console.log(currensong.src.split("/").slice(-1)[0]);
        let index = songs.indexOf(currensong.src.split("/").slice(-1)[0])
        console.log(index);
        if(index - 1 >= 0){
            playMusic(songs[index-1])
        }
        
    })

    // add event litener for next button
    next.addEventListener("click" , ()=>{
        console.log("Next clicked")
        // console.log(currensong.src)  
        // console.log(currensong.src.split("/").slice(-1)[0]);
        let index = songs.indexOf(currensong.src.split("/").slice(-1)[0])
        console.log(index);
        if(index + 1 < songs.length){
            playMusic(songs[index+1])
        }
        
    })


    const volumeIcon = document.querySelector(".volume-icon")
    // add an event to volume.....
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("setting volume to" , e.target.value)
        // 1 to 100 ni vachhe value ape 
        // currensong.volume = parseInt(e.target.value)/100

        const vol = parseInt(e.target.value)/100
        currensong.volume = vol

        volumeIcon.src = vol === 0 ? "mute.svg" : "volume.svg";
        
        
    })
    const volume = document.querySelector(".volume");

    // volume.addEventListener("click", () => {
    //     console.log("mute is pressed , volume is set to 0")

    //     if (currensong.volume > 0){
    //         volumeIcon.src = "mute.svg"
    //         currensong.volume = 0
    //     }
    //     else{
    //         volumeIcon.src = "volume.svg"
    //         currensong.volume = parseInt(e.target.value)/100
    //     }
        
    // });

}   

main()
 