chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "parsePage") {

        const results = [];
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const links = document.querySelectorAll('a');

        headings.forEach((heading, index) => {
            results.push({
                type: 'heading',
                level: heading.tagName,
                text: heading.textContent.trim(),
                index: index
            });
        });

        links.forEach((link, index) => {
            results.push({
                type: 'link',
                text: link.textContent.trim(),
                href: link.href,
                index: index
            });
        });

        sendResponse({ data: results });
    }
});