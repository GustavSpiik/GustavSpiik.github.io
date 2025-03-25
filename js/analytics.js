// Initialize dataLayer if not already initialized
window.dataLayer = window.dataLayer || [];

// Helper function to push events to dataLayer
function pushEvent(eventName, eventData = {}) {
    dataLayer.push({
        'event': eventName,
        ...eventData,
        'timestamp': new Date().toISOString()
    });
}

// Track navigation clicks
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        pushEvent('navigation_click', {
            'link_id': e.target.id,
            'link_text': e.target.textContent,
            'link_url': e.target.href
        });
    });
});

// Track CTA button clicks
document.getElementById('cta-button')?.addEventListener('click', () => {
    pushEvent('cta_click', {
        'button_text': 'Klicka här!'
    });
});

// Track add to cart actions
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const product = e.target.closest('.product');
        pushEvent('add_to_cart', {
            'product_id': product.dataset.productId,
            'product_name': product.dataset.productName,
            'product_price': parseFloat(product.dataset.productPrice)
        });
    });
});

// Track page view on load
document.addEventListener('DOMContentLoaded', () => {
    pushEvent('page_view', {
        'page_title': document.title,
        'page_url': window.location.href,
        'page_path': window.location.pathname
    });
});

// Track user engagement
let lastInteractionTime = new Date().getTime();
const engagementEvents = ['click', 'scroll', 'mousemove', 'keypress'];

engagementEvents.forEach(eventType => {
    document.addEventListener(eventType, () => {
        const currentTime = new Date().getTime();
        if (currentTime - lastInteractionTime >= 5000) { // Push event every 5 seconds
            pushEvent('user_engagement', {
                'interaction_type': eventType
            });
        }
        lastInteractionTime = currentTime;
    });
});

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
    );
    
    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
            pushEvent('scroll_depth', {
                'scroll_percentage': maxScroll
            });
        }
    }
});

// Track time on page when user leaves
let pageLoadTime = new Date().getTime();
window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((new Date().getTime() - pageLoadTime) / 1000);
    pushEvent('page_exit', {
        'time_on_page_seconds': timeOnPage
    });
}); 