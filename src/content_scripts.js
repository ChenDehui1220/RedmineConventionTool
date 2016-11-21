/* global chrome */

(function() {

    'use strict';

    var title = document.getElementById('issue_subject');
    var userName = document.getElementsByClassName('user')[0].innerHTML;
    var reg = /(\[.*\])/g;

    function dataToInput(data) {
        var output = '';
        var originValue = title.value;

        originValue = originValue.replace(reg, '');

        for (var i in data) {
            output += '[' + data[i] + ']';
        }

        title.value = output + '' + originValue;
    }

    function dataToTextarea(data) {
        var textarea = document.getElementById('issue_notes');
        document.getElementsByClassName('icon-edit')[0].click();
        textarea.innerHTML = data;
        textarea.style.height = '400px';
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

        if (request.action == 'init') {

            sendResponse({ user: userName, nowtag: title.value.match(reg) });

        } else if (request.action == 'ticket') {

            dataToInput(request.data);

        } else if (request.action == 'reply') {

            dataToTextarea(request.data);

        } else {

        }
    });

})();
