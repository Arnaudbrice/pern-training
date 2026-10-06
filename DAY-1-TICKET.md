# PERN Refresh – Tag 1 (90 Minuten)

## Ziel

Prüfen, ob die Grundlagen von PostgreSQL + Sequelize + Express noch selbstständig sitzen.

## 0–15 Min: Active Recall – ohne Nachschauen

---

1. Welche Aufgabe übernimmt Sequelize zwischen Node.js und PostgreSQL?

---

**Sequelize ist ein ORM** (_Object-Relational Mapper_). Es vermittelt zwischen deinem **Node.js-/JavaScript-Code** und der **PostgreSQL-Datenbank**.

Statt direkt SQL zu schreiben:

```sql
SELECT * FROM products;
```

kannst du mit Sequelize z. B. schreiben:

```js
const products = await Product.findAll();
```

Sequelize übersetzt das intern in SQL und schickt die Abfrage an PostgreSQL.

Merksatz:

```text
Node.js / JavaScript
        ↓
     Sequelize
        ↓
       SQL
        ↓
   PostgreSQL
```

---

2. Was ist der Unterschied zwischen einem Sequelize Model und einer PostgreSQL-Tabelle?

---

Genau. ✅

Etwas genauer:

Ein **Sequelize Model** ist die JavaScript-Abbildung einer Tabelle.

Zum Beispiel:

```js
const Product = sequelize.define("Product", {
  title: DataTypes.STRING,
  price: DataTypes.DECIMAL,
});
```

beschreibt sinngemäß eine PostgreSQL-Tabelle wie:

```text
products
---------
id
title
price
createdAt
updatedAt
```

Wichtig ist der Unterschied:

**Model**
→ existiert in deinem Node.js-Code

**Tabelle**
→ existiert wirklich in PostgreSQL und speichert die Daten

Merksatz:

```text
Sequelize Model = Bauplan/Abbildung
PostgreSQL-Tabelle = tatsächlicher Speicherort
```

Deine Antwort war also richtig, nur **„beschreibt/abbildet eine Tabelle“** ist präziser als „ist eine Tabelle“.

---

**Frage 3:**
Was ist der Unterschied zwischen:

---

```js
Product.findAll();
```

und

```js
Product.findByPk(5);
```

Genau. ✅ Beide Antworten sind richtig.

Kleine Präzisierung:

```js
Product.findAll();
```

liefert normalerweise ein **Array von Product-Instanzen** zurück:

```js
[Product, Product, Product];
```

und:

```js
Product.findByPk(5);
```

sucht anhand des **Primary Keys**. In deinem Fall ist das typischerweise `id = 5`.

Wenn kein Produkt mit diesem Primary Key existiert, bekommst du:

```js
null;
```

Also:

```text
findAll()      → mehrere Datensätze → Array
findByPk(5)    → genau ein Datensatz oder null
```

### Frage 4

Was macht dieser Code?

```js
const product = await Product.findByPk(req.params.id);
```

GET /api/products/5

bekommst du:

const { id } = req.params;

console.log(id); // "5"

Denn req.params ist ein Objekt:

{
id: "5"
}

Beim Query-Parameter:

GET /api/products?search=orange

bekommst du:

const { search } = req.query;

console.log(search); // "orange"

Oder direkt:

const search = req.query.search;

Erkläre bitte:

1. Woher kommt `req.params.id`?
2. Was passiert mit diesem Wert?
3. Was könnte `product` am Ende enthalten?

4. Wofür wird `DataTypes` verwendet?

R:
DataTypes definiert, welchen Datentyp ein Feld im Sequelize-Model hat. 5. Was macht `sequelize.authenticate()`?

R:
sequelize.authenticate() prüft, ob Sequelize erfolgreich eine Verbindung zur PostgreSQL-Datenbank herstellen kann.

6. Unterschied zwischen `findAll()`, `findOne()` und `findByPk()`?

R:
findAll() → mehrere Datensätze als Array
findOne() → erster passender Datensatz oder null
findByPk(5) → Datensatz mit Primary Key 5 oder null

7. Wo liegt der Unterschied zwischen MongoDB `_id` und der üblichen Sequelize/PostgreSQL `id`?

R:

Bei **MongoDB** bekommt jedes Dokument standardmäßig ein Feld:

```js
_id;
```

zum Beispiel:

```js
{
  _id: ObjectId("..."),
  title: "Orange"
}
```

Bei **PostgreSQL/Sequelize** ist der Primary Key normalerweise einfach:

```js
id;
```

zum Beispiel:

```js
{
  id: 5,
  title: "Orange"
}
```

Darum musst du beim Wechsel von MERN zu PERN im Frontend oft sowas ändern:

```js
product._id;
```

zu:

```js
product.id;
```

Merksatz:

```text
MongoDB → _id
PostgreSQL/Sequelize → id
```

## 15–65 Min: Coding

Implementiere nur die TODOs `D1.1` bis `D1.15`.

Anforderungen:

- Sequelize-Verbindung
- Product Model
- GET `/api/products`
- GET `/api/products/:id`
- 404 für nicht vorhandenes Produkt
- Fehler an Error-Middleware weiterreichen

## 65–80 Min: Testen

Teste z. B. mit Postman/Thunder Client:

- GET `/api/products`
- GET `/api/products/1`
- GET mit einer nicht vorhandenen numerischen ID

## 80–90 Min: Erklären

Erkläre ohne Code:
Request -> Express Router -> Controller -> Sequelize Model -> PostgreSQL -> JSON Response

## Regel

Nicht in dein originales PERN-Projekt schauen, bevor du die Aufgabe selbst versucht hast.
Wenn du hängen bleibst, schreibe z. B. `Hinweis PERN D1.6`.
