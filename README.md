# PERN Refresh – Woche 1

Dieses Projekt ist ein separates Trainingsprojekt. Dein originales Bon-Marché-Projekt wird nicht verändert.

## Wochenziel

Zuerst prüfen, ob Express + PostgreSQL + Sequelize aus dem Gedächtnis noch sicher implementiert werden können. TypeScript kommt später.

| Tag        | Schwerpunkt                                                     |
| ---------- | --------------------------------------------------------------- |
| Montag     | Sequelize-Verbindung, Product Model, GET, `findAll`, `findByPk` |
| Dienstag   | Product CRUD, `create`, `update`, `destroy`                     |
| Mittwoch   | Suche + `Op.iLike` + Query Params                               |
| Donnerstag | Pagination + `limit`, `offset`, `count`                         |
| Freitag    | Associations + `include` und Mini-Challenge                     |

## Danach

Woche 2 wird stärker aus deinem echten Bon-Marché-PERN-Backend abgeleitet: User/Address, Cart/CartItem, Orders/OrderItems, Reviews und M:N Favorites.

## Wichtig aus der Analyse deines Originalprojekts

Im Original sind bereits viele Sequelize-Bereiche umgesetzt. Im `user.controller.js` befinden sich aber noch nicht migrierte Mongoose-Stellen, besonders Cart, Checkout und E-Mail-Order-Flows. Diese werden später als echte Migrationstickets bearbeitet.

## Start

1. `.env.example` nach `.env` kopieren und deine lokale PostgreSQL-Verbindung eintragen.
2. `npm install`
3. Erstelle bei Bedarf eine leere Datenbank `pern_refresh`.
4. Bearbeite `DAY-1-TICKET.md`.

Keine fertigen Lösungen aus dem Originalprojekt kopieren.
