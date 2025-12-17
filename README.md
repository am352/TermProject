# CampusBooks - Affordable eCommerce Textbook Shop

CampusBooks is an eCommerce website that allows students and non-students alike to browse and buy a variety of textbooks.
(This is a mock website for a term project).

## CampusBooks - Features
- **Storefront / ShopPage**
  - Textbook grid view, showcasing textbook titles, image preview, and pricing.
  - Products on storefront (textbooks) are seeded in database.
  - Search bar feature can be utilized to search for textbooks by title.
 
- **Pages**
  - Home Page
  - Shop
  - About
  - FAQ
  - Profile/Login
  - 'Shopping' Cart

- **NavBar**
  - Contains links to the aforementioned pages (Home/Shop/About/Profile/Cart).

- **'Shopping' Cart**
  - Cart is frontend and stored in localstorage
  - Add to cart buttons are available in the shop page, underneath each product.
  - Cart page shows the items added (localstorage; payments do not actually link to real payment processor).

- **Database**
  - Node.js + Express via server.js
  - Database utilizes SQLite locally via (/data/book-shop.db).
  - Tables
    - products : All available Textbooks
    - customers : Accounts
    - cart_items : Cart (Server Side)
    - order_items/orders : Purchase History
    - /db/init.js : Script to seed products

  =====

  ## Stack
  - **FrontEnd** : HTML / CSS / JavaScript
  - **Backend** : Node.js / Express
  - **Database** : SQLite
  - **ViewEngine** : Pug
  - **Authentification Method** : bcrypt.js (Password Hashing) / express-session (Session Login)

  =====

# Setup/Install Instructions
1. Requirements
   - Node.js must be installed
   - Dependancies (Instructions below)

2. Download Repo
   Either download the zip file directly from the repo or clone via:
   `git clone https://github.com/am352/TermProject.git`

3. Dependancies
   - Install in project folder via:
   `npm install`

4. Database Initialization
   Command below applies sql (/db/schema.sql) to create products, cart_items, order_items tables.
   - Initialize Database via:
   `node db/init.js`
   - Reset Database via:
   `node db/init.js`

5. Server Initialization
   `npm start`

6. Listening via `https://localhost:3000`
