# it-challenge-frontend (React + Vite)

Frontend pre HoloHome obchod napojený na backend (autentifikácia, produkty, košík, objednávky a role).

## Rýchly štart

1) Nainštaluj závislosti (v priečinku `itChallengeFrontend`):

```powershell
npm install
```

2) Nastav .env

Vytvor/otvor `.env` a nastav URL backendu (musí obsahovať `/api`):

```env
VITE_API_URL=http://localhost:3000/api
```

3) Spusti dev server:

```powershell
npm run dev
```

Aplikácia beží na `http://localhost:5173` (štandardne).

## Funkcionalita

- Prihlásenie: POST `/api/auth/login` (z backendu)
	- token a user sa uložia do LocalStorage
	- všetky chránené requesty posielajú hlavičku `Authorization: Bearer <token>`
- Produkty: `GET /api/products` (zoznam)
- Košík (po prihlásení):
	- `GET /api/cart` načíta košík
	- `POST /api/cart/add` (body: `{ productId }`) pridá kus
	- `POST /api/cart/remove` zníži množstvo o 1
	- `POST /api/cart/remove-all` odstráni všetky kusy produktu
	- `DELETE /api/cart` vyčistí košík
- Objednávky:
	- `POST /api/orders` vytvorí objednávku z košíka a košík vyprázdni
	- `GET /api/orders/my` zoznam objednávok prihláseného usera

## Stránky a role

- Návštevník (neprihlásený): môže browse-ovať, ale pri kliknutí „Zaplatiť“ bude presmerovaný na Login
- Prihlásený USER: má prístup k /account, /orders, košík sa synchronizuje so serverom
- ADMIN: navyše prístup k /admin
- SPRAVCA (manager): navyše prístup k /manager

## Technické poznámky

- `src/utils/api.js` automaticky pridáva hlavičku `Authorization: Bearer <token>` ak je token v LocalStorage
- `AuthContext` (src/context/AuthContext.jsx) drží token + user a poskytuje `login()`/`logout()`
- `CartContext` synchronizuje košík so serverom pri prihlásenom userovi, pre návštevníka používa lokálne úložisko
- `Shop.jsx` sťahuje produkty z backendu a renderuje ich cez `Product` komponent
- `Orders.jsx` zobrazuje objednávky prihláseného usera

## Typický flow

1. Spusti backend (pozri backend README)
2. Spusti frontend (`npm run dev`)
3. Prihlás sa (seedovaný admin: `admin@itchallenge.com` / `admin123`)
4. V /shop pridaj produkt do košíka
5. V košíku klikni „Zaplatiť“ → vytvorí objednávku a presmeruje na /orders

## Troubleshooting

- Skontroluj, že `VITE_API_URL` smeruje na správny backend (musí končiť `/api`)
- CORS: nastav `CORS_ORIGIN` v backend `.env`, ak blokuje prehliadač requesty
- 401/403: token expirovaný alebo chýba hlavička `Authorization`
- Porty kolidujú: zmeň `PORT` v backend `.env` alebo frontend port cez Vite config
