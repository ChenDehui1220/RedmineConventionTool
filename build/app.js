$(function(){"use strict";function n(){$(".custom").each(function(){var n=!0,t=!1;$(this).mouseover(function(){var a=$(this);n=!0,setTimeout(function(){if(n===!0&&!t){var i=$("<span>");i.attr({"class":"del","data-tag":a.html()}).html("X").on({mouseenter:function(){n=!1},mouseleave:function(){n=!0,t=!1,$(this).remove()},click:function(n){n.preventDefault();var t=$(this),a=t.data("tag"),i=t.parent(".pool").find("label").attr("for");t.prev().remove(),e(i,a),n.stopPropagation()}}),a.after(i),t=!0}},1500)}).mouseleave(function(){n=!1;var e=$(this);setTimeout(function(){n||(e.next(".del").remove(),t=!1)},800)})})}function t(n,t){p[n].push(t),a()}function e(n,t){var e=p[n];e.splice(e.indexOf(t),1),a()}function a(){chrome.storage.sync.set({data:p})}function i(){var t=p;for(var e in t)if(t[e].length>0){var a=$(".tg-"+e),i="";for(var r in t[e]){i+=C(t[e][r],!0);for(var o in v)if(v[o].arg===e){v[o].data.push(t[e][r]);break}}a.find(".plus").before(i)}n()}function r(){chrome.storage.sync.get("data",function(n){0===Object.keys(n).length?a():(p=n.data,i())})}var o=$(".nav"),s=$(".tabscontent"),c=$(".containter"),f=$("#submit"),u=$("#options"),l=$("#error"),h=[],v=[],p={},d=0,m="",g=0,b=["ticket","reply"],k=0,y="./ec_redmine_convention_options_data.json",C=function(n,t){var e=void 0!==t&&t===!0?"custom":"";return'<a href="#" class="tag '+e+'">'+n+"</a>"},j=function(){var n=function(){var n="",t="",e="";for(var a in v){t=v[a].require?"require":"",e=v[a].arg,p[e]=[],n+='<div class="pool '+t+" tg-"+e+'"><label for="'+v[a].arg+'">'+v[a].name+" : </label>";for(var i in v[a].data)n+=C(v[a].data[i]);n+='<a href="#" class="plus">+</a>',n+="</div>"}u.html(n)};$.ajax({url:y,dataType:"json",cache:!1,success:function(t){"object"==typeof t&&Object.keys(t).length>0&&t.data.length>0&&(v=t.data[0].options,n(t),r())}})};j();var x=function(){if(h=[],0===k)c.find(".pool").each(function(){$(this).find("a").each(function(){$(this).hasClass("in")&&h.push($(this).html())})});else if(1===k){var n="h3. [更動範圍]\r\n";n+="模組:\r\n行為類型:\r\n異動點:\r\n\r\n",n+="h3. [複雜度]\r\n普通級\r\n\r\n",n+="h3. [預計處理步驟]\r\n...\r\n\r\n",n+="h3. [預計測試範圍]\r\n...\r\n\r\n",n+="h3. [實際處理步驟]\r\n...\r\n\r\n",n+="h3. [Code Commit Id]\r\n無\r\n\r\n",n+="h3. [DB異動]\r\n無\r\n\r\n",n+="h3. [產出相關文件]\r\n無\r\n\r\n",h.push(n)}},q=function(){var n=!0;if(0===k){var t=!1;if(0===h.length)n=!1;else for(var e in v)if(v[e].require===!0){t=!1;for(var a in v[e].data)if(-1!==h.indexOf(v[e].data[a])){t=!0;break}if(!t){n=!1;break}}}return n};chrome.tabs.query({active:!0,currentWindow:!0},function(n){/pm\.hq\.hiiir\/(projects|issues)\/(.*)/i.test(n[0].url)?(d=n[0].id,chrome.tabs.executeScript(d,{file:"content_scripts.js"},function(){chrome.tabs.sendMessage(d,{action:"init"},function(n){"object"==typeof n&&n.user&&(m=n.user,l.html("Hi! "+m.toUpperCase()+", Nice to meet you."),setTimeout(function(){var t=n.nowtag[0];t=t.replace(/\]\[/g,"-"),t=t.replace("]",""),t=t.replace("[",""),t=t.split("-"),u.find("a").each(function(){-1!==t.indexOf($(this).html())&&$(this).addClass("in")})},50))})})):c.html('<span class="nosupport">不支持此網頁使用!!!</span>')});var D=function(n){var t=n.index();o.find("li").removeClass("active"),n.addClass("active"),s.hide(),s.eq(t).show(),k=t},O=function(n){n.focus(),n.on("blur",function(){var n=$(this),e=n.parent("a");if(""===n.val())e.remove();else{var a=e.parent(".pool").find("label").attr("for"),i=n.val().trim();t(a,i),e.attr("class","tag"),e.html(i)}})};o.on("click","li",function(n){n.preventDefault(),D($(this))}),o.find("li:eq(0)").trigger("click"),c.on("click","a.tag",function(n){n.preventDefault(),$(this).hasClass("in")?$(this).removeClass("in"):$(this).addClass("in")}),c.on("click","a.plus",function(n){n.preventDefault();var t=$(this).parent(".pool");0===t.find("input").length&&($(this).before('<a href="#"><input type="text" /></a>'),O(t.find("input")))}),f.on("click",function(){x(),q()&&chrome.tabs.sendMessage(d,{action:b[k],data:h},function(n){g=0})})});