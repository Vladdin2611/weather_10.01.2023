const UI_ELEMENTS = {
	INPUT: document.querySelector('.input__search'),
	BUTTON_SEARCH: document.querySelector('.button__search'),
	SERVER_URL: 'http://api.openweathermap.org/data/2.5/weather',
	APIKEY: 'f660a2fb1e4bad108d6160b7f58c555f',
	SEARCH_RESULT_CITY: document.querySelector('.left__city'),
	TEMPERATURE: document.querySelector('.temp'),
	LIKE: document.querySelector('.like'),
	CITY_ROW: document.querySelector('.city__row'),
	RIGTH: document.querySelector('.rigth'),
	LEFT_UP: document.querySelector('.left__up'),
	CONTENT: document.querySelectorAll('.content__weather'),
	BUTTON: document.querySelectorAll('.button'),
	FORM: document.querySelector('.form1'),
	CITY_NAME: document.querySelector('.city__name'),
	TEMPERATURE: document.querySelector('.temp'),
	TEMPERATURE_2: document.querySelector('.temp2'),
	FEELS_LIKE: document.querySelector('.feels__like'),
	WEATHER_HOW: document.querySelector('.weather__how'),
	SUNRISE: document.querySelector('.sunrise'),
	SUNSET: document.querySelector('.sunset'),
}

//выбрать активный контент
for (let i = 0; i < UI_ELEMENTS.BUTTON.length; i++) {
	const tab = UI_ELEMENTS.BUTTON[i];
	tab.addEventListener('click', getActiveTab)

	function getActiveTab() {
		for (let i = 0; i < UI_ELEMENTS.BUTTON.length; i++) {
			const removeActiveTab = UI_ELEMENTS.BUTTON[i];
			removeActiveTab.classList.remove('btn__active')
		}

		for (let i = 0; i < UI_ELEMENTS.CONTENT.length; i++) {
			const removeActiveTContent = UI_ELEMENTS.CONTENT[i];
			removeActiveTContent.classList.remove('_active')
		}
		let tabId = tab.getAttribute("data-tab");
		let currentContent = document.querySelector(tabId);

		tab.classList.add('btn__active')
		currentContent.classList.add('_active')

	}
}
//-------------------

document.addEventListener('DOMContentLoaded', getContnetLoaded);
function getContnetLoaded() {
	searchCity(currentCity);
	renderRightTabUi();
}

const storage = {
	getCurrentCity: function () {
		return localStorage.getItem('currentCity');
	},
	saveCurrentCity: function (currentCity) {
		localStorage.setItem('currentCity', currentCity);
	},
	saveCityFavoriteList: function (cityFavoriteList) {
		localStorage.setItem('cityFavoriteList', JSON.stringify(cityFavoriteList));
	},
	getCityFavoriteList: function () {
		return JSON.parse(localStorage.getItem('cityFavoriteList'));
	},
}
//let currentCity = 'Moscow'
currentCity = storage.getCurrentCity();
//let cityFavoriteList = []
cityFavoriteList = storage.getCityFavoriteList()

UI_ELEMENTS.FORM.addEventListener('submit', formDo)
function formDo(event) {
	event.preventDefault();
	searchCity(UI_ELEMENTS.INPUT.value)
	UI_ELEMENTS.INPUT.value = ''
}

function searchCity(name) {
	const cityName = name;
	const url = `${UI_ELEMENTS.SERVER_URL}?q=${cityName}&appid=${UI_ELEMENTS.APIKEY}`;
	fetch(url)
		.then(
			response => response.json(),
		)
		.then(currentCity.length = 0)
		.then(
			data => {
				//console.log(data)
				UI_ELEMENTS.SEARCH_RESULT_CITY.textContent = `${data.name}`
				UI_ELEMENTS.CITY_NAME.textContent = `${data.name}`
				UI_ELEMENTS.TEMPERATURE.textContent =
					Math.round(`${data.main.temp - 273.15}`) + ` C`
				UI_ELEMENTS.TEMPERATURE_2.textContent =
					`Temperature: ` + Math.round(`${data.main.temp - 273.15} `) + ` C`
				UI_ELEMENTS.FEELS_LIKE.textContent =
					`Feels like: ` + Math.round(`${data.main.feels_like - 273.15} `) + ` C`
				UI_ELEMENTS.WEATHER_HOW.textContent = `Weather: ` + `${data.weather[0].main}`
				UI_ELEMENTS.SUNRISE.textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).getHours()}:${new Date(data.sys.sunrise * 1000).getMinutes()}`
				UI_ELEMENTS.SUNSET.textContent = `Sunset: ${new Date(data.sys.sunset * 1000).getHours()}:${new Date(data.sys.sunset * 1000).getMinutes()}`

				currentCity = `${data.name}`
				storage.saveCurrentCity(currentCity);
			}
		)
		.catch(err => alert(err))
}

UI_ELEMENTS.LIKE.addEventListener('click', function () {
	addFavoriteList(currentCity)
})

function addFavoriteList(newCityFavorite) {
	let findName = cityFavoriteList.findIndex(function (findName) {
		return findName.name === newCityFavorite;
	});
	if (findName >= 0) {
		alert('Такой город уже есть');
		return;
	} else if (newCityFavorite === "") {
		alert('Введите название города');
	} else {
		cityFavoriteList.push({
			name: newCityFavorite,
		});
	}
	renderRightTabUi()
}

function renderRightTabUi() {
	UI_ELEMENTS.CITY_ROW.innerHTML = "";
	cityFavoriteList.forEach(function (city, index) {
		cityRender = UI_ELEMENTS.CITY_ROW
		addInrigthRow(city, index, cityRender);
	})

	storage.saveCityFavoriteList(cityFavoriteList)
}

function cityFavoriteToLeftTab(name) {
	searchCity(name)
}

function addInrigthRow(city, index, cityRender) {

	const newCity = document.createElement('div')
	newCity.id = index
	newCity.className = 'new_city__row'
	cityRender.append(newCity)

	const newCityBtn = document.createElement('button')
	newCityBtn.className = 'likes__city'
	newCityBtn.textContent = city.name
	newCity.append(newCityBtn)

	const deleteCity = document.createElement('button')
	deleteCity.className = 'delete__city'
	deleteCity.innerHTML = '&#215'
	newCity.append(deleteCity)

	deleteCity.addEventListener('click', function () {
		deleteNewCity(newCity.id)
	})

	newCityBtn.addEventListener('click', function () {
		cityFavoriteToLeftTab(city.name);
	})
}

function deleteNewCity(idTask) {
	cityFavoriteList.splice(idTask, 1);
	renderRightTabUi()
}
function cityFavoriteToLeftTab(name) {
	searchCity(name)
}


