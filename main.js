document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. NAVIGATION SCROLL EFFECTS
       ========================================================================== */
    const header = document.getElementById('siteHeader');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       2. MOBILE MENU DRAWER
       ========================================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            header.classList.toggle('mobile-open');
        });
    }

    // Close mobile menu when links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('mobile-open');
        });
    });

    /* ==========================================================================
       3. ROOM CATEGORIES TAB SYSTEM
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.room-tab-btn');
    const roomCards = document.querySelectorAll('.room-detail-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetRoomId = btn.getAttribute('data-room-id');

            // Deactivate all buttons & cards
            tabButtons.forEach(b => b.classList.remove('active'));
            roomCards.forEach(card => card.classList.remove('active'));

            // Activate current selection
            btn.classList.add('active');
            const targetCard = document.getElementById(`room-${targetRoomId}`);
            if (targetCard) {
                targetCard.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       4. INTERACTIVE BOOKING MODAL & PRICING
       ========================================================================== */
    const bookingModal = document.getElementById('bookingModal');
    const closeModalBtn = document.getElementById('closeModal');
    const quickBookingForm = document.getElementById('quickBookingForm');
    const modalBookingForm = document.getElementById('modalBookingForm');
    const bookingFormWrapper = document.getElementById('bookingFormWrapper');
    const bookingSuccessScreen = document.getElementById('bookingSuccessScreen');
    const btnBookAnother = document.getElementById('btnBookAnother');

    // Room Rates Database
    const roomRates = {
        'deluxe': 1499,
        'super-deluxe': 2350,
        'suite': 2650,
        'luxury': 4000
    };

    const roomNames = {
        'deluxe': 'Deluxe Room',
        'super-deluxe': 'Super Deluxe Room',
        'suite': 'Executive Suite',
        'luxury': 'Luxury Room (Four Occupancy)'
    };

    // Initialize dates in search forms to tomorrow and day after
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const formatDateInput = (date) => {
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return `${yyyy}-${mm}-${dd}`;
    };

    const inputQuickCheckin = document.getElementById('quick-checkin');
    const inputQuickCheckout = document.getElementById('quick-checkout');
    const inputModalCheckin = document.getElementById('book-checkin');
    const inputModalCheckout = document.getElementById('book-checkout');

    if (inputQuickCheckin && inputQuickCheckout) {
        inputQuickCheckin.value = formatDateInput(tomorrow);
        inputQuickCheckin.min = formatDateInput(today);
        inputQuickCheckout.value = formatDateInput(dayAfter);
        inputQuickCheckout.min = formatDateInput(tomorrow);

        // Update checkout minimum date when checkin changes
        inputQuickCheckin.addEventListener('change', () => {
            const checkinVal = new Date(inputQuickCheckin.value);
            const minCheckout = new Date(checkinVal);
            minCheckout.setDate(minCheckout.getDate() + 1);
            inputQuickCheckout.min = formatDateInput(minCheckout);
            if (new Date(inputQuickCheckout.value) <= checkinVal) {
                inputQuickCheckout.value = formatDateInput(minCheckout);
            }
        });
    }

    if (inputModalCheckin && inputModalCheckout) {
        inputModalCheckin.value = formatDateInput(tomorrow);
        inputModalCheckin.min = formatDateInput(today);
        inputModalCheckout.value = formatDateInput(dayAfter);
        inputModalCheckout.min = formatDateInput(tomorrow);

        inputModalCheckin.addEventListener('change', () => {
            const checkinVal = new Date(inputModalCheckin.value);
            const minCheckout = new Date(checkinVal);
            minCheckout.setDate(minCheckout.getDate() + 1);
            inputModalCheckout.min = formatDateInput(minCheckout);
            if (new Date(inputModalCheckout.value) <= checkinVal) {
                inputModalCheckout.value = formatDateInput(minCheckout);
            }
        });
    }

    // Modal Control Functions
    const openBookingModal = (preselectedRoom = 'deluxe') => {
        bookingModal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Stop background scroll

        // Pre-populate values
        const roomSelect = document.getElementById('book-room');
        if (roomSelect) {
            roomSelect.value = preselectedRoom;
        }

        // Sync quick form dates if they were set
        if (inputQuickCheckin && inputModalCheckin) {
            inputModalCheckin.value = inputQuickCheckin.value;
            inputModalCheckout.value = inputQuickCheckout.value;
            inputModalCheckout.min = inputQuickCheckout.min;
        }
    };

    const closeBookingModal = () => {
        bookingModal.classList.remove('open');
        document.body.style.overflow = ''; // Restore scroll
        // Reset screens
        setTimeout(() => {
            bookingFormWrapper.style.display = 'block';
            bookingSuccessScreen.style.display = 'none';
        }, 400);
    };

    // Attach triggers to book buttons
    const navBookButton = document.querySelector('.btn-book-now');
    if (navBookButton) {
        navBookButton.addEventListener('click', (e) => {
            e.preventDefault();
            openBookingModal('deluxe');
        });
    }

    const bookTriggers = document.querySelectorAll('.btn-book-trigger');
    bookTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const roomId = trigger.getAttribute('data-room');
            openBookingModal(roomId);
        });
    });

    const banquetInquiryBtn = document.querySelector('.btn-gold');
    if (banquetInquiryBtn) {
        banquetInquiryBtn.addEventListener('click', (e) => {
            if (e.target.innerText.includes('Banquet')) {
                e.preventDefault();
                openBookingModal('suite'); // Open and preselect suite as a luxury example, can add notes
                const notes = document.getElementById('book-notes');
                if (notes) {
                    notes.value = "Banquet Hall inquiry for an event of approximately 100 guests.";
                }
            }
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeBookingModal);
    }

    // Click outside modal container to close
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeBookingModal();
        }
    });

    // Handle Quick Search submission
    if (quickBookingForm) {
        quickBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedRoom = document.getElementById('quick-room').value;
            const selectedGuests = document.getElementById('quick-guests').value;
            
            openBookingModal(selectedRoom);
            
            // Sync guests select
            const modalGuests = document.getElementById('book-guests');
            if (modalGuests) {
                // If it's a number, match it. If it is 5+, cap it or handle.
                if (parseInt(selectedGuests)) {
                    modalGuests.value = selectedGuests;
                } else {
                    modalGuests.value = "5+";
                }
            }
        });
    }

    // Handle Modal Booking Form Submit
    if (modalBookingForm) {
        modalBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract values
            const name = document.getElementById('book-name').value;
            const phone = document.getElementById('book-phone').value;
            const email = document.getElementById('book-email').value || 'N/A';
            const checkinStr = document.getElementById('book-checkin').value;
            const checkoutStr = document.getElementById('book-checkout').value;
            const roomCode = document.getElementById('book-room').value;
            const guests = document.getElementById('book-guests').value;
            const extraBed = document.getElementById('book-extra-bed').value;

            // Date calculations
            const checkinDate = new Date(checkinStr);
            const checkoutDate = new Date(checkoutStr);
            const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
            const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

            // Pricing calculation
            const ratePerNight = roomRates[roomCode];
            let subtotal = ratePerNight * nights;
            if (extraBed === 'yes') {
                subtotal += (500 * nights);
            }

            // Generate unique Inquiry ID
            const randomNum = Math.floor(10000 + Math.random() * 90000);
            const inquiryId = `EX-2026-${randomNum}`;

            // Populate Inquiry Slip fields
            document.getElementById('slipId').innerText = inquiryId;
            document.getElementById('slipName').innerText = name;
            document.getElementById('slipPhone').innerText = phone;
            
            const formatDateLabel = (date) => {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${months[date.getMonth()]} ${date.getDate()}`;
            };
            document.getElementById('slipDates').innerText = `${formatDateLabel(checkinDate)} - ${formatDateLabel(checkoutDate)} (${nights} night${nights > 1 ? 's' : ''})`;
            document.getElementById('slipRoom').innerText = roomNames[roomCode];
            document.getElementById('slipGuests').innerText = `${guests} Adult${parseInt(guests) > 1 ? 's' : ''}`;
            document.getElementById('slipExtra').innerText = extraBed === 'yes' ? 'Yes (₹500/night)' : 'No';
            document.getElementById('slipTotal').innerText = `₹${subtotal.toLocaleString('en-IN')}`;

            // Show Success screen
            bookingFormWrapper.style.display = 'none';
            bookingSuccessScreen.style.display = 'block';

            // Reset the form
            modalBookingForm.reset();
        });
    }

    if (btnBookAnother) {
        btnBookAnother.addEventListener('click', () => {
            bookingSuccessScreen.style.display = 'none';
            bookingFormWrapper.style.display = 'block';
        });
    }

    /* ==========================================================================
       4b. TARIFF DETAILS TAB SYSTEM
       ========================================================================== */
    const detailTabButtons = document.querySelectorAll('.details-tab-btn');
    const detailPanels = document.querySelectorAll('.details-panel');

    detailTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTabId = btn.getAttribute('data-tab-id');

            // Deactivate all buttons & panels
            detailTabButtons.forEach(b => b.classList.remove('active'));
            detailPanels.forEach(panel => panel.classList.remove('active'));

            // Activate current selection
            btn.classList.add('active');
            const targetPanel = document.getElementById(`details-${targetTabId}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       5. SCROLL INTERSECTION ANIMATIONS
       ========================================================================== */
    const animatedElements = document.querySelectorAll('[data-animate]');

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before it hits the viewport edge
    });

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

});
