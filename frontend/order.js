/* ==============================
   ORDER PAGE - JAVASCRIPT
   ============================== */

(() => {
    "use strict";

    const SHOP_EMAIL = null;

    const s = (id, label) => ({ id, label });

    // Service ids and product ids match home.js
    const services = {
        invitation: {
            label: "Invitation",
            title: "Invitation Printing",
            description: "Custom invitations for birthdays, weddings, christenings, and special events.",
            image: "/frontend/image/invitation/Bdayinvitation.jpg",
            eventBased: true,
            needsSize: false,
            priceNote: "By quote",
            samples: [
                s("birthday-invitation", "Birthday Invitation"),
                s("wedding-invitation", "Wedding Invitation"),
                s("christening-invitation", "Christening Invitation")
            ]
        },
        souvenir: {
            label: "Souvenir",
            title: "Souvenir Printing",
            description: "Personalized keepsakes and giveaway items for any occasion.",
            image: "/frontend/image/souvenir/whitemug.png",
            eventBased: false,
            needsSize: false,
            priceNote: "By quote",
            samples: [
                s("refrigerator-magnet", "Refrigerator Magnet"),
                s("acrylic-keychain", "Acrylic Keychain"),
                s("personalized-nail-cutter", "Personalized Nail Cutter"),
                s("white-mug", "White Mug"),
                s("glass-mug", "Glass Mug"),
                s("nordic-mug", "Nordic Mug"),
                s("personalized-tote-bag", "Personalized Tote Bag"),
                s("coloring-book", "Coloring Book")
            ]
        },
        sticker: {
            label: "Sticker",
            title: "Sticker Printing",
            description: "Custom stickers for branding, packaging, or personal use.",
            image: "/frontend/image/temporary-sample.svg",
            eventBased: false,
            needsSize: true,
            priceNote: "By quote",
            samples: [
                s("business-logo-stickers", "Business Logo Stickers"),
                s("product-label-stickers", "Product Label Stickers"),
                s("name-stickers", "Name Stickers"),
                s("wall-stickers-decals", "Wall Stickers / Decals")
            ]
        },
        "sintra-board": {
            label: "Sintra Board",
            title: "Sintra Board Printing",
            description: "Durable sintra board prints for signage, menus, and displays.",
            image: "/frontend/image/SintraBoard/menuBoard.png",
            eventBased: false,
            needsSize: true,
            priceNote: "By quote",
            samples: [
                s("birthday-welcome-signs", "Birthday / Welcome Signs"),
                s("wedding-signs", "Wedding Signs"),
                s("menu-board", "Menu Board"),
                s("photo-mounting-boards", "Photo Mounting Boards"),
                s("customized-photo-displays", "Customized Photo Displays"),
                s("photo-collages", "Photo Collages")
            ]
        },
        "party-needs": {
            label: "Party Needs",
            title: "Party Needs Printing",
            description: "Custom printed items for parties and celebrations.",
            image: "/frontend/image/temporary-sample.svg",
            eventBased: true,
            needsSize: false,
            priceNote: "By quote",
            samples: [
                s("party-hats", "Party Hats"),
                s("gable-boxes", "Gable Boxes"),
                s("gift-thank-you-tags", "Gift / Thank You Tags"),
                s("personalized-candles", "Personalized Candles")
            ]
        },
        "large-format": {
            label: "Tarpaulins & Large Format",
            title: "Tarpaulin & Large Format Printing",
            description: "Large-format prints for events, advertising, and displays.",
            image: "/frontend/image/tarpaulin/event.png",
            eventBased: true,
            needsSize: true,
            priceNote: "By quote",
            samples: [
                s("birthday-wedding-graduation-banners", "Birthday, Wedding & Graduation Banners"),
                s("store-banners-promotions", "Store Banners & Promotions"),
                s("product-advertisements", "Product Advertisements"),
                s("stage-backdrops", "Stage Backdrops"),
                s("welcome-banners", "Welcome Banners"),
                s("program-banners", "Program Banners"),
                s("school-announcements-schedules", "School Announcements & Schedules"),
                s("public-notices", "Public Notices"),
                s("entrance-signs", "Entrance Signs"),
                s("directional-banners", "Directional Banners"),
                s("temporary-signs", "Temporary Signs")
            ]
        }
    };

    const STEP_IDS = {
        1: "step-1-service",
        2: "step-2-form",
        3: "step-3-result",
        4: "step-4-images",
        5: "step-5-payment",
        6: "step-6-draft",
        7: "step-7-production",
        8: "step-8-completion"
    };

    const STEP_TITLES = [
        "Select Service",
        "Order Form",
        "Submission",
        "Send Images",
        "Down Payment",
        "Draft Review",
        "Production",
        "Order Status"
    ];

    const STEP_SUBTITLES = [
        "Choose the printing service you need",
        "Fill in your order details",
        "Submit your order request",
        "Email your design files",
        "Await price confirmation and pay 50% down payment",
        "Review and approve your draft layout",
        "Order proceeds to production",
        "Track your order status"
    ];

    const state = {
        currentStep: 1,
        selectedService: null,
        selectedProduct: null,
        orderData: {},
        orderReference: null,
        backendAvailable: false
    };

    const $ = (id) => document.getElementById(id);

    const els = {
        serviceGrid: $("service-grid"),
        stepNum: $("step-num-1"),
        stepTitle: $("step-title-text"),
        stepSubtitle: $("step-subtitle-text"),
        step1Actions: $("step-1-actions"),
        nextToForm: $("next-to-form"),
        orderForm: $("order-form"),
        orderService: $("order-service"),
        orderProduct: $("order-product"),
        backToService: $("back-to-service"),
        submissionLoading: $("submission-loading"),
        submissionSuccess: $("submission-success"),
        submissionError: $("submission-error"),
        refCode: $("ref-code"),
        orderReferenceBox: $("order-reference-box"),
        backendNotice: $("backend-notice"),
        formFeedback: $("form-feedback"),
        shopEmail: $("shop-email"),
        shopEmailStep4: $("shop-email-step4"),
        emailSetupPlaceholder: $("email-setup-placeholder"),
        emailSetupStep4: $("email-setup-step4"),
        sendEmailBtn: $("send-email-btn"),
        sendEmailStep4: $("send-email-step4"),
        fieldEventInfo: $("field-event-info"),
        fieldBusinessInfo: $("field-business-info"),
        fieldDimensions: $("field-dimensions"),
        fieldMaterial: $("field-material"),
        paymentAwaiting: $("payment-awaiting"),
        paymentCalculated: $("payment-calculated"),
        totalPrice: $("total-price"),
        downPayment: $("down-payment"),
        remainingBalance: $("remaining-balance"),
        retryOrder: $("retry-order"),
        viewNextSteps: $("view-next-steps"),
        btnApproveDraft: $("btn-approve-draft"),
        btnRequestRevision: $("btn-request-revision"),
        draftActions: $("draft-actions"),
        draftStatus: $("draft-status")
    };

    /* ---------- Init ---------- */

    function init() {
        if (!els.serviceGrid) return;

        renderServiceGrid();
        populateServiceSelect();
        setupEventListeners();
        updateShopEmailDisplay();

        const params = new URLSearchParams(window.location.search);
        if (params.get("view") === "order" && params.get("ref")) {
            showPostSubmissionSteps();
        } else {
            handleQueryParam();
        }
    }

    /* ---------- Step 1: services ---------- */

    function renderServiceGrid() {
        els.serviceGrid.innerHTML = "";

        Object.entries(services).forEach(([id, service]) => {
            const card = document.createElement("article");
            card.className = "service-card";
            card.dataset.serviceId = id;

            card.innerHTML = `
                <img class="service-image" src="${service.image}" alt="${service.title} sample">
                <span class="service-tag">${service.label}</span>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <div class="service-price quote">
                    <span>Pricing: </span>
                    <span class="currency">${service.priceNote}</span>
                </div>
                <button class="select-service-btn" type="button">Select this service</button>
            `;

            card.querySelector(".select-service-btn").addEventListener("click", () => {
                selectService(id, service.samples[0].id);
            });

            els.serviceGrid.appendChild(card);
        });
    }

    function populateServiceSelect() {
        els.orderService.innerHTML = '<option value="">Select a service</option>';
        Object.entries(services).forEach(([id, service]) => {
            const option = document.createElement("option");
            option.value = id;
            option.textContent = service.title;
            els.orderService.appendChild(option);
        });
    }

    function populateProducts(serviceId) {
        const service = services[serviceId];
        els.orderProduct.innerHTML = '<option value="">Select a product</option>';
        service.samples.forEach((sample) => {
            const option = document.createElement("option");
            option.value = sample.id;
            option.textContent = sample.label;
            els.orderProduct.appendChild(option);
        });
    }

    function selectService(serviceId, productId) {
        const service = services[serviceId];
        if (!service) return;

        state.selectedService = serviceId;
        state.selectedProduct = productId || service.samples[0].id;

        document.querySelectorAll(".service-card").forEach((card) => {
            card.classList.toggle("selected", card.dataset.serviceId === serviceId);
        });

        els.step1Actions.style.display = "flex";

        els.orderService.value = serviceId;
        populateProducts(serviceId);
        els.orderProduct.value = state.selectedProduct;

        els.fieldEventInfo.classList.toggle("visible", service.eventBased);
        els.fieldBusinessInfo.classList.toggle("visible", !service.eventBased);
        els.fieldDimensions.classList.toggle("visible", service.needsSize);
        els.fieldMaterial.classList.toggle("visible", service.needsSize);
    }

    /* Reads ?service=...&design=...; accept product for older links. */
    function handleQueryParam() {
        const params = new URLSearchParams(window.location.search);
        const serviceParam = params.get("service");
        if (!serviceParam || !services[serviceParam]) return;

        const requested = (params.get("design") || params.get("product"))?.trim().toLocaleLowerCase();
        const match = services[serviceParam].samples.find((sample) =>
            sample.id === requested || sample.label.toLocaleLowerCase() === requested
        );

        selectService(serviceParam, match?.id || services[serviceParam].samples[0].id);

        // Visitor already chose a service on the home page, so go straight to the form
        showStep(2);
        els.backToService.style.display = "inline-flex";
    }

    /* ---------- Step navigation ---------- */

    function showStep(stepNum) {
        document.querySelectorAll(".order-step").forEach((step) => {
            step.classList.remove("active");
        });

        const target = $(STEP_IDS[stepNum]);
        if (target) target.classList.add("active");

        state.currentStep = stepNum;
        updateStepIndicator();
    }

    function updateStepIndicator() {
        if (els.stepNum) {
            els.stepNum.className = "step-number active";
            els.stepNum.textContent = String(state.currentStep);
        }
        if (els.stepTitle) els.stepTitle.textContent = STEP_TITLES[state.currentStep - 1] || "";
        if (els.stepSubtitle) els.stepSubtitle.textContent = STEP_SUBTITLES[state.currentStep - 1] || "";
    }

    function showPostSubmissionSteps() {
        showStep(4);
    }

    /* ---------- Shop email ---------- */

    function updateShopEmailDisplay() {
        const configured = Boolean(SHOP_EMAIL);

        if (els.shopEmail) els.shopEmail.textContent = configured ? SHOP_EMAIL : "Not configured";
        if (els.shopEmailStep4) els.shopEmailStep4.textContent = configured ? SHOP_EMAIL : "Not configured";
        if (els.emailSetupPlaceholder) els.emailSetupPlaceholder.style.display = configured ? "none" : "block";
        if (els.emailSetupStep4) els.emailSetupStep4.style.display = configured ? "none" : "block";
        if (els.sendEmailBtn) els.sendEmailBtn.disabled = !configured;
        if (els.sendEmailStep4) els.sendEmailStep4.disabled = !configured;
    }

    function openDesignEmail() {
        if (!SHOP_EMAIL) return;

        const subject = encodeURIComponent("Design Reference - Print Order");
        const serviceLabel = services[state.selectedService]?.title || "";
        const productLabel = services[state.selectedService]?.samples
            .find((p) => p.id === state.selectedProduct)?.label || "";

        const body = encodeURIComponent(
            "Please find attached my design reference for my print order.\n\n" +
            "Order Reference: " + (state.orderReference || "Pending") + "\n" +
            "Full Name: " + (state.orderData.customerName || "") + "\n" +
            "Service: " + serviceLabel + "\n" +
            "Product: " + productLabel + "\n"
        );
        window.location.href = `mailto:${SHOP_EMAIL}?subject=${subject}&body=${body}`;
    }

    /* ---------- Events ---------- */

    function setupEventListeners() {
        els.orderService.addEventListener("change", (e) => {
            const serviceId = e.target.value;
            if (services[serviceId]) selectService(serviceId);
        });

        els.orderProduct.addEventListener("change", (e) => {
            state.selectedProduct = e.target.value;
        });

        els.nextToForm.addEventListener("click", () => {
            if (!state.selectedService) return;
            showStep(2);
            els.backToService.style.display = "inline-flex";
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        els.backToService.addEventListener("click", () => {
            showStep(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        els.orderForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await handleFormSubmit();
        });

        if (els.sendEmailBtn) els.sendEmailBtn.addEventListener("click", openDesignEmail);
        if (els.sendEmailStep4) els.sendEmailStep4.addEventListener("click", openDesignEmail);

        if (els.retryOrder) {
            els.retryOrder.addEventListener("click", () => handleFormSubmit());
        }

        if (els.viewNextSteps) {
            els.viewNextSteps.addEventListener("click", () => {
                showPostSubmissionSteps();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        if (els.btnApproveDraft) {
            els.btnApproveDraft.addEventListener("click", () => handleDraftAction("approve"));
        }
        if (els.btnRequestRevision) {
            els.btnRequestRevision.addEventListener("click", () => handleDraftAction("revision"));
        }
    }

    /* ---------- Validation ---------- */

    function showError(field, message) {
        const errorEl = $("err-" + field.name);
        if (errorEl) {
            if (message) errorEl.textContent = message;
            errorEl.style.display = "block";
        }
        field.classList.add("input-error");
    }

    function validateForm() {
        const form = els.orderForm;
        let isValid = true;

        form.querySelectorAll(".error-message").forEach((el) => (el.style.display = "none"));
        form.querySelectorAll(".input-error").forEach((el) => el.classList.remove("input-error"));

        form.querySelectorAll("[required]").forEach((field) => {
            // Skip required fields inside hidden conditional sections
            const conditional = field.closest(".conditional-field");
            if (conditional && !conditional.classList.contains("visible")) return;

            if (!field.value.trim()) {
                showError(field);
                isValid = false;
            }
        });

        const emailField = form.querySelector('input[name="email"]');
        if (emailField && emailField.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                showError(emailField, "Please enter a valid email address");
                isValid = false;
            }
        }

        const qtyField = form.querySelector('input[name="quantity"]');
        if (qtyField && (Number(qtyField.value) < 1 || !Number.isInteger(Number(qtyField.value)))) {
            showError(qtyField);
            isValid = false;
        }

        if (!state.selectedService) {
            const serviceField = form.querySelector('select[name="service"]');
            if (serviceField) showError(serviceField);
            isValid = false;
        }

        return isValid;
    }

    function collectFormData() {
        const data = {};
        new FormData(els.orderForm).forEach((value, key) => {
            data[key] = value;
        });

        const service = services[state.selectedService];
        data.service = state.selectedService;
        data.product = state.selectedProduct;
        data.serviceLabel = service?.title || "";
        data.productLabel = service?.samples.find((p) => p.id === state.selectedProduct)?.label || "";

        return data;
    }

    /* ---------- Submit ---------- */

    async function handleFormSubmit() {
        if (!validateForm()) {
            els.formFeedback.textContent = "Please fill in all required fields.";
            els.formFeedback.style.color = "var(--order-error)";
            return;
        }

        els.formFeedback.textContent = "";
        els.submissionLoading.style.display = "block";
        els.submissionSuccess.style.display = "none";
        els.submissionError.style.display = "none";
        showStep(3);
        window.scrollTo({ top: 0, behavior: "smooth" });

        state.orderData = collectFormData();

        try {
            const result = await submitOrderToBackend(state.orderData);
            if (!result.success) throw new Error(result.message || "Submission failed");

            state.orderReference = result.orderReference || generateOrderReference();
            state.backendAvailable = true;

            els.submissionLoading.style.display = "none";
            els.submissionSuccess.style.display = "block";
            els.backendNotice.style.display = "none";
            els.orderReferenceBox.style.display = "block";
            els.refCode.textContent = state.orderReference;

            if (result.totalPrice !== undefined) updatePaymentDisplay(result.totalPrice);
        } catch (err) {
            console.error("Order submission error:", err);

            // Demo mode: no backend yet
            state.orderReference = generateOrderReference();

            els.submissionLoading.style.display = "none";
            els.submissionSuccess.style.display = "block";
            els.orderReferenceBox.style.display = "block";
            els.refCode.textContent = state.orderReference;
            els.backendNotice.style.display = "block";
        }

        els.viewNextSteps.style.display = "inline-block";
    }

    async function submitOrderToBackend(orderData) {
        console.log("Order data (not sent to backend):", orderData);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return { success: false, message: "Backend not available - frontend demo mode" };
    }

    /* ---------- Payment ---------- */

    function updatePaymentDisplay(totalPrice) {
        const total = parseFloat(totalPrice);
        if (isNaN(total)) return;

        const format = (val) =>
            new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(val);

        els.totalPrice.textContent = format(total);
        els.downPayment.textContent = format(total * 0.5);
        els.remainingBalance.textContent = format(total * 0.5);

        els.paymentAwaiting.style.display = "none";
        els.paymentCalculated.style.display = "block";
    }

    /* ---------- Draft approval ---------- */

    async function handleDraftAction(action) {
        if (!state.orderReference) {
            alert("No order reference available. Please submit an order first.");
            return;
        }

        const isApproved = action === "approve";

        try {
            const result = await submitDraftActionToBackend(state.orderReference, action);
            if (!result.success) throw new Error(result.message || "Action failed");

            if (isApproved) {
                els.btnApproveDraft.disabled = true;
                els.btnApproveDraft.textContent = "Draft Approved";
                els.draftActions.style.display = "none";
                els.draftStatus.innerHTML =
                    '<p style="color: var(--order-success); font-weight: 600;">Draft approved! Your order is now approved for printing.</p>';
            } else {
                els.draftStatus.innerHTML =
                    '<p style="color: var(--order-error); font-weight: 600;">Revision requested. A revised draft will be sent for your review.</p>';
            }
        } catch (err) {
            els.draftStatus.innerHTML = isApproved
                ? '<p style="color: #FFCC00;">Demo mode: draft approval not recorded. Backend integration required.</p>'
                : '<p style="color: #FFCC00;">Demo mode: revision request not sent. Backend integration required.</p>';
        }
    }

    async function submitDraftActionToBackend(orderRef, action) {
        console.log(`Draft action ${action} for order ${orderRef}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { success: false, message: "Backend not available - frontend demo mode" };
    }

    /* ---------- Helpers ---------- */

    function generateOrderReference() {
        const date = new Date();
        const dateStr =
            date.getFullYear().toString().slice(-2) +
            String(date.getMonth() + 1).padStart(2, "0") +
            String(date.getDate()).padStart(2, "0");
        const random = Math.floor(Math.random() * 90000) + 10000;
        return `IMP-${dateStr}-${random}`;
    }

    init();
})();