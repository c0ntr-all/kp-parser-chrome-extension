chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "parsePage") {
        const results = [];
        const container = document.getElementById('itemList')
        const items = container.querySelectorAll('.item')
        Array.from(items).forEach(element => {
            const info = element.querySelector('.info')
            const etc = element.querySelector('.etc')
            const images = element.querySelector('.images')

            const id = element.getAttribute('data-id')
            const removeElement = element.querySelector('.remove');
            const datetimeSpan = removeElement.nextElementSibling;
            const datetime = datetimeSpan && datetimeSpan.tagName === 'SPAN' ? datetimeSpan.innerText : 'no datetime'
            const result= {
                id: id,
                title: info.querySelector('.name').innerText,
                datetime: datetime,
                image: images.querySelector('.flap_img').getAttribute('title'),
                estimation: etc.querySelector(`.show_vote_${id}`).innerText,
                kp_estimation: etc.querySelector('.kpRating').innerText.split(' ')[0],
            }

            results.push(result)
        })

        console.log(results)

        sendResponse({ data: results });
    }
});