document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const manualContents = document.querySelectorAll('.manual-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            manualContents.forEach(content => {
                content.classList.remove('active');
            });

            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');

                setTimeout(() => {
                    generateTOC(targetContent);
                }, 500);

                window.scrollTo(0, 0);
            }
        });
    });

    const firstManual = document.querySelector('.manual-content.active');
    if (firstManual) {
        generateTOC(firstManual);
    }

    function generateTOC(manualContent) {
        const tocContainer = document.getElementById('toc');
        tocContainer.innerHTML = '';

        const headings = manualContent.querySelectorAll('h3');

        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = 'section-' + index;
            }

            const link = document.createElement('a');
            link.href = '#' + heading.id;
            link.textContent = heading.textContent;

            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = heading.id;

                setTimeout(function() {
                    const target = document.getElementById(targetId);
                    if (target) {
                        const rect = target.getBoundingClientRect();
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        const absoluteTop = rect.top + scrollTop;
                        const headerOffset = 120;
                        const scrollPosition = absoluteTop - headerOffset;

                        if (scrollPosition >= 0) {
                            window.scrollTo({
                                top: scrollPosition,
                                left: 0,
                                behavior: 'smooth'
                            });
                        }
                    }
                }, 100);
            });

            tocContainer.appendChild(link);
        });
    }

    let tocLinks = [];
    let headings = [];

    function updateTOCLinks() {
        tocLinks = document.querySelectorAll('.toc a');
        const activeManual = document.querySelector('.manual-content.active');
        if (activeManual) {
            headings = activeManual.querySelectorAll('h3');
        }
    }

    function highlightTOC() {
        if (tocLinks.length === 0 || headings.length === 0) {
            updateTOCLinks();
        }

        let currentSection = '';
        const scrollPosition = window.scrollY + 150;

        headings.forEach(heading => {
            const sectionTop = heading.offsetTop;
            if (scrollPosition >= sectionTop) {
                currentSection = heading.id;
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(function() {
            highlightTOC();
        });
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            setTimeout(() => {
                updateTOCLinks();
                highlightTOC();
            }, 100);
        });
    });

    window.addEventListener('beforeprint', function() {
        manualContents.forEach(content => {
            content.classList.add('printing');
        });
    });

    window.addEventListener('afterprint', function() {
        manualContents.forEach(content => {
            content.classList.remove('printing');
        });
    });
});
