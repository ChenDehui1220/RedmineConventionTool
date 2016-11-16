/* global chrome */

(function() {

    'use strict';

    var title = document.getElementById('issue_subject');
    var userName = document.getElementsByClassName('user')[0].innerHTML;

    function dataToInput(data) {
        var output = '';
        var originValue = title.value;

        originValue = originValue.replace(/(\[.*\])/g, '');

        for (var i in data) {
            output += '[' + data[i] + ']';
        }

        title.value = output + '' + originValue;
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

        if (request.action == 'init') {

            sendResponse({ user: userName });

        } else if (request.action == 'submit') {

            dataToInput(request.data);

        } else {

        }
    });

})();
