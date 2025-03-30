// Time and date

let currentTime = document.getElementById('time');
let currentDate = document.getElementById('date');

function Time() {
    let date = new Date();
    currentTime.innerHTML = date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
    currentDate.innerHTML = date.toLocaleDateString();
}

setInterval(Time, 1000) 


// Title bar _________________________________________________________________________________

const title = document.getElementById('title');
if (localStorage.getItem('title')) {
    title.innerText = localStorage.getItem('title');
}

function saveTitle() {
    localStorage.setItem('title', title.innerText);
}

title.addEventListener('input', saveTitle)


/* Quick links _________________________________________________________________________________
 Denna del innehåller länkar som användaren sparat. 
 Användaren kan ta bort länkar (3a) samt lägga till nya (3b). 
 När användaren lägger till nya länkar ska användaren fylla i länken samt en rubrik 
 som denna vill ska synas i dashboarden. */

let counter = 0; // changes in the code to make it go somewhere else
let linkName = "";
let url = ""
let inputText = ""; 

let input = document.getElementById('linkInput');
let linkContainer = document.getElementById('linkContainer');
let linkForm = document.getElementById('linkForm');

linkForm.addEventListener('submit', function(event) {
    event.preventDefault();

    
    if (input.value !== "" && counter === 0) {
        if (!input.value.startsWith('https')){
            alert("Vänligen ange en giltig URL")
        }
        url = input.value.trim();
        counter = 1;
        input.placeholder = "Ange namn"
        input.value = "";
    }
    else if (counter === 1 && input.value !== "") {
        linkName = input.value;
        input.value = "";

        let linkBubble = document.createElement('div');
        linkBubble.textContent = linkName;
        linkBubble.className = 'linkBubble';

        linkBubble.addEventListener('click', function(){
            window.open(url, '_blank')
        });

        linkContainer.appendChild(linkBubble);

        input.placeholder = 'Lägg till länk';
        counter = 0;
    }
});





    