let text = document.querySelector('.texts'),
    submitBtn = document.querySelector('.submit_btn'),
    searchBar = document.querySelector('.search_bar'),
    textInput = 'Search For A Word Or Phrase Or Something',
    searchResult = document.querySelector('.search_result'),
    demo = document.querySelector('.demo'),
    loader = document.querySelector('.loader');
let i = 0;
function typeIn() {
    text.textContent += textInput.charAt(i)
    i++;
    setTimeout(typeIn, 100);
}
typeIn();
//Create an error message
function displayErr(message) {
    let newNode = document.createElement('p');
    newNode.setAttribute('class', 'errMessage');
    let newText = document.createTextNode(message)
    newNode.appendChild(newText);
    document.querySelector('#err').append(newNode);
    setTimeout(() => {
        newNode.remove();
    }, 3000);
}
async function searchText() {
    //Display error if search box is empty
    if (searchBar.checkValidity() == false || searchBar.value === '') {
        displayErr(searchBar.validationMessage);
    } else {
        //Display results
        loader.style.display = 'block';
        let searchInput = searchBar.value;
        searchInput = searchInput.split(' ').join('_');
        await fetch('https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=30&srsearch=%27' + searchInput)
            .then((resp) => {
                return resp.json()
            })
            .then((resp) => {
                console.log(resp);
                searchResult.innerHTML = '';
                let k = 0;
                let results;
                loader.style.display = 'none'
                for (let j = 0; j < 5; j++) {
                    results = `
                        <div class='results'>
                            <h3 class='results_title'> ${k + 1}. ${resp.query.search[j].title}</h3>
                            <p class='results_snippet'>${resp.query.search[j].snippet}</p>
                            <div class='link_flex'>
                                <div></div>
                                <a class='results_link' href='https://en.wikipedia.org/?curid=${resp.query.search[j].pageid}'>Check more</a>    
                            </div>
                        </div>
                    `
                    k++;
                    searchResult.innerHTML += results;
                }
            })
            .catch((err) => { displayErr(err.message) } );
    }
}
submitBtn.addEventListener('click', searchText);