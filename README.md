# Задание: Fetch с использованием Strapi

## Цель

Получить записи своей сущности из Strapi с помощью `fetch`, превратить их в HTML-карточки через `map` и вывести на страницу.

---

## Шаг 1. Инициализвация

Создайте и подключите `script.js`. И далее работайте в нем

---

## Шаг 2. Сделайте карточку своей сущности

Возьмите образец карточки и перепишите CSS под вашу сущность:

- переименуйте классы и блоки при необходимости;
- для **каждого поля** вашей сущности должен быть свой элемент: строки в заголовок и текст, число в цену, рейтинг и т.п., булеан в бейдж, картинка в `<img>`;
- стили нужно менять и дополнять.

Пока что просто статично отрисуйте одну карточку и захардкодите данные вашей сущности в верстку. Далее вы будете её использовать как шаблон.

---

## Шаг 3. Структура ответа Strapi

```json
{
  "data": [
    {
      "id": 1,
      "documentId": "abc123",
      "title": "Название",
      "description": "Описание",
      "price": 1200,
      "inStock": true,
      "cover": { "url": "/uploads/photo_1.jpg" }
    }
  ],
  "meta": { "pagination": { ... } }
}
```

_`data` - массив ваших сущностей, там будут ключи которые вы создавали_

---

## Шаг 4. Рисуем карточки из данных API

1. **`fetch(url, options)`** отправляет запрос и возвращает _промис_. Сам по себе он ещё не содержит данных.
2. **`await fetch(...)`** ждёт ответа сервера. Результат — объект `Response`. Это не ваши данные, а «конверт» с заголовками, статусом и телом.
3. **`response.ok`** равно `true`, если статус 200–299. **Важно:** `fetch` не выбрасывает ошибку при 403, 404 или 500. Он ошибается только при проблемах с сетью. Поэтому статус нужно проверять вручную и самим бросать ошибку: `throw new Error(...)`.
4. **`await response.json()`** читает тело ответа и превращает JSON-строку в JS-объект. Это тоже асинхронно, поэтому снова `await`.
5. Полученный объект — массив записей лежит в поле **`data`**.
6. Дальше `data.map(...)` превращает каждую запись в строку с HTML карточки, `join('')` склеивает их в одну строку, а `innerHTML` вставляет результат в контейнер.
7. Весь код оборачивается в **`try / catch`**. Если что-то пошло не так (нет сети, `throw new Error` из шага 3, ошибка парсинга), управление попадает в `catch`, и мы показываем пользователю сообщение об ошибке.

Сначала смотрите, что пришло, потом пишите рендер.

### 4.1. Делаем запрос и смотрим структуру

Создайте в `script.js` минимальный запрос. Пока без карточек, только получить данные и посмотреть на них:

```js
const BASE_URL = 'https://strapi.kitek-pg.ru'
const API_URL = `${BASE_URL}/api/ВАША_СУЩНОСТЬ_ВО_МНОЖЕСТВЕННОМ_ЧИСЛЕ?populate=*`
const API_TOKEN = 'ВАШ_ТОКЕН'

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
```

Откройте страницу и DevTools (`F12`). Структуру можно посмотреть двумя способами.

**Способ 1. Вкладка Console.** Найдите свой `console.log`, нажмите на стрелочку рядом с объектом и раскройте `data`, затем первый элемент `0`. Вы увидите все ключи записи и их значения.

**Способ 2. Вкладка Network.**

1. Откройте Network и включите фильтр **Fetch/XHR**.
2. Перезагрузите страницу.
3. Кликните на запрос к вашему API (название сущности в списке).
4. Вкладка **Response** показывает «сырой» JSON, а **Preview** показывает его в виде раскрывающегося дерева. Здесь же, во вкладке **Headers**, видно статус ответа и заголовки запроса.

Изучите как выглядит ответ сервера.

Примерно у вас будут такие ключи

| Ключ          | Тип            | Пример значения                          |
| ------------- | -------------- | ---------------------------------------- |
| `title`       | string         | `"Мастер и Маргарита"`                   |
| `description` | string         | `"Роман о..."`                           |
| `price`       | number         | `1200`                                   |
| `inStock`     | boolean        | `true`                                   |
| `releaseDate` | date           | `"2024-03-14"`                           |
| `cover`       | image (объект) | `{ "url": "/uploads/photo_1.jpg", ... }` |

### 4.2. Берём шаблон из вашей вёрстки

Возьмите HTML статичной карточки, которую вы сверстали в шаге 2. Например, у вас получилась такая:

```html
<article class="card">
    <img
        class="card__image"
        src="https://via.placeholder.com/300x200"
        alt="Название" />
    <div class="card__body">
        <h2 class="card__title">Название</h2>
        <p class="card__text">Описание</p>
        <div class="card__footer">
            <span class="card__price">1200 ₽</span>
            <span class="badge badge--yes">В наличии</span>
        </div>
    </div>
</article>
```

Скопируйте эту разметку в функцию `createCard` внутрь обратных кавычек (шаблонной строки). Дальше заменяем каждую заглушку на `${...}` с нужным ключом.

```js
function createCard(item) {
    return `
        <article class="card">
            <img
                class="card__image"
                src="https://via.placeholder.com/300x200"
                alt="Название" />
            <div class="card__body">
                <h2 class="card__title">Название</h2>
                <p class="card__text">Описание</p>
                <div class="card__footer">
                    <span class="card__price">1200 ₽</span>
                    <span class="badge badge--yes">В наличии</span>
                </div>
            </div>
        </article>
    `
}
```

### 4.3. Доступ к ключам

Функция `createCard(item)` получает **одну запись** из массива `data`. Это обычный JS-объект, и к его полям мы обращаемся через точку:

```js
item.title // строка: "Мастер и Маргарита"
item.price // число: 1200
item.inStock // булеан: true
item.cover.url // вложенный объект: "/uploads/photo_1.jpg"
```

Чтобы не писать `item.` каждый раз, можно сразу достать нужные поля **деструктуризацией**:

```js
const { title, description, price, inStock, cover, releaseDate } = item
```

Обе записи равноценны: `item.title` и `title` после деструктуризации дают одно и то же. Имена в `{ }` должны **точно совпадать** с ключами из ответа API.

```js
function createCard(item) {
    const { title, description, price, inStock, cover, releaseDate } = item

    return `
        <article class="card">
          <img class="card__image" src="${BASE_URL}${cover.url}" alt="${title}" />
          <div class="card__body">
            <h2 class="card__title">${title}</h2>
            <p class="card__text">${description}</p>
            <div class="card__footer">
              <span class="card__price">${price} ₽</span>
            </div>
          </div>
        </article>
    `
}
```

**Правила по типам данных:**

- **Строки** подставляем как есть: `${title}`.
- **Числа** тоже подставляем как есть, а единицы измерения дописываем рядом с `${}`: `${price} ₽`. Для красивого вывода больших чисел можно использовать `${price.toLocaleString('ru-RU')} ₽`, и `1200000` превратится в `1 200 000 ₽`.
- **Картинки.** Strapi отдаёт относительный путь (`/uploads/...`), поэтому перед ним нужно добавить `BASE_URL`. Картинка может отсутствовать (`null`), и тогда обращение `cover.url` упадёт с ошибкой. Поэтому всегда проверяем наличие `cover` и подставляем alt.

Если значение может отсутствовать (`null`), используйте оператор `?.`: `cover?.url` вернёт `undefined` вместо ошибки. А для значения по умолчанию добавляйте `??`: `description ?? 'Описание отсутствует'`.

### 4.4. Как рисовать булеаны

Булеан это `true` или `false`. Нам нужно превратить его в понятный элемент. Для этого используем **тернарный оператор**:

```
условие ? значение_если_true : значение_если_false
```

**Вариант 1. Меняем только текст:**

```js
${inStock ? 'В наличии' : 'Нет в наличии'}
```

**Вариант 2. Меняем текст и класс (бейдж зелёный или красный):**

```js
<span class="badge ${inStock ? 'badge--yes' : 'badge--no'}">
    ${inStock ? 'В наличии' : 'Нет в наличии'}
</span>
```

В CSS у вас должны быть описаны оба класса: `.badge--yes` (зелёный) и `.badge--no` (красный). Мы просто выбираем нужный в зависимости от значения.

**Вариант 3. Иконка:**

```js
<span>${inStock ? '✅' : '❌'}</span>
```

Тернарный оператор можно вставлять прямо внутрь `${ }` в шаблонной строке, как показано выше. Если условие сложное, вынесите результат в переменную перед `return`:

```js
const stockText = inStock ? 'В наличии' : 'Нет в наличии'
const stockClass = inStock ? 'badge--yes' : 'badge--no'
```

и подставьте `${stockText}` и `${stockClass}`.

### 4.5. Как рисовать даты

Strapi отдаёт даты строкой, например:

- поле типа `date`: `"2024-03-14"`
- поля `createdAt`, `updatedAt`, `publishedAt` и поле типа `datetime`: `"2024-03-14T10:30:00.000Z"`

Пользователю такой формат показывать не надо. Превращаем строку в объект `Date` и форматируем:

```js
const date = new Date(releaseDate)

const formattedDate = date.toLocaleDateString('ru-RU')
// "14.03.2024"
```

Если нужен более развёрнутый формат, передайте настройки:

```js
const formattedDate = new Date(releaseDate).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
})
// "14 марта 2024 г."
```

Для даты со временем используйте `toLocaleString`:

```js
const formattedDateTime = new Date(createdAt).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
})
// "14.03.2024, 13:30"
```

Дата тоже может быть пустой (`null`). Тогда `new Date(null)` даст `01.01.1970`, а `new Date(undefined)` даст `Invalid Date`. Поэтому делаем проверку:

```js
const formattedDate = releaseDate
    ? new Date(releaseDate).toLocaleDateString('ru-RU')
    : 'Дата не указана'
```

И добавляем в разметку карточки:

```js
<p class="card__date">${formattedDate}</p>
```

Посмотреть как еще больше кастомизировать вывод можно [тут](https://doka.guide/js/date/)

### 4.6. Собираем всё вместе: отрисовка списка

Теперь в `loadCards` после получения данных нужно взять массив `result.data`, превратить каждую запись в строку HTML и вставить на страницу. Полный код:

```js
...

function createCard(item) {
    const { title, description, price, inStock, cover, releaseDate } = item

    const imageUrl = cover
        ? `${BASE_URL}${cover.url}`
        : 'https://via.placeholder.com/300x200?text=No+image'

    const formattedDate = releaseDate
        ? new Date(releaseDate).toLocaleDateString('ru-RU')
        : 'Дата не указана'

    return `
    <article class="card">
      <img class="card__image" src="${imageUrl}" alt="${title}" />
      <div class="card__body">
        <h2 class="card__title">${title}</h2>
        <p class="card__text">${description}</p>
        <p class="card__date">${formattedDate}</p>
        <div class="card__footer">
          <span class="card__price">${price} ₽</span>
          <span class="badge ${inStock ? 'badge--yes' : 'badge--no'}">
            ${inStock ? 'В наличии' : 'Нет в наличии'}
          </span>
        </div>
      </div>
    </article>
  `
}

async function loadCards() {
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
```

`items.map(createCard)` вызывает `createCard` для каждой записи и возвращает **массив строк** (по одной на карточку). `.join('')` склеивает этот массив в одну длинную строку без разделителей (иначе между карточками появятся запятые). Затем `innerHTML` превращает строку в реальные DOM-элементы.

## Как сдавать

1. Создайте форк репозитория в организации `31ISR` с названием репо.
2. Используя ветку `wip` сделайте задание
3. Зафиксируйте изменения в вашем репозитории
4. Когда документ будет готов - создайте пул реквест из ветки `wip` (вашей) на ветку `main` (тоже вашу) и укажите меня ([ktkv419](https://github.com/ktkv419)) как reviewer
5. Захостите работу на Pages

**Не мержите сами коммит**, это сделаю я после проверки задания
