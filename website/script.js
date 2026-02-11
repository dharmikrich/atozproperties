// Storage keys
const STORAGE_KEY = 'properties_v1';
const BOOKINGS_KEY = 'bookings_v1';

// Load properties from localStorage, seed sample if empty
let properties = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const sampleProperties = [
    { id: 1, title: "Luxury 3BHK Flat", city: "Rajkot", type: "apartment", location: "Rajkot Central", furnitureType: "Furnished", img: "https://via.placeholder.com/800x600" },
    { id: 2, title: "Commercial Office Space", city: "Ahmedabad", type: "office", location: "Navrangpura", furnitureType: "Unfurnished", img: "https://via.placeholder.com/800x600" }
];
if (!properties || properties.length === 0) {
    properties = sampleProperties.slice();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
}

const grid = document.getElementById('property-grid');

function saveProperties() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
}

function renderProperties() {
    if (!grid) return;
    grid.innerHTML = '';
    properties.forEach(p => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md overflow-hidden card';

        const img = document.createElement('img');
        img.src = p.img || '';
        img.className = 'w-full h-48 object-cover';
        card.appendChild(img);

        const body = document.createElement('div');
        body.className = 'p-4';

        const citySpan = document.createElement('span');
        citySpan.className = 'text-blue-600 font-bold text-sm';
        citySpan.textContent = p.city || '';
        body.appendChild(citySpan);

        const h3 = document.createElement('h3');
        h3.className = 'text-xl font-bold';
        h3.textContent = p.title || '';
        body.appendChild(h3);

        const typeP = document.createElement('p');
        typeP.className = 'text-gray-600 mt-1';
        typeP.textContent = `Type: ${p.type || ''}`;
        body.appendChild(typeP);

        const locP = document.createElement('p');
        locP.className = 'text-gray-600 mt-1';
        locP.textContent = `Location: ${p.location || ''}`;
        body.appendChild(locP);

        const furnP = document.createElement('p');
        furnP.className = 'text-gray-600 mt-2';
        furnP.textContent = `Furniture: ${p.furnitureType || ''}`;
        body.appendChild(furnP);

        const link = document.createElement('a');
        // details.html is located at site root; use root-relative for clarity when on index
        link.href = `details.html?id=${p.id}`;
        link.className = 'mt-4 inline-block w-full text-center border border-blue-900 text-blue-900 py-2 rounded hover:bg-blue-900 hover:text-white transition';
        link.textContent = 'View Details';
        body.appendChild(link);

        card.appendChild(body);
        grid.appendChild(card);
    });
}

renderProperties();

// Handle property post form
const propertyForm = document.getElementById('property-form');
if (propertyForm) {
    propertyForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const type = document.getElementById('property-type').value;
        const title = document.getElementById('property-title').value;
        const location = document.getElementById('property-location').value;
        const furniture = document.getElementById('furniture-type').value;
        const fileInput = document.getElementById('property-image');
        const id = Date.now();
        const newProperty = { id, type, title, location, furnitureType: furniture, img: 'https://via.placeholder.com/800x600' };

        function finishSave() {
            properties.unshift(newProperty);
            saveProperties();
            // Open details page for newly created property
            // If posting from admin folder, navigate up one level to root details page
            const isInAdmin = location.pathname.includes('/admin/');
            if (isInAdmin) {
                window.location.href = `../details.html?id=${id}`;
            } else {
                window.location.href = `details.html?id=${id}`;
            }
        }

        if (fileInput && fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (ev) {
                newProperty.img = ev.target.result;
                finishSave();
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            finishSave();
        }
    });
}

// Retain existing site-wide booking form behavior (non-property-specific)
const siteBookingForm = document.getElementById('booking-form');
if (siteBookingForm) {
    siteBookingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const time = document.getElementById('visit-time').value;
        alert(`Booking Request Sent! \nTime: ${time}\n\nNote: For Google Calendar integration, you must connect the Google Calendar API via your backend.`);
    });
}

// Mobile nav toggle (show stacked menu at top on small screens)
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('mobile');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close menu when a link is clicked (mobile)
    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && window.innerWidth < 768) {
            navLinks.classList.remove('mobile');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}