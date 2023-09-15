function setThemeClass() {
document.documentElement.className = Telegram.WebApp.colorScheme;
}
Telegram.WebApp.onEvent('themeChanged', setThemeClass);
setThemeClass();

var lc = {
    'ru': {
        newCharacter: 'Новый персонаж'
    }
};

function addReplicas(replicas) {
    for (const key in replicas) {
        if (Object.hasOwnProperty.call(replicas, key)) 
        {
            const element = replicas[key];

            var content = "-"
            if (element.history.length > 0)
                content = element.history.slice(-1)['content']
            else if (element.comment !== '')
                content = element.comment

            $('.grid').prepend(`
            <div id="${key}" class="item">
                <div class="title-wrapper">
                    ${element.shortName}
                </div>
                <div class="content">
                    ${element.history}
                </div>
            </div>
            `)
        }
    }
}

function newCharacter() {
    var text = $('#name')[0].value;
    if (text == null || text == "") {
        return;
    }
    fetch(`https://45.87.247.127:5050/replicas?userid=${uid}&name=${text}`,
    {
        method: 'POST'
    }).then(response => console.log(response));
    addReplicas([{shortName: text, history: []}]);
    $.modal.close();
    return text;
}

var uid;

$(document).on('keypress',function(e) {
    if(e.which == 13) {
        newCharacter();
    }
});

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
   
    var WebApp = window.Telegram.WebApp;
    if (WebApp.initDataUnsafe.hasOwnProperty('user'))
    {
        uid = WebApp.initDataUnsafe.user.id;
        fetch(`https://45.87.247.127:5050/replicas?userid=${uid}`)
            .then(data => data.json())
            .then(json => {
                addReplicas(json.replicas);
        });

        var lang = WebApp.initDataUnsafe.user.language_code;
        if (lang) $('.footer-button').text(lc[lang].newCharacter);
        $(document).on('click', '.item', function(e) {
            var id = e.target.id;
            console.log(id)
            fetch(`https://45.87.247.127:5050/select?userid=${uid}&id=${id}`,
            {
                method: 'POST'
            }).then(response => console.log(response));
        });
    } else {
        $('#footer').remove();
    }
    WebApp.ready();
});