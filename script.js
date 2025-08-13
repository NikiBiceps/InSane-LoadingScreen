const BACKGROUND_CONFIG = {
    // Опции: 'images', 'mp4', 'youtube'
    type: 'youtube',
    
    // images
    imagePaths: [
        'images/discord_logo.png',
        'images/kur123.png'

    ],
    
    // mp4
    videoPath: 'videos/DZHENA.mp4',

    // youtube
    youtubeId: 'WX6tPCy6YU0'
};

// НЕ Е ПРЕПОРЪЧИТЕЛНО ДА ПИПАТЕ ОТ ТУК НАДОЛУ АКО СТЕ РЕТАРДИ!!!

document.addEventListener('DOMContentLoaded', function() {
    
    var count = 0;
    var thisCount = 0;

    const imageBackdrop = document.getElementById('image-backdrop');
    const videoBackdrop = document.getElementById('video-backdrop');
    const youtubeBackdrop = document.getElementById('youtube-backdrop');

    function setupBackground() {
        switch (BACKGROUND_CONFIG.type) {
            case 'images':
                if (imageBackdrop) {
                    imageBackdrop.style.display = 'block';
                    let currentBackground = 0;
                    function updateBackground() {
                        imageBackdrop.style.backgroundImage = `url('${BACKGROUND_CONFIG.imagePaths[currentBackground]}')`;
                        currentBackground = (currentBackground + 1) % BACKGROUND_CONFIG.imagePaths.length;
                    }
                    updateBackground();
                    setInterval(updateBackground, 10000);
                }
                break;

            case 'mp4':
                if (videoBackdrop) {
                    videoBackdrop.style.display = 'block';
                    videoBackdrop.src = BACKGROUND_CONFIG.videoPath;
                    videoBackdrop.muted = false;
                }
                break;

            case 'youtube':
                if (youtubeBackdrop) {
                    youtubeBackdrop.style.display = 'block';
                    youtubeBackdrop.src = `https://www.youtube.com/embed/${BACKGROUND_CONFIG.youtubeId}?autoplay=1&mute=0&loop=1&playlist=${BACKGROUND_CONFIG.youtubeId}&controls=0&rel=0&showinfo=0&iv_load_policy=3`;
                }
                break;
                
            default:
                console.error("invalid source");
                break;
        }
    }

    setupBackground();

    const rulesBtn = document.getElementById('show-rules-btn');
    const rulesModal = document.getElementById('rules-modal');
    const closeRulesBtn = document.getElementById('close-rules-btn');

    if (rulesBtn) {
        rulesBtn.onclick = function() {
            rulesModal.style.display = 'block';
        };
    }
    
    if (closeRulesBtn) {
        closeRulesBtn.onclick = function() {
            rulesModal.style.display = 'none';
        };
    }
    
    const staffBtn = document.getElementById('show-staff-btn');
    const staffModal = document.getElementById('staff-modal');
    const closeStaffBtn = document.getElementById('close-staff-btn');

    if (staffBtn) {
        staffBtn.onclick = function() {
            staffModal.style.display = 'block';
        };
    }
    
    if (closeStaffBtn) {
        closeStaffBtn.onclick = function() {
            staffModal.style.display = 'none';
        };
    }

    window.onclick = function(event) {
        if (event.target == rulesModal) {
            rulesModal.style.display = 'none';
        }
        if (event.target == staffModal) {
            staffModal.style.display = 'none';
        }
    };
    
    const cursor = document.getElementById('custom-cursor');

    if (cursor) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        
        const speed = 0.1;

        function animate() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * speed;
            cursorY += dy * speed;
            
            cursor.style.transform = `translate3d(${cursorX - 15}px, ${cursorY - 15}px, 0)`;
            
            requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const interactiveElements = document.querySelectorAll('button, a, .close-button');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseover', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }
    
    const handlers = {
        startInitFunctionOrder(data) {
            count = data.count;
            document.getElementById('loading-stage').textContent = loadingMessages[data.type];
            document.getElementById('loading-emojis').innerHTML += emoji[data.type][data.order - 1] || '';
            document.querySelector('.thingy').style.width = '0%';
        },

        initFunctionInvoking(data) {
            document.querySelector('.thingy').style.width = ((data.idx / count) * 100) + '%';
        },

        startDataFileEntries(data) {
            count = data.count;
            document.getElementById('loading-stage').textContent = 'Downloading Map Assets';
            document.getElementById('loading-emojis').innerHTML += emoji.START_DATA_FILE_ENTRIES[0];
            thisCount = 0;
        },

        performMapLoadFunction(data) {
            ++thisCount;
            document.querySelector('.thingy').style.width = ((thisCount / count) * 100) + '%';
            document.getElementById('loading-stage').textContent = `Loading Map Data (${thisCount} of ${count})`;
        },
    };

    window.addEventListener('message', function(e) {
        (handlers[e.data.eventName] || function() {})(e.data);
    });
});
