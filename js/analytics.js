// Initialize dataLayer if not already initialized
window.dataLayer = window.dataLayer || [];

// Helper function to push events to dataLayer
function pushToDataLayer(event, data) {
    window.dataLayer.push({
        event: event,
        ...data,
        timestamp: new Date().toISOString()
    });
    
    // Logga till konsolen i demonstrationssyfte
    console.log('dataLayer Push:', {
        event: event,
        ...data,
        timestamp: new Date().toISOString()
    });
}

// Sidvisningsspårning
document.addEventListener('DOMContentLoaded', function() {
    pushToDataLayer('page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
    });
    
    // Spåra navigationsklick
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Förhindra faktisk navigering för demo
            
            pushToDataLayer('navigation_click', {
                link_id: this.id,
                link_text: this.textContent,
                link_url: this.href
            });
        });
    });
    
    // Spåra CTA-knappklick
    document.getElementById('cta-button').addEventListener('click', function() {
        pushToDataLayer('cta_click', {
            button_id: 'cta-button',
            button_text: this.textContent
        });
    });
    
    // Spåra produktinteraktioner
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product');
            
            pushToDataLayer('add_to_cart', {
                product_id: product.dataset.productId,
                product_name: product.dataset.productName,
                product_price: parseFloat(product.dataset.productPrice),
                currency: 'SEK'
            });
        });
    });

    // Spåra formulärinskickningar
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Förhindra faktisk inskickning för demo
            
            const formData = new FormData(this);
            const formValues = {};
            formData.forEach((value, key) => {
                formValues[key] = value;
            });
            
            pushToDataLayer('form_submission', {
                form_id: this.id || 'unnamed_form',
                form_name: this.name || 'unnamed_form',
                form_values: formValues
            });
        });
    });
});

// Exempel på hur man kommer åt dataLayer-data
window.showDataLayerHistory = function() {
    console.table(window.dataLayer);
};

// Track user engagement
let lastInteractionTime = new Date().getTime();
const engagementEvents = ['click', 'scroll', 'mousemove', 'keypress'];

engagementEvents.forEach(eventType => {
    document.addEventListener(eventType, () => {
        const currentTime = new Date().getTime();
        if (currentTime - lastInteractionTime >= 5000) { // Push event every 5 seconds
            pushToDataLayer('user_engagement', {
                'interaction_type': eventType
            });
        }
        lastInteractionTime = currentTime;
    });
});

// Enhanced scroll depth tracking
let scrollThresholds = [25, 50, 75, 100];
let reachedThresholds = new Set();

window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
    );
    
    scrollThresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !reachedThresholds.has(threshold)) {
            reachedThresholds.add(threshold);
            pushToDataLayer('scroll_depth', {
                'scroll_percentage': threshold,
                'current_position': window.scrollY,
                'total_height': document.documentElement.scrollHeight,
                'viewport_height': window.innerHeight
            });
        }
    });
});

// Track time on page when user leaves
let pageLoadTime = new Date().getTime();
window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((new Date().getTime() - pageLoadTime) / 1000);
    pushToDataLayer('page_exit', {
        'time_on_page_seconds': timeOnPage,
        'max_scroll_depth': Math.max(...Array.from(reachedThresholds))
    });
}); 