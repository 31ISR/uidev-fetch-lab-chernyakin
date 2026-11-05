const BASE_URL = 'https://strapi.kitek-pg.ru'
const API_URL = `${BASE_URL}/api/dishes?populate=*`
const API_TOKEN = '148b0c1ed3bf8f4bb4b24ff75b1601b37797672569560415170f946f53d2311418542997a8407626680f95cd6a1e83e12ed712018a40bb7b5b45f2e155c62a804b8fd6aaf75d850923eb845f0493e32fa8f73f0476a663d0f70a60d1e16080d539216a42efc5b960f6fbfe76fcb3e8bc67a37c6eb69a0971533939468eb774d3'

async function loadCards() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`)
        }

        const result = await response.json()
        console.log(result)
    } catch (error) {
        console.error(error)
    }
}
loadCards()
if ${dishRating}>=1 && ${dishRating}<=4:
    const
function createCard(item) {
    return `
       <article class="card">
                <img class="card__image" src="https://via.placeholder.com/300x200" alt="Название" />
                <div class="card__body">
                    <h2 class="card__title">${dishName}</h2>
                    <p class="card__country">${creatorCountry}</p>
                    <div class="card__extraInfo">
                        <span class="card__calories">${amountOfCalories}/100г</span>
                        <span class="card__cookType">${cookType}</span>
                    </div>
                    <div class="card__footer">
                        <span class="card__price">${dishPrice} ₽</span>
                        <p class="card__rating rating--8-10">8/10</p>
                        <span class="card__vegan badge badge--no">Не веганское</span>
                    </div>
                </div>
            </article>
    `
}