document.getElementById('parseBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    }, () => {
        chrome.tabs.sendMessage(tab.id, { action: "parsePage" }, (response) => {
            if (response && response.data) {
                generateXLS(response.data);
            }
        });
    });
});

function generateXLS(data) {
    const XLSX = window.XLSX || {};

    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const xlsData = XLSX.write(wb, { bookType: 'xls', type: 'array' });

    const blob = new Blob([xlsData], { type: 'application/vnd.ms-excel' });

    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
        url: url,
        filename: 'parsed_data.xls'
    });

    document.getElementById('status').textContent = 'Файл успешно сохранен!';
}