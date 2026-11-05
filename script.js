const BASE_URL = 'https://strapi.kitek-pg.ru'
const API_URL = `${BASE_URL}/api/dishes?populate=*`
const API_TOKEN = '148b0c1ed3bf8f4bb4b24ff75b1601b37797672569560415170f946f53d2311418542997a8407626680f95cd6a1e83e12ed712018a40bb7b5b45f2e155c62a804b8fd6aaf75d850923eb845f0493e32fa8f73f0476a663d0f70a60d1e16080d539216a42efc5b960f6fbfe76fcb3e8bc67a37c6eb69a0971533939468eb774d3'

function createCard(data) {
    let cover = data.dishImage
    const imageUrl = cover
        ? `${BASE_URL}${cover.url}`
        : 'https://via.placeholder.com/300x200?text=No+image'
    let rate = ""
    let rating = Number(data.dishRating)
    if (rating>=8 && rating<=10){
        rate = "rating--8-10";}
    else if (rating>=5 && rating<=7){
        rate = "rating--5-7";}
    else if (rating>=1 && rating<=4){
        rate = "rating--1-4";}
    return `
       <article class="card">
                <img class="card__image" src="${imageUrl}" alt="${data.dishName}" />
                <div class="card__body">
                    <h2 class="card__title">${data.dishName}</h2>
                    <p class="card__country">${data.creatorCountry}</p>
                    <div class="card__extraInfo">
                        <span class="card__calories">${data.amountOfCalories}/100г</span>
                        <span class="card__cookType">${data.cookType}</span>
                    </div>
                    <div class="card__footer">
                        <span class="card__price">${data.dishPrice.toLocaleString('ru-RU')} ₽</span>
                        <p class="card__rating ${rate}">${rating}/10</p>
                        <span class="card__vegan badge ${data.isVegan ? 'badge--yes' : 'badge--no'}">
                        ${data.isVegan ? 'Веганское' : 'Не веганское'}
                        </span>
                    </div>
                </div>
            </article>
    `
}

async function loadCards() {
    const statusEl = document.querySelector('.status') 
    const cardsEl = document.querySelector('.cards')
    try {
        statusEl.textContent = 'Загрузка...'

        // 1. Делаем запрос
        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        })

        // 2. Проверяем статус вручную (fetch сам не бросает ошибку на 403/404/500)
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`)
        }

        // 3. Читаем JSON
        const result = await response.json()

        // 4. Достаём массив записей
        const items = result.data

        if (items.length === 0) {
            statusEl.textContent = 'Записей пока нет'
            cardsEl.innerHTML = ''
            return
        }

        // 5. map: каждая запись -> строка HTML. join(''): склеиваем в одну строку
        cardsEl.innerHTML = items.map(createCard).join('')
        statusEl.textContent = ''
    } catch (error) {
        console.error(error)
        cardsEl.innerHTML = ''
        statusEl.textContent = `Не удалось загрузить данные: ${error.message}`
        statusEl.classList.add('status--error')
    }
}

loadCards()