function setThemeClass() {
document.documentElement.className = Telegram.WebApp.colorScheme;
}
Telegram.WebApp.onEvent('themeChanged', setThemeClass);
setThemeClass();

function addReplicas(replicas) {
    replicas.forEach(element => {
        $(`
        <div class="item">
            <div class="title-wrapper">
                ${element.title}
            </div>
            <div class="content">
                ${element.content}
            </div>
        </div>
        `).insertBefore('#pointer')
    });
}

function newCharacter() {
    let text = prompt("Character name:", "Harry Potter");
    if (text == null || text == "") {
        return;
    }
    addReplicas([{title: text, content: '   '}])
}

$(document).ready(function() {
    var overflown = [];
    $(".title-wrapper").each(function(){
        console.log($(this).html().length)
        if ($(this).html().length > 45) overflown.push($(this))
    });
    overflown.forEach(element => {
        element.marquee({
            //duration in milliseconds of the marquee
            duration: 10000,
            //gap in pixels between the tickers
            gap: 50,
            //time in milliseconds before the marquee will start animating
            delayBeforeStart: 0,
            //'left' or 'right'
            direction: 'left',
            //true or false - should the marquee be duplicated to show an effect of continues flow
            duplicated: true
        }); 
    });
});