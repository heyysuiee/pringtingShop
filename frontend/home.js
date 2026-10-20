            (() => {
                const menuToggle = document.querySelector("#menuToggle");
                const navLinks = document.querySelector("#navLinks");
                const slider = document.querySelector("#heroSlider");
                const slides = [...slider.querySelectorAll(".image-container")];
                const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
                let activeIndex = 0;
                let autoplay;

                function setMenuOpen(isOpen) {
                    navLinks.classList.toggle("show", isOpen);
                    menuToggle.setAttribute("aria-expanded", String(isOpen));
                    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
                    menuToggle.textContent = isOpen ? "×" : "☰";
                }

                menuToggle.addEventListener("click", () => {
                    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
                });

                navLinks.addEventListener("click", (event) => {
                    if (event.target.closest("a")) setMenuOpen(false);
                });

                document.addEventListener("keydown", (event) => {
                    if (event.key === "Escape") setMenuOpen(false);
                });

                function showSlide(index) {
                    activeIndex = (index + slides.length) % slides.length;

                    slides.forEach((slide, slideIndex) => {
                        const isActive = slideIndex === activeIndex;
                        slide.classList.toggle("is-active", isActive);
                        slide.setAttribute("aria-hidden", String(!isActive));
                    });
                }

                function stopAutoplay() {
                    window.clearInterval(autoplay);
                }

                function startAutoplay() {
                    stopAutoplay();
                    if (!reducedMotion.matches && !document.hidden) {
                        autoplay = window.setInterval(() => showSlide(activeIndex + 1), 5000);
                    }
                }

                slider.addEventListener("mouseenter", stopAutoplay);
                slider.addEventListener("mouseleave", startAutoplay);
                slider.addEventListener("focusin", stopAutoplay);
                slider.addEventListener("focusout", (event) => {
                    if (!slider.contains(event.relatedTarget)) startAutoplay();
                });
                document.addEventListener("visibilitychange", startAutoplay);
                reducedMotion.addEventListener("change", startAutoplay);
                startAutoplay();

                const services = {
                    invitation: {
                        label: "Invitation",
                        title: "Invitation Printing",
                        kicker: "For life's special moments",
                        description: "Set the tone for birthdays, weddings, and christenings with a custom invitation design.",
                        palette: ["#f1e5d7", "#60483a", "#b87968"],
                        samples: [
                            ["birthday-invitation", "Birthday Invitation", "A cheerful invitation sample for birthdays and milestones.", "/frontend/image/invitation/Bdayinvitation.jpg"],
                            ["wedding-invitation", "Wedding Invitation", "An elegant stationery sample for wedding celebrations.", "/frontend/image/invitation/weddinginvitationj.png"],
                            ["christening-invitation", "Christening Invitation", "A gentle invitation sample for a christening day.", "/frontend/image/invitation/christening.png"]
                        ]
                    },
                    souvenir: {
                        label: "Souvenir",
                        title: "Personalized Souvenirs",
                        kicker: "A keepsake to hold onto",
                        description: "Personalize useful keepsakes for celebrations, gifts, and everyday moments.",
                        palette: ["#eee2d2", "#4f4035", "#c6a15b"],
                        samples: [
                            ["refrigerator-magnet", "Refrigerator Magnet", "A personalized refrigerator magnet sample for a special occasion.", "/frontend/image/souvenir/refmagnet.png"],
                            ["acrylic-keychain", "Acrylic Keychain", "A custom acrylic keychain sample with a personal design.", "/frontend/image/souvenir/keychain.jpg"],
                            ["personalized-nail-cutter", "Personalized Nail Cutter", "A small personalized keepsake concept."],
                            ["white-mug", "White Mug", "A custom print concept for a classic white mug.", "/frontend/image/souvenir/whitemug.png"],
                            ["glass-mug", "Glass Mug", "A custom print sample for a personalized glass mug.", "/frontend/image/souvenir/glassmug.jpg"],
                            ["nordic-mug", "Nordic Mug", "A personalized print concept for a Nordic-style mug."],
                            ["personalized-tote-bag", "Personalized Tote Bag", "A custom tote concept for gifts or everyday use.", "/frontend/image/souvenir/totebag.png"],
                            ["coloring-book", "Coloring Book", "A custom cover concept for a personalized coloring book."]
                        ]
                    },
                    sticker: {
                        label: "Sticker Printing",
                        title: "Sticker Printing",
                        kicker: "Make your mark",
                        description: "Custom sticker concepts for product packaging, business branding, and personal projects.",
                        palette: ["#e8e7dc", "#3e5147", "#b87968"],
                        samples: [
                            ["business-logo-stickers", "Business Logo Stickers", "Brand sticker concept; shape, finish, and size can be discussed."],
                            ["product-label-stickers", "Product Label Stickers", "Label concept for product packaging and small businesses."],
                            ["name-stickers", "Name Stickers", "Personalized name sticker concept for school, gifts, or events."],
                            ["wall-stickers-decals", "Wall Stickers / Decals", "Decorative decal concept for a room or display."]
                        ]
                    },
                    "sintra-board": {
                        label: "Sintra Board",
                        title: "Sintra Board Printing",
                        kicker: "Make the moment stand out",
                        description: "Display board concepts for celebrations, menus, photos, and special spaces.",
                        palette: ["#e8e4d7", "#4e4a3b", "#8e9a78"],
                        samples: [
                            ["birthday-welcome-signs", "Birthday / Welcome Signs", "A welcome sign sample for parties and celebrations.", "/frontend/image/SintraBoard/welcomeBoard.jpg"],
                            ["wedding-signs", "Wedding Signs", "A coordinated sign sample for wedding venues and receptions.", "/frontend/image/SintraBoard/welcomeBoard.jpg"],
                            ["menu-board", "Menu Board", "A clear, custom menu board sample for an event or business.", "/frontend/image/SintraBoard/menuBoard.png"],
                            ["photo-mounting-boards", "Photo Mounting Boards", "A mounted photo presentation sample.", "/frontend/image/SintraBoard/customizePhotoDesign.png"],
                            ["customized-photo-displays", "Customized Photo Displays", "A personalized photo display sample.", "/frontend/image/SintraBoard/customizePhotoDesign.png"],
                            ["photo-collages", "Photo Collages", "A composed collage sample for memories and milestones.", "/frontend/image/SintraBoard/photocollage.png"]
                        ]
                    },
                    "party-needs": {
                        label: "Party Needs",
                        title: "Personalized Party Needs",
                        kicker: "Add a little celebration",
                        description: "Coordinate the small details with personalized party pieces made for your event.",
                        palette: ["#f0e0da", "#5a3d3a", "#d7a6a1"],
                        samples: [
                            ["party-hats", "Party Hats", "A coordinated party hat concept with personalized colors."],
                            ["gable-boxes", "Gable Boxes", "A custom favor box concept for guests and giveaways."],
                            ["gift-thank-you-tags", "Gift / Thank You Tags", "A tag concept for gifts, favors, and thank-you notes."],
                            ["personalized-candles", "Personalized Candles", "A personalized candle label concept for an event."]
                        ]
                    },
                    "large-format": {
                        label: "Tarpaulins & Large Format",
                        title: "Tarpaulins & Large Format Printing",
                        kicker: "Big prints, made clear",
                        description: "Large-format concepts for events, storefronts, announcements, and wayfinding.",
                        palette: ["#e2e8e6", "#344b4c", "#c6a15b"],
                        samples: [
                            ["birthday-wedding-graduation-banners", "Birthday, Wedding & Graduation Banners", "A large-format event banner sample; final dimensions and material require a quote.", "/frontend/image/tarpaulin/event.png"],
                            ["store-banners-promotions", "Store Banners & Promotions", "Promotional banner concept for a store or small business."],
                            ["product-advertisements", "Product Advertisements", "Large-format product advertising concept."],
                            ["stage-backdrops", "Stage Backdrops", "Backdrop concept for a stage, event, or photo area."],
                            ["welcome-banners", "Welcome Banners", "A welcome banner concept for guests and event venues."],
                            ["program-banners", "Program Banners", "A banner concept for event programs and schedules."],
                            ["school-announcements-schedules", "School Announcements & Schedules", "Announcement or schedule layout concept."],
                            ["public-notices", "Public Notices", "A readable public notice layout concept."],
                            ["entrance-signs", "Entrance Signs", "A custom entrance sign concept for a venue or event."],
                            ["directional-banners", "Directional Banners", "A wayfinding banner concept to guide visitors."],
                            ["temporary-signs", "Temporary Signs", "A short-term sign concept for events and promotions."]
                        ]
                    }
                };

                const galleryTabs = [...document.querySelectorAll("[data-gallery-service]")];
                const sampleGrid = document.querySelector("#sample-grid");
                const portfolioGrid = document.querySelector("#portfolio-grid");
                const featuredTitle = document.querySelector("#featured-title");
                const featuredKicker = document.querySelector("#featured-kicker");
                const featuredDescription = document.querySelector("#featured-description");
                const featuredImage = document.querySelector("#featured-image");
                const sampleGalleryTitle = document.querySelector("#sample-gallery-title");
                const featuredPanel = document.querySelector("#service-featured");
                const sampleDialog = document.querySelector("#sample-dialog");
                const requestDialog = document.querySelector("#request-dialog");
                const requestForm = document.querySelector("#request-form");
                const requestCategory = document.querySelector("#request-category");
                const requestSample = document.querySelector("#request-sample");
                const requestReview = document.querySelector("#request-review");
                const formFeedback = document.querySelector("#form-feedback");
                let activeService = "invitation";
                let currentDetail = null;

                function escapeXml(value) {
                    return value.replace(/[<>&'"]/g, (character) => ({
                        "<": "&lt;",
                        ">": "&gt;",
                        "&": "&amp;",
                        "'": "&apos;",
                        "\"": "&quot;"
                    })[character]);
                }

                function artFor(serviceId, sample, index) {
                    const service = services[serviceId];
                    const [background, ink, accent] = service.palette;
                    const title = escapeXml(sample.name);
                    const category = escapeXml(service.label.toUpperCase());
                    const tilt = index % 2 ? 4 : -4;
                    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 520">
                        <rect width="720" height="520" fill="${background}"/>
                        <circle cx="${index % 2 ? 610 : 100}" cy="85" r="112" fill="${accent}" opacity=".22"/>
                        <circle cx="${index % 2 ? 70 : 650}" cy="450" r="150" fill="${ink}" opacity=".08"/>
                        <rect x="154" y="66" width="412" height="388" rx="14" fill="#fffdf8" transform="rotate(${tilt} 360 260)"/>
                        <rect x="207" y="130" width="306" height="188" rx="8" fill="${background}" transform="rotate(${tilt} 360 260)"/>
                        <path d="M248 280l66-78 48 48 47-55 75 85H248z" fill="${accent}" opacity=".85" transform="rotate(${tilt} 360 260)"/>
                        <circle cx="438" cy="188" r="22" fill="${ink}" opacity=".8" transform="rotate(${tilt} 360 260)"/>
                        <text x="360" y="370" fill="${ink}" font-family="Georgia,serif" font-size="25" text-anchor="middle">${title}</text>
                        <text x="360" y="405" fill="${ink}" opacity=".68" font-family="Arial,sans-serif" font-size="12" letter-spacing="3" text-anchor="middle">${category} · SAMPLE ART</text>
                    </svg>`;

                    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
                }

                function getSamples(serviceId) {
                    return services[serviceId].samples.map(([id, name, description, imagePath], index) => ({
                        id,
                        name,
                        description,
                        image: imagePath || artFor(serviceId, { name }, index),
                        isProvidedImage: Boolean(imagePath)
                    }));
                }

                function createSampleCard(serviceId, sample, index, showActions = true) {
                    const card = document.createElement("article");
                    card.className = "sample-card";
                    card.dataset.category = serviceId;

                    const image = document.createElement("img");
                    image.className = "sample-card-image";
                    image.src = sample.image || artFor(serviceId, sample, index);
                    image.alt = sample.isProvidedImage
                        ? `Sample photo for ${sample.name}`
                        : `Temporary sample artwork for ${sample.name}`;
                    image.loading = "lazy";

                    const copy = document.createElement("div");
                    copy.className = "sample-card-copy";
                    const category = document.createElement("p");
                    category.className = "sample-card-category";
                    category.textContent = services[serviceId].label;
                    const title = document.createElement("h4");
                    title.textContent = sample.name;
                    const description = document.createElement("p");
                    description.textContent = sample.description;

                    copy.append(category, title, description);
                    if (showActions) {
                        const actions = document.createElement("div");
                        actions.className = "sample-card-actions";
                        const detailsButton = document.createElement("button");
                        detailsButton.type = "button";
                        detailsButton.className = "sample-card-link";
                        detailsButton.textContent = "View details";
                        detailsButton.addEventListener("click", () => openDetails(serviceId, sample));
                        const requestButton = document.createElement("button");
                        requestButton.type = "button";
                        requestButton.className = "sample-card-link sample-card-request";
                        requestButton.textContent = "Request this design";
                        requestButton.addEventListener("click", () => openRequest(serviceId, sample.id));
                        actions.append(detailsButton, requestButton);
                        copy.append(actions);
                    }
                    card.append(image, copy);
                    return card;
                }

                function renderCategory(serviceId) {
                    activeService = serviceId;
                    const service = services[serviceId];
                    const samples = getSamples(serviceId);
                    galleryTabs.forEach((tab) => {
                        const selected = tab.dataset.galleryService === serviceId;
                        tab.classList.toggle("active", selected);
                        tab.setAttribute("aria-selected", String(selected));
                        tab.tabIndex = selected ? 0 : -1;
                    });
                    featuredPanel.setAttribute("aria-labelledby", galleryTabs.find((tab) =>
                        tab.dataset.galleryService === serviceId).id);
                    featuredTitle.textContent = service.title;
                    featuredKicker.textContent = service.kicker;
                    featuredDescription.textContent = service.description;
                    featuredImage.src = samples[0].image;
                    featuredImage.alt = samples[0].isProvidedImage
                        ? `Sample photo for ${samples[0].name}`
                        : `Temporary sample artwork for ${service.title}`;
                    sampleGalleryTitle.textContent = `${service.label} samples`;
                    sampleGrid.replaceChildren(...samples.map((sample, index) =>
                        createSampleCard(serviceId, sample, index)));
                }

                function openDetails(serviceId, sample) {
                    currentDetail = { serviceId, sampleId: sample.id };
                    document.querySelector("#sample-dialog-image").src = sample.image;
                    document.querySelector("#sample-dialog-image").alt = sample.isProvidedImage
                        ? `Sample photo for ${sample.name}`
                        : `Temporary sample artwork for ${sample.name}`;
                    document.querySelector("#sample-dialog-category").textContent = services[serviceId].label;
                    document.querySelector("#sample-dialog-title").textContent = sample.name;
                    document.querySelector("#sample-dialog-description").textContent = sample.description;
                    sampleDialog.showModal();
                }

                function populateRequestSamples(serviceId, selectedId) {
                    requestSample.replaceChildren(...getSamples(serviceId).map((sample) => {
                        const option = document.createElement("option");
                        option.value = sample.id;
                        option.textContent = sample.name;
                        option.selected = sample.id === selectedId;
                        return option;
                    }));
                }

                function updateConditionalFields(serviceId) {
                    const needsDimensions = ["large-format", "sintra-board", "sticker"].includes(serviceId);
                    document.querySelectorAll(".dimension-field").forEach((field) => {
                        field.hidden = !needsDimensions;
                        const input = field.querySelector("input");
                        input.required = needsDimensions;
                        if (!needsDimensions) input.value = "";
                    });
                    const materialField = document.querySelector(".material-field");
                    materialField.hidden = !["large-format", "sintra-board", "sticker"].includes(serviceId);
                    if (materialField.hidden) materialField.querySelector("input").value = "";
                    const eventField = document.querySelector(".event-field");
                    eventField.hidden = !["invitation", "party-needs", "large-format"].includes(serviceId);
                    if (eventField.hidden) eventField.querySelector("input").value = "";
                }

                function openRequest(serviceId, sampleId) {
                    requestForm.reset();
                    requestCategory.value = serviceId;
                    populateRequestSamples(serviceId, sampleId || services[serviceId].samples[0][0]);
                    updateConditionalFields(serviceId);
                    requestReview.hidden = true;
                    requestReview.replaceChildren();
                    formFeedback.textContent = "";
                    requestDialog.showModal();
                }

                function renderPortfolio(filter = "all") {
                    const cards = [];
                    Object.keys(services).forEach((serviceId) => {
                        if (filter !== "all" && filter !== serviceId) return;
                        getSamples(serviceId).forEach((sample, index) => {
                            cards.push(createSampleCard(serviceId, sample, index, false));
                        });
                    });
                    portfolioGrid.replaceChildren(...cards);
                }

                function showReview() {
                    if (!requestForm.reportValidity()) return false;
                    const data = new FormData(requestForm);
                    const service = services[data.get("category")];
                    const sample = service.samples.find(([id]) => id === data.get("sample"));
                    const lines = [
                        `${service.label} — ${sample[1]}`,
                        `Quantity: ${data.get("quantity")}`,
                        `Customer: ${data.get("customerName")}`,
                        `Email: ${data.get("email")}`
                    ];
                    if (data.get("width") && data.get("height")) {
                        lines.push(`Requested size: ${data.get("width")} × ${data.get("height")}`);
                    }
                    if (data.get("material")) lines.push(`Material / finish: ${data.get("material")}`);
                    if (data.get("deadline")) lines.push(`Preferred deadline: ${data.get("deadline")}`);
                    if (data.get("eventDetails")) lines.push(`Event details: ${data.get("eventDetails")}`);
                    if (data.get("designPreferences")) lines.push(`Design preferences: ${data.get("designPreferences")}`);
                    if (data.get("instructions")) lines.push(`Additional instructions: ${data.get("instructions")}`);
                    if (data.get("artwork").name) lines.push(`Selected file: ${data.get("artwork").name} (not uploaded)`);
                    requestReview.replaceChildren();
                    const heading = document.createElement("h3");
                    heading.textContent = "Review your request";
                    const list = document.createElement("ul");
                    lines.forEach((line) => {
                        const item = document.createElement("li");
                        item.textContent = line;
                        list.append(item);
                    });
                    requestReview.append(heading, list);
                    requestReview.hidden = false;
                    return true;
                }

                galleryTabs.forEach((tab, index) => {
                    tab.addEventListener("click", () => renderCategory(tab.dataset.galleryService));
                    tab.addEventListener("keydown", (event) => {
                        let nextIndex;
                        if (event.key === "ArrowRight") nextIndex = (index + 1) % galleryTabs.length;
                        else if (event.key === "ArrowLeft") nextIndex = (index - 1 + galleryTabs.length) % galleryTabs.length;
                        else if (event.key === "Home") nextIndex = 0;
                        else if (event.key === "End") nextIndex = galleryTabs.length - 1;
                        else return;
                        event.preventDefault();
                        galleryTabs[nextIndex].focus();
                        renderCategory(galleryTabs[nextIndex].dataset.galleryService);
                    });
                });

                Object.entries(services).forEach(([id, service]) => {
                    const option = document.createElement("option");
                    option.value = id;
                    option.textContent = service.label;
                    requestCategory.append(option);
                });
                requestCategory.addEventListener("change", () => {
                    populateRequestSamples(requestCategory.value, services[requestCategory.value].samples[0][0]);
                    updateConditionalFields(requestCategory.value);
                    requestReview.hidden = true;
                });

                document.querySelectorAll("[data-request-service]").forEach((button) => {
                    button.addEventListener("click", () =>
                        openRequest(button.dataset.requestService, services[button.dataset.requestService].samples[0][0]));
                });
                document.querySelector("#sample-dialog-request").addEventListener("click", () => {
                    sampleDialog.close();
                    openRequest(currentDetail.serviceId, currentDetail.sampleId);
                });
                document.querySelectorAll("[data-close-dialog]").forEach((button) => {
                    button.addEventListener("click", () => button.closest("dialog").close());
                });
                document.querySelector("#review-request").addEventListener("click", () => {
                    if (showReview()) {
                        formFeedback.textContent = "Review only: nothing has been sent or saved.";
                    }
                });
                requestForm.addEventListener("input", () => {
                    requestReview.hidden = true;
                    formFeedback.textContent = "";
                });
                requestForm.addEventListener("submit", (event) => {
                    event.preventDefault();
                    if (showReview()) {
                        formFeedback.textContent = "Demo only: your request was not sent or saved. A backend connection is required.";
                    }
                });

                document.querySelectorAll("[data-portfolio-filter]").forEach((button) => {
                    button.addEventListener("click", () => {
                        document.querySelectorAll("[data-portfolio-filter]").forEach((filterButton) => {
                            const selected = filterButton === button;
                            filterButton.classList.toggle("active", selected);
                            filterButton.setAttribute("aria-pressed", String(selected));
                        });
                        renderPortfolio(button.dataset.portfolioFilter);
                    });
                });

                renderCategory(activeService);
                renderPortfolio();
            })();
