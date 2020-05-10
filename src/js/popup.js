const QRCode = require('qrcode');
const buttonContainer = document.getElementById('button-container');
const qrOutput = document.getElementById('qr-output');
const labelOutput = document.getElementById('label-output');

chrome.tabs.getSelected(null, updateURL);

function updateURL({ url }) {
    const urlInfo = getInfoFromUrl(url).reduce((complete, singleInfo) => {
        if (complete.find(existent => existent.value === singleInfo.value)) {
            return complete;
        }
        return [...complete, singleInfo];
    }, []);
    console.log(urlInfo);
    if (urlInfo.length > 1) {
        urlInfo.forEach(addButtonSelector);
    } else {
        showValue(urlInfo[0].value);
    }

    qrOutput.classList.remove('hidden');
}

function addButtonSelector(buttonInfo) {
    const button = document.createElement('button');
    button.innerText = buttonInfo.label;
    button.classList.add('cmd-button');
    buttonContainer.appendChild(button);
    button.addEventListener('click', () => {
        button.classList.add('selected');
        buttonContainer.querySelectorAll('.cmd-button').forEach(cmdButton => {
            if (cmdButton !== button) {
                cmdButton.classList.remove('selected');
            }
        });
        showValue(buttonInfo.value);
    });
}

function showValue(value) {
    QRCode.toCanvas(qrOutput, value);
    labelOutput.innerText = value;
}

function getInfoFromUrl(url) {
    const protocolSplit = url.split('://');
    const protocol = protocolSplit[0];
    const path = protocolSplit[1].split('/');
    const host = path[0];
    return [{
        key: 'basic',
        label: 'basic',
        value: [protocol, host].join('://')
    }, {
        key: 'pathOnly',
        label: 'path only',
        value: url.replace(/\?.*|#.*/, '').replace(/\/$/, '')
    }, {
        key: 'withQueryString',
        label: 'with query string',
        value: url.replace(/#.*/, '').replace(/\/$/, '')
    }, {
        key: 'complete',
        label: 'complete',
        value: url.replace(/\/$/, '')
    }];
}