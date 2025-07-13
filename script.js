console.log("lest write JS for spotify");

//global variables.....
let currensong = new Audio();
let songs;
let currFolder;

async function getsongs(folder){

    currFolder = folder
    let a =await fetch(`${folder}/`);
    console.log("Fetching folder:", `/${folder}/`);
    let response = await a.text();
    // console.log(response); //tabular form mali je je jotu hoy e lai levi have 

    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];  
        
        if(element.href.endsWith(".m4a") || (element.href.endsWith(".mp3"))){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // console.log(songs)
    // return songs
    // show all the numbers in play list
    let songUL = document.querySelector(".songList ul")
    songUL.innerHTML= ""; // clear the previous songs
    // console.log(songUL)
    for (const song of songs) {
        songUL.innerHTML += `<li>
                        <img class="invert" src="img/music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20" , " ")} </div> 
                            <div>Ridham </div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert" src="img/play.svg" alt="">
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
    currensong.src =`/${currFolder}/`+track
    currensong.play()
    document.querySelector(".songinfo").innerHTML =decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
    play.src = "img/pause.svg"
}

async function displayAlbum() {
    let a =await fetch(`songs/`);
    let response = await a.text();

    let div = document.createElement("div")
    let cardContainer = document.querySelector(".cardContainer")
    div.innerHTML = response; 
    let anchers = div.getElementsByTagName("a")

    let array = Array.from(anchers)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
        // console.log(e.href);
        if (e.href.includes("/songs")) {
    let parts = e.href.split("/").filter(Boolean);
    let folder = parts[parts.length - 1];

    try {
        let a = await fetch(`songs/${folder}/info.json`);
        let response = await a.json();

        cardContainer.innerHTML += `
            <div class="card" data-folder="${folder}">
              <div class="play ">
             <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="35"
                height="35"
                fill="none"
                style="display: block; margin: auto;">
            <circle cx="12" cy="12" r="10" stroke="#ededb7ff" stroke-width="1.5" />
            <path d="M15.9453 12.3948C15.7686 13.0215 14.9333 13.4644 13.2629 14.3502C11.648 15.2064 10.8406 15.6346 10.1899 15.4625C9.9209 15.3913 9.6758 15.2562 9.47812 15.0701C9 14.6198 9 13.7465 9 12C9 10.2535 9 9.38018 9.47812 8.92995C9.6758 8.74381 9.9209 8.60868 10.1899 8.53753C10.8406 8.36544 11.648 8.79357 13.2629 9.64983C14.9333 10.5356 15.7686 10.9785 15.9453 11.6052C16.0182 11.8639 16.0182 12.1361 15.9453 12.3948Z"
                stroke="#ededb7ff"
                stroke-width="1.5"
                stroke-linejoin="round" />
            </svg>

              </div>
              <img src="/songs/${folder}/cover.jpg" alt="" />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>
        `;
    } catch (err) {
        console.warn(`info.json not found for: ${folder}`, err);
    }
}

    }
    // load the list when it is clicked....
    Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
        console.log("clicked on album", item.currentTarget.dataset.folder);
        console.log(item.currentTarget, item.currentTarget.dataset);  // ✅ fixed
        const folder = item.currentTarget.dataset.folder;
        songs = await getsongs(`songs/${folder}`);
        });
    });
    
}


//***************************************************************************************************************
//********************************************************************************************************************************
//********************************************************************************************************* */

async function main() {

   

    // get the list of all songs....
    await getsongs("songs/ncs")
    console.log(songs)  

    // display all the albumson the page.....
    displayAlbum()
    
    // Attach an event listner to NEXT , PAUSE , PREVIOUS...
    play.addEventListener("click" , ()=>{
        if(currensong.paused){
            currensong.play()
            play.src = "img/pause.svg"
        }
        else{
            currensong.pause()
            play.src = "img/play.svg"
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


    // add an event to volume.....
   
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("setting volume to" , e.target.value)
        // 1 to 100 ni vachhe value ape 
        // currensong.volume = parseInt(e.target.value)/100
        const volumeIcon = document.querySelector(".volume-icon")
        const vol = parseInt(e.target.value)/100
        currensong.volume = vol

        volumeIcon.src = vol === 0 ? "img/mute.svg" : "img/volume.svg";
        
        
    })
   

    document.querySelector(".volume>img").addEventListener("click",(e)=>{
        console.log("volume icon clicked")

        if(e.target.src.includes("volume.svg")){
            e.target.src = "img/mute.svg"
            currensong.volume = 0 
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
             e.target.src = "img/volume.svg"
             currensong.volume = 0.1
             document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })
    
    
    
}   

main()
 