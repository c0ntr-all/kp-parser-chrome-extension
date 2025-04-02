document.getElementById('parseBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    }, () => {
        chrome.tabs.sendMessage(tab.id, { action: "parsePage" }, (response) => {
            if (response && response.data) {
                const csvData = jsonToCsv(response.data);

                downloadCsv(csvData, 'movies_data.csv');
            }
        });
    });
});

function jsonToCsv(jsonData) {
    const headers = ['id', 'title', 'datetime', 'image', 'estimation', 'kp_estimation'];

    let csv = headers.join(';') + '\n';

    jsonData.forEach(item => {
        const row = headers.map(header => {
            let value = item[header] || '';
            if (typeof value === 'string' && (value.includes(';') || value.includes('"'))) {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });

        csv += row.join(';') + '\n';
    });

    return csv;
}

function downloadCsv(csv, filename) {
    // Добавляем BOM для правильного отображения UTF-8 в Excel
    const BOM = "\uFEFF";
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}