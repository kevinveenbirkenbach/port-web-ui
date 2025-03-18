# Portfolio CMS: Flask-based Portfolio Management🚀
[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-GitHub%20Sponsors-blue?logo=github)](https://github.com/sponsors/kevinveenbirkenbach) [![Patreon](https://img.shields.io/badge/Support-Patreon-orange?logo=patreon)](https://www.patreon.com/c/kevinveenbirkenbach) [![Buy Me a Coffee](https://img.shields.io/badge/Buy%20me%20a%20Coffee-Funding-yellow?logo=buymeacoffee)](https://buymeacoffee.com/kevinveenbirkenbach) [![PayPal](https://img.shields.io/badge/Donate-PayPal-blue?logo=paypal)](https://s.veen.world/paypaldonate)


This software allows individuals and institutions to set up an easy portfolio/landingpage/homepage to showcase their projects and online presence. It is highly customizable via a YAML configuration file.

## Features ✨

- **Dynamic Navigation**: Easily create dropdown menus and nested links.
- **Customizable Cards**: Showcase your skills, projects, or services.
- **Cache Management**: Optimize your assets with automatic caching.
- **Responsive Design**: Beautiful on any device with Bootstrap.
- **Easy Configuration**: Update content using a YAML file.

## Access 🌐

### Locale
Access the application locally at [http://127.0.0.1:5000](http://127.0.0.1:5000).

## Getting Started 🏁

### Prerequisites 📋

- Docker and Docker Compose installed on your system.
- Basic knowledge of Python and YAML for configuration.

### Installation 🛠️

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. **Update the configuration:**
   Create a `config.yaml` file. You can use `config.sample.yaml` as an example (see below for details on the configuration).

3. **Build and run the Docker container:**
   ```bash
   docker-compose up --build
   ```

4. **Access your portfolio:** Open your browser and navigate to [http://localhost:5000](http://localhost:5000).

## Configuration Guide 🔧

The portfolio is powered by a YAML configuration file (`config.yaml`). This file allows you to define the structure and content of your site, including cards, navigation, and company details.

### YAML Configuration Example 📄

```yaml
accounts:
  name: Online Accounts
  description: Discover my online presence.
  icon:
    class: fa-solid fa-users
  children:
    - name: Channels
      description: Platforms where I share content.
      icon:
        class: fas fa-newspaper
      children:
        - name: Microblogs
          description: Stay updated with my microblog posts.
          icon:
            class: fa-solid fa-pen-nib
          children:
            - name: Mastodon
              description: Follow my updates on Mastodon.
              icon:
                class: fa-brands fa-mastodon
              url: https://microblog.veen.world/@kevinveenbirkenbach
              identifier: "@kevinveenbirkenbach@microblog.veen.world"
  cards:
    - icon:
        source: https://cloud.veen.world/s/logo_agile_coach_512x512/download
      title: Agile Coach
      text: I lead agile transformations and improve team dynamics through Scrum and Agile Coaching.
      url: https://www.agile-coach.world
      link_text: www.agile-coach.world
company:
  titel: Kevin Veen-Birkenbach
  subtitel: Consulting and Coaching Solutions
  logo:
    source: https://cloud.veen.world/s/logo_face_512x512/download
  favicon:
    source: https://cloud.veen.world/s/veen_world_favicon/download
  address:
    street: Afrikanische Straße 43
    postal_code: DE-13351
    city: Berlin
    country: Germany
  imprint_url: https://s.veen.world/imprint
```

### Understanding the `children` Key 🔍

The `children` key allows hierarchical nesting of elements. Each child can itself have children, enabling the creation of multi-level navigation menus or grouped content. Example:

```yaml
children:
  - name: Parent Item
    description: Parent description.
    icon:
      class: fa-solid fa-folder
    children:
      - name: Child Item
        description: Child description.
        icon:
          class: fa-solid fa-file
        url: https://example.com
```

This structure will render a parent menu or section containing nested child elements. Each child can be further customized with icons, descriptions, and links.

### Understanding the `link` Key 🔗

The `link` key allows you to reference another part of the YAML configuration by its path. This is useful for avoiding duplication and maintaining consistency. Example:

```yaml
children:
  - name: Blog
    description: My blog posts.
    icon:
      class: fa-solid fa-blog
    url: https://example.com/blog
  - name: Featured Blog
    link: accounts.children[0].children[0]  # References the "Blog" item above
```

In this example, `Featured Blog` will inherit all properties from the `Blog` item, including its name, description, and URL. This feature ensures that any updates to the `Blog` item are automatically reflected in all linked entries.

## Administrate Docker 🐳

### Stop and Destroy
```bash
docker stop portfolio; docker rm portfolio
```

### Build
```bash
docker build -t application-portfolio .
```

### Run

#### Run Development Environment
```bash
docker run -d -p 5000:5000 --name portfolio -v $(pwd)/app/:/app -e FLASK_APP=app.py -e FLASK_ENV=development application-portfolio
```

#### Run Production Environment
```bash
docker run -d -p 5000:5000 --name portfolio application-portfolio
```

### Debug
```bash
docker logs -f portfolio
```

## Development Mode 🧑‍💻

To run the app in development mode with hot-reloading:

```bash
FLASK_ENV=development docker-compose up
```

## Deployment 🚢

For production deployment, ensure to:

- Use a reverse proxy like NGINX or Apache.
- Secure your site with SSL/TLS.
- Use a production-ready database if required.

## Author ✍️

This software was created by [Kevin Veen-Birkenbach](https://www.veen.world/).

## License 📜

This project is licensed under the GNU Affero General Public License Version 3. See the [LICENSE](./LICENSE) file for details.