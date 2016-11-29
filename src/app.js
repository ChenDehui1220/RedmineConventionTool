/**
 * Redmind 規範小工具
 * Author Gary Chen
 * Created by 2016/11/10
 */

/* global $, chrome, console */

$(function() {

    'use strict';

    var $nav = $('.nav');
    var $tabsContent = $('.tabscontent');
    var $container = $('.containter');
    var $submit = $('#submit');
    var $options = $('#options');
    var $error = $('#error');
    var stringData = [];
    var optionsData = [];
    var defaultStorageData = {};
    var tabsId = 0;
    var thisUser = '';
    var validTimes = 0;
    var actionTypeData = ['ticket', 'reply'];
    var actionTypeIdx = 0;
    var validMsg = [
        '**沒照規範 TC會生氣喔!!!',
        '**沒照規範 TC會非常生氣喔!!!',
        '**沒照規範 TC會非常非常非常生氣喔!!!',
        '**是不是沒看TC兇過!!!',
        '**不信邪?',
        '**已經Booking你跟他的時間 1on1 聊一下!!!'
    ];
    var jsonAPI = 'http://static.fridaylifestyle.tw/ec_banner/ec_redmine_convention_options_data.json';
    // var jsonAPI = './ec_redmine_convention_options_data.json';

    var tagTmp = function(tagName, isCustom) {
        var c = (isCustom !== undefined && isCustom === true) ? 'custom' : '';
        return '<a href="#" class="tag ' + c + '">' + tagName + '</a>';
    };

    //get json data.
    var fetchOptionsData = function() {

        var parse = function() {
            var optionOutput = '';
            var required = '';
            var tag = '';

            for (var i in optionsData) {

                required = (optionsData[i].require) ? 'require' : '';
                tag = optionsData[i].arg;

                //save default keys from json file.
                defaultStorageData[tag] = [];

                optionOutput += '<div class="pool ' + required + ' tg-' + tag + '"><label for="' + optionsData[i].arg + '">' + optionsData[i].name + ' : </label>';

                for (var j in optionsData[i].data) {
                    optionOutput += tagTmp(optionsData[i].data[j]);
                }

                optionOutput += '<a href="#" class="plus">+</a>';

                optionOutput += '</div>';
            }

            $options.html(optionOutput);
        };

        $.ajax({
            url: jsonAPI,
            dataType: 'json',
            cache: false,
            success: function(data) {
                if (typeof data === 'object' && Object.keys(data).length > 0) {
                    if (data.data.length > 0) {
                        optionsData = data.data[0].options;
                        parse(data);
                        fetchStorageData();
                    }
                }
            }
        });
    };
    fetchOptionsData();

    var catchData = function() {
        stringData = [];

        if (actionTypeIdx === 0) {
            $container.find('.pool').each(function() {
                $(this).find('a').each(function() {
                    if ($(this).hasClass('in')) {
                        stringData.push($(this).html());
                    }
                });
            });
        } else if (actionTypeIdx === 1) {
            // stringData.push($('#replys').html());
            var t = 'h3. [更動範圍]\r\n';
            t += '模組:\r\n行為類型:\r\n異動點:\r\n\r\n';
            t += 'h3. [複雜度]\r\n普通級\r\n\r\n';
            t += 'h3. [預計處理步驟]\r\n...\r\n\r\n';
            t += 'h3. [預計測試範圍]\r\n...\r\n\r\n';
            t += 'h3. [實際處理步驟]\r\n...\r\n\r\n';
            t += 'h3. [Code Commit Id]\r\n無\r\n\r\n';
            t += 'h3. [DB異動]\r\n無\r\n\r\n';
            t += 'h3. [產出相關文件]\r\n無\r\n\r\n';
            stringData.push(t);
        } else {}
    };

    var validRequireItems = function() {
        var flag = true;

        if (actionTypeIdx === 0) {
            var have = false;

            if (stringData.length === 0) {
                flag = false;
            } else {
                for (var i in optionsData) {
                    if (optionsData[i].require === true) {

                        have = false;

                        for (var j in optionsData[i].data) {
                            if (stringData.indexOf(optionsData[i].data[j]) !== -1) {
                                have = true;
                                break;
                            }
                        }

                        if (!have) {
                            flag = false;
                            break;
                        }
                    }
                }
            }

            if (!flag) {
                $error.html(validMsg[validTimes]);

                if (validTimes < (validMsg.length) - 1) {
                    validTimes++;
                }
            } else {
                $error.html('嗯~ 好一位乖寶寶');
            }
        }

        return flag;
    };

    //init content scripts
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {

        if (/pm\.hq\.hiiir\/(projects|issues)\/(.*)/i.test(tabs[0].url)) {

            tabsId = tabs[0].id;

            chrome.tabs.executeScript(tabsId, { file: "content_scripts.js" }, function() {

                chrome.tabs.sendMessage(tabsId, { action: 'init' }, function(response) {
                    if (typeof response === 'object' && response.user) {
                        thisUser = response.user;
                        $error.html('Hi! ' + thisUser.toUpperCase() + ', Merry Christmas II You.');

                        //screen input tag mapping tool tag.
                        if (response.nowtag !== null) {
                            if (response.nowtag.length > 0) {
                                setTimeout(function() {
                                    var tag = response.nowtag[0];
                                    tag = tag.replace(/\]\[/g, '-');
                                    tag = tag.replace(']', '');
                                    tag = tag.replace('[', '');
                                    tag = tag.split('-');
                                    $options.find('a').each(function() {
                                        if (tag.indexOf($(this).html()) !== -1) {
                                            $(this).addClass('in');
                                        }
                                    });
                                }, 250);
                            }
                        }
                    }
                });
            });
        } else {
            $container.html('<span class="nosupport">不支持此網頁使用!!!</span>');
        }

    });

    //switch tabs
    var switchTabs = function(dom) {
        var tabIdx = dom.index();
        $nav.find('li').removeClass('active');
        dom.addClass('active');
        $tabsContent.hide();
        $tabsContent.eq(tabIdx).show();
        actionTypeIdx = tabIdx;
    };

    //custom tag
    var inputEvent = function(dom) {
        dom.focus();
        dom.on('blur', function() {
            var d = $(this);
            var pa = d.parent('a');
            if (d.val() === '') {
                pa.remove();
            } else {
                var key = pa.parent('.pool').find('label').attr('for');
                var val = d.val().trim();
                putStorageData(key, val);
                pa.attr('class', 'tag');
                pa.html(val);
            }
        });
    };

    /* --- event start --- */

    //tabs control
    $nav.on('click', 'li', function(e) {
        e.preventDefault();
        switchTabs($(this));
    });

    //tabs default first
    $nav.find('li:eq(0)').trigger('click');

    //tag choose
    $container.on('click', 'a.tag', function(e) {
        e.preventDefault();
console.log('test');
        if ($(this).hasClass('in')) {
            $(this).removeClass('in');
        } else {
            $(this).addClass('in');
        }
    });

    //add new custom tag.
    $container.on('click', 'a.plus', function(e) {
        e.preventDefault();

        var origin = $(this).parent('.pool');

        if (origin.find('input').length === 0) {
            $(this).before('<a href="#"><input type="text" /></a>');
            inputEvent(origin.find('input'));
        }
    });

    //submit
    $submit.on('click', function() {

        catchData();

        if (validRequireItems()) {

            chrome.tabs.sendMessage(tabsId, { action: actionTypeData[actionTypeIdx], data: stringData }, function(response) {
                validTimes = 0;
            });
        }
    });

    //entry del mode
    function delModelInit() {

        $('.custom').each(function() {
            var isDel = true;
            var haveBtn = false;

            $(this).mouseover(function() {
                var t = $(this);
                isDel = true;

                setTimeout(function() {


                    if (isDel === true && !haveBtn) {

                        var delBtn = $('<span>');
                        delBtn.attr({
                            'class': 'del',
                            'data-tag': t.html()
                        }).html('X').on({
                            mouseenter: function() {
                                isDel = false;
                            },
                            mouseleave: function() {
                                isDel = true;
                                haveBtn = false;
                                $(this).remove();
                            },
                            click: function(e) {
                                e.preventDefault();
                                var t = $(this);
                                var g = t.data('tag');
                                var k = t.parent('.pool').find('label').attr('for');

                                t.prev().remove();
                                removeStorageData(k, g);
                                e.stopPropagation();
                            }
                        })

                        t.after(delBtn);
                        haveBtn = true;
                    }
                }, 1500);

            }).mouseleave(function() {
                isDel = false;
                var t = $(this);
                setTimeout(function() {
                    if (!isDel) {
                        t.next('.del').remove();
                        haveBtn = false;
                    }
                }, 800);
            });
        });
    }

    /* --- storage --- */

    //put storage data then set to chrome.
    function putStorageData(key, val) {
        defaultStorageData[key].push(val);
        setStorageData();
    };

    //remove storage data.
    function removeStorageData(key, val) {
        var d = defaultStorageData[key];
        d.splice(d.indexOf(val), 1);
        setStorageData();
    }

    //set chrome storage data.
    function setStorageData() {
        chrome.storage.sync.set({ 'data': defaultStorageData });
    };

    //dump storage to screen
    function dumpStorageData() {
        var data = defaultStorageData;
        for (var i in data) {
            if (data[i].length > 0) {
                var dom = $('.tg-' + i);
                var output = '';
                for (var x in data[i]) {
                    output += tagTmp(data[i][x], true);

                    //merge tagname to local options.
                    for (var z in optionsData) {
                        if (optionsData[z].arg === i) {
                            optionsData[z].data.push(data[i][x]);
                            break;
                        }
                    }
                }
                dom.find('.plus').before(output);
            }
        }

        delModelInit();
    }

    //get chrome storage data.
    function fetchStorageData() {
        chrome.storage.sync.get('data', function(obj) {
            //if never set.
            if (Object.keys(obj).length === 0) {
                setStorageData();
            } else {
                //merge storage to local variable.
                defaultStorageData = obj.data;
                dumpStorageData();
            }
        });
    };

});
