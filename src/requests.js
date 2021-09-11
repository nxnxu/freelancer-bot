const https = require('https');

function justLog(...args) {
    for (const arg of args) {
        console.log('Requests:', arg);
    }
}

function getResponse(options, successCallback = justLog, errorCallback = justLog) {
    const req = https.request(options, res => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => successCallback(data));
    });
    req.on('error', errorCallback);
    req.end();
}

function multiRequest(options, successCallback, errorCallback) {
    let datas = [];
    let index = 0;
    let func = data => {
        datas.push(data);
        index += 1;
        if (index < options.length) {
            getResponse(options[index], func, errorCallback);
        } else {
            successCallback(datas);
        }
    };
    getResponse(options[index], func, errorCallback);
}


function multiRequest2(options, successCallback, afterAll = justLog, errorCallback = justLog) {
    let index = 0;
    let func = data => {
        successCallback(data);
        index += 1;
        if (index < options.length) {
            getResponse(options[index], func, errorCallback);
        } else {
            afterAll();
        }
    };
    getResponse(options[index], func, errorCallback);
}

const exported = {multiRequest, getResponse, multiRequest2}
export default exported;