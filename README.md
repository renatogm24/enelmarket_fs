<h1 align="center">
  <br>

enelmarket.com

  <p align="center">
  <img src="https://img.shields.io/github/v/release/renatogm24/enelmarket_fs">
  <a href="https://enelmarket.com/">
      <img src="https://img.shields.io/website?url=https://enelmarket.com/">
  </a>
    <a href="https://github.com/renatogm24/enelmarket_fs">
      <img src="https://img.shields.io/github/last-commit/renatogm24/enelmarket_fs">
  </a>
    <img src="https://gpvc.arturio.dev/renatogm24">
</p>

</h1>
<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#development">Development</a> •
  <a href="#built-with">Built with</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>
<p align="center">
  <a href="https://www.emprendeadvisor.com/" target="_blank">
    <img src="https://github.com/renatogm24/enelmarket_fs/frontend/public/bgimage.jpg"
         alt="Logo banner" width="500px">
  </a>
  </p>

## Key Features

- Responsive design
- Register/Login users with encrypted passwords (Bcrypt)
- Create online store through subromain example.enelmarket.com
- Store page:
  - Edit portrait image
  - Edit icon image
- Create and order store categories
- Products:
  - Create new products (with image)
  - Edit existing products
  - Create variants per product (color, size, ...)
  - Create options per variant (black, white, ...)
  - Assing price per option and per variant. (tshirt - white - small : $25)
- Create and edit shipment methods
- Create and edit payment methods
- Follow new orders and update their status
- Shopping cart functionalities
- Select address on map (Google Maps API)
- Confirmation screen when order is generated

## How To Use

In order to configure the environment variables, it is necessary to create a .env.local for the frontend

```bash
ROOT_URL=localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080/api
NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY=#######
```

And modify the next values for the backend

```bash
spring.datasource.url=jdbc:mysql://localhost:3306/name_schema
spring.datasource.username=db_username
spring.datasource.password=db_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

amazon.s3.bucket-name=##############
amazon.s3.endpoint=http://#######.s3.amazonaws.com/
amazon.s3.access-key=#######
amazon.s3.secret-key=#######

spring.servlet.multipart.max-file-size=XMB //Replace X
spring.servlet.multipart.max-request-size=6MB //Replace X

spring.servlet.multipart.enabled=true
spring.servlet.multipart.location=/path/to/tmp
```

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone hhttps://github.com/renatogm24/enelmarket_fs
# Go into the repository
$ cd enelmarket_fs
# Go into the backend
$ mvn spring-boot:run
# Go into the frontend
$ npm run install
$ npm run build
$ npm run start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Development

Want to contribute? Great!

To fix a bug or enhance an existing module, follow these steps:

- Fork the repo
- Create a new branch (`git checkout -b improve-feature`)
- Make the appropriate changes in the files
- Add changes to reflect the changes made
- Commit your changes (`git commit -am 'Improve feature'`)
- Push to the branch (`git push origin improve-feature`)
- Create a Pull Request

#### Bug / Feature Request

If you find a bug (the website couldn't handle the query and / or gave undesired results), kindly open an issue [here](https://github.com/renatogm24/emprendeadvisor/issues/new) by including your search query and the expected result.

If you'd like to request a new function, feel free to do so by opening an issue [here](https://github.com/renatogm24/emprendeadvisor/issues/new). Please include sample queries and their corresponding results.

## Built with

This web app uses the following libraries:

#### FrontEnd

- [NextJS](https://nextjs.org/)
- [React](https://es.reactjs.org/)
- [react-hook-form](https://react-hook-form.com/)
- [react-query](https://react-query.tanstack.com/)
- [react-redux](https://react-redux.js.org/)
- [redux-persist](https://github.com/rt2zz/redux-persist)
- [use-places-autocomplete](https://www.npmjs.com/package/use-places-autocomplete)
- [immutability-helper](https://github.com/kolodny/immutability-helper)
- [jwt-decode](https://www.npmjs.com/package/jwt-decode)
- [framer-motion](https://www.framer.com/motion/)
- [Material UI](https://mui.com/)

#### BackEnd

- [Java 11](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html)
- [Spring Boot 2.6](https://spring.io/quickstart)
- [Spring Security](https://spring.io/projects/spring-security)
- [Amazon S3 client](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)
- [java-jwt](https://github.com/auth0/java-jwt)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)

## Related

[enelmarket-web](https://enelmarket.com/) - Web of enelmarket
[rumbero-web](https://rumbero.enelmarket.com/) - Web of rumbero.enelmarket

## Support

<a href="https://www.buymeacoffee.com/renatogaray" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## License

MIT

[![Webpage](https://img.shields.io/badge/web-renatogaray.dev-orange)](https://renatogaray.dev)
[![Follow me on GitHub](https://img.shields.io/badge/github-renatogm24-%23121011.svg?style=flat&logo=github&logoColor=white)](https://github.com/renatogm24)
[![Follow me on LinkedIn](https://img.shields.io/badge/LinkedIn-renatogaray-blue?style=flat&logo=linkedin&logoColor=b0c0c0&labelColor=363D44)](https://www.linkedin.com/in/renatogaray)
