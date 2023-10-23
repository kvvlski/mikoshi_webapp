function setThemeClass() {
document.documentElement.className = Telegram.WebApp.colorScheme;
}
Telegram.WebApp.onEvent('themeChanged', setThemeClass);
setThemeClass();

var lc = {
    'ru': {
        newCharacter: 'Новый персонаж',
        temperature: 'Креативность',
        speed: 'Скорость озвучки',
        memory: 'Память',
        erase: 'Очистить'
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

            var id = element.id || key;
            var image = element.image || ''

            if (image) image = `<img src=${image}/>`

            $('.grid').prepend(`
            <div id="${id}" class="item">
                <div class="title-wrapper">
                    ${element.shortName}
                </div>${image}
                <div class="content">
                    ${content}
                </div>
            </div>
            `)
        }
    }
}

function addScenarios() {
    fetch(`https://mikoshibot.ru/scenarios`).then(response => response.json()).then(data => {
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                $('.gallery').prepend(`
                <div id="-${key}" class="item">
                    <div class="title-wrapper">
                        ${element.name}
                    </div>
                    <img src=${element.image}>
                    <div class="content">
                        ${element.comment}
                    </div>
                    </div>
                `)
            }
        }
    })
}

function newCharacter() {
    var text = $('#name')[0].value;
    if (text == null || text == "") {
        return;
    }
    fetch(`https://mikoshibot.ru/replicas?userid=${uid}&name=${text}`,
    {
        method: 'POST'
    }).then(response =>
        response.json().then(
            data => addReplicas([data])
        )
    )
    // addReplicas([]);
    $.modal.close();
    return text;
}

var uid;

$(document).on('keypress',function(e) {
    if(e.which == 13) {
        newCharacter();
    }
});

function roundFix(number, precision)
{
    var multi = Math.pow(10, precision);
    return Math.round( (number * multi).toFixed(precision + 1) ) / multi;
}

var pshown = false;
var overflown = [];
$(document).ready(function() {
    $('.settings-button').on('click', function() {
        if (!pshown) $('#popup').css({
            bottom: '0px',
        })
        else $('#popup').css({
            bottom: '-1000px',
        })
        pshown = !pshown;
    })

    $('#erase').on('click', function() {
        fetch(`https://mikoshibot.ru/settings?userid=${uid}&key=history&value=[]`,
        {method: 'POST'});  
    })

    $('#temp').on('change', function() {
        var val = $(this).val() / 100;
        $(this).prev().text(`${roundFix(val, 2)*100}%`)
        fetch(`https://mikoshibot.ru/settings?userid=${uid}&key=temperature&value=${val}`,
        {method: 'POST'});
    })


    $('#speed').on('change', function() {
        var val = $(this).val() / 100;
        $(this).prev().text(`${roundFix(val, 2)*100}%`)
        fetch(`https://mikoshibot.ru/settings?userid=${uid}&key=sk_speed&value=${val}`,
        {method: 'POST'});
    })

    var WebApp = window.Telegram.WebApp;
    if (WebApp.initDataUnsafe.hasOwnProperty('user'))
    {
        uid = WebApp.initDataUnsafe.user.id;
        fetch(`https://mikoshibot.ru/replicas?userid=${uid}`)
            .then(data => data.json())
            .then(json => {
                addReplicas(json.replicas);
        });
        addScenarios();

        var lang = WebApp.initDataUnsafe.user.language_code;
        if (lang) $('.footer-button').text(lc[lang].newCharacter);
        if (lang) $('#ptemp').text(lc[lang].temperature);
        if (lang) $('#pspeed').text(lc[lang].speed);
        if (lang) $('#pmemory').text(lc[lang].memory);
        if (lang) $('#erase').val(lc[lang].erase);
        
        var val;
        function setslider(selector, value) {
            $(selector).val(value);
        }

        fetch(`https://mikoshibot.ru/settings?userid=${uid}&key=temperature`)
        .then(resp => resp.json())
        .then(data => {
            $('#ptemp').next().text(`${data.temperature*100}%`);
            $('#temp').val(data.temperature*100);
        })

        fetch(`https://mikoshibot.ru/settings?userid=${uid}&key=sk_speed`)
        .then(resp => resp.json())
        .then(data => {
            $('#pspeed').next().text(`${data.sk_speed*100}%`);
            $('#speed').val(data.sk_speed*100);
        })

        $(document).on('click', '.item', function(e) {
            if (e.target.parentElement && 
            e.target.parentElement.className == 'item')
            {
                var id = e.target.parentElement.id;
            } else var id = e.target.id;
            console.log(e.target);
            console.log(e.target.parentElement.className);
            fetch(`https://mikoshibot.ru/select?userid=${uid}&id=${id}`,
            {
                method: 'POST'
            }).then(data => console.log(data));
        });

        $(".title-wrapper").each(function(){
            console.log($(this));
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
       
    } else {
        $('#footer').remove();
    }
    
    WebApp.ready();
});