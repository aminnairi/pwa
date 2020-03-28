const createCard = ({placeholder, src, alt, title, text}) => {
    const element = document.createElement("div");

    element.innerHTML = `
        <section class="card">
          <header>
            <figure>
              <div class="placeholder" style="background-image: url(${placeholder})"></div>
              <img data-src="${src}" alt="${alt}">
            </figure>
          </header>
          <main>
            <h1>${title}</h1>
            <p>${text}</p>
          </main>
        </section>
    `;

    return element;
};

const intersectionObserverHandler = (entries, observer) => {
    entries.forEach(({isIntersecting, target}) => {
        if (isIntersecting) {
            const placeholder = target.parentNode.querySelector(".placeholder");

            if (!placeholder) {
                throw new ReferenceError("placeholder not found");
            }

            target.setAttribute("src", target.dataset.src);

            target.addEventListener("load", () => {
                placeholder.classList.add("fade");
            });

            observer.unobserve(target);
        }
    });
};

(async () => {
    try {
        const intersectionObserver = new IntersectionObserver(intersectionObserverHandler, {});
        const skeleton = document.querySelector(".skeleton");


        if (!skeleton) {
            throw new ReferenceError("skeleton not found");
        }

        const app = document.querySelector("#app main");

        if (!app) {
            throw new ReferenceError("app shell not found");
        }

        const response = await fetch("/data/images.json");

        if (!response.ok || 200 > response.status || 299 < response.status) {
            throw new ReferenceError("unable to fetch SpaceX data");
        }

        const data = await response.json();

        data.forEach(({placeholder, image: src, content: {title, description: text}}) => {
            const card = createCard({
                alt: text,
                placeholder,
                src,
                text,
                title
            });

            const image = card.querySelector("img");

            intersectionObserver.observe(image);

            app.appendChild(card);
        });

        skeleton.setAttribute("hidden", "");
    } catch (error) {
        console.error(error);
    }
})();
