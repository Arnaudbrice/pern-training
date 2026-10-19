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

# Migrations

## migration status check

```bash
npx sequelize-cli db:migrate:status \
  --config src/db/config.cjs \
  --migrations-path src/db/migrations
```

Kontrolliere, dass die bisherigen Migrationen bis 009 als up angezeigt werden und 010-create-orders.js noch down ist.

Terminal should display:

```bash
Using environment "development".
up 000-baseline-existing-schema.js
up 004-add-password-to-users.js
up 005-make-categories-name-unique.js
up 006-add-categoryId-to-products.js
up 007-make-products-userId-foreignKey.js
up 008-remove-old-products-category.js
up 009-make-products-stock-notnull.js
down 010-create-orders.js
```

## migrate ausführen

```bash
npx sequelize-cli db:migrate \
  --config src/db/config.cjs \
  --migrations-path src/db/migrations
```

terminal should display:

```bash
Using environment "development".
== 010-create-orders: migrating =======
== 010-create-orders: migrated (0.102s)
```

## Check with postgreSQL if the table has been successfully created

```bash
psql "postgres://postgres:<password>@localhost:5433/<databaseName>"
```

then

```bash
<databaseName>=# \d "Orders"
```

or

```bash
<databaseName>=# \dt

             List of relations
 Schema |     Name      | Type  |  Owner
--------+---------------+-------+----------
 public | Categories    | table | postgres
 public | Orders        | table | postgres ⬅︎ the new table
 public | Products      | table | postgres
 public | SequelizeMeta | table | postgres
 public | Users         | table | postgres
(5 rows)

```

```bash
Orders
├── id
├── userId
├── status
└── shippingCosts
     │
     └── OrderItems
          ├── orderId
          ├── productId
          ├── quantity
          ├── unitPrice       ← historischer Kaufpreis
          ├── title           ← Snapshot
          ├── image           ← Snapshot
          └── description     ← Snapshot
```
