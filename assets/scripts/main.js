const sit_container = document.getElementById('situation_container');
const loader = document.getElementById('loader');

const today = $('#today');
const tomorrow = $('#tomorrow');
const dayAfterTomorrow = $('#dayAfterTomorrow');

var data = {};

const API_ID = 'cd18782ad9d9d3977de4a251a7d6a558';

var city = 'sari';//initial value

const clearDiv = () => {
    $(today).removeClass('active');
    $(tomorrow).removeClass('active');
    $(dayAfterTomorrow).removeClass('active');
}

const dayOnClickHandler = (elem , time) => {
    clearDiv();    
    $(elem).addClass('active');
    render(time);
}

$(today).click(function(e){dayOnClickHandler(today,0)});
$(tomorrow).click(function(e){dayOnClickHandler(tomorrow,8)});
$(dayAfterTomorrow).click(function(e) {dayOnClickHandler(dayAfterTomorrow,16)});

const getDate = (dt , timezone) => {
    let date = new Date(dt*1000-(timezone*1000));
    date = date.toString().split(' ');

    const day = date[0];
    const year = `${date[1]},${date[2]},${date[3]}`;

    return (
        {
            day,
            year
        }
    )
}

const getIcon = (iconCode) => {
    return "http://openweathermap.org/img/w/" + iconCode + ".png";
}

const render = async (time = 0) => {
    sit_container.style.visibility='hidden';
    loader.style.visibility= 'visible';

    await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_ID}`)
    .then(response => {
        return response.json();
    })
    .then(res => {
        data = res;
        sit_container.style.visibility='visible';
        loader.style.visibility= 'hidden';
    })
    .catch(err => {
        console.error(err);
    });
    
    //giving value to each of three div
    for(let i = 0 ; i<3 ; i++){
        const currentDay = getDate(data.list[i*8].dt,data.city.timezone);
        $(`.day${i+1}_icon`).attr('src',getIcon(data.list[i*8].weather[0].icon));
        $(`.day${i+1}_day`).text(currentDay.day);
        $(`.day${i+1}_deg`).text(`${(data.list[i*8].main.temp - 273.15).toFixed(1)}°C`);

    }
    
    date = getDate(data.list[time].dt,data.city.timezone);
    
    $('#windSpeed').text(`${data.list[time].wind.speed} km/h`)
    $('#humidity').text(`${data.list[time].main.humidity}%`);
    $('#temperature').text(`${(data.list[time].main.temp - 273.15).toFixed(1)}°C`);
    $('#weather_sit').text(data.list[time].weather[0].description)
    $('#day').text(date.day);
    $('#date').text(date.year);
    $('#city').text(data.city.name);
    $('#country').text(data.city.country)
    $('.icon').attr('src', getIcon(data.list[time].weather[0].icon));
    
}


const searchCity = () => {
    city =  $('#searchTextField').val();
    render();
    $('#searchTextField').val('');
}

$("#searchTextField").keyup(function(event) {
    if (event.keyCode === 13) {
        clearDiv();
        dayOnClickHandler(today , 0)
        searchCity();
    }
});
    
render();