setTimeout(loadMusic, 2000);
function loadMusic() {
    if ($('#music-content')) {
        $('#music-content').append('<iframe frameborder="no" border="0"'
                + ' marginwidth="0" marginheight="0" width=330 height=450'
                + ' src="http://music.163.com/outchain/player?type=0'
                + '&id=160240671&auto=0&height=430"></iframe>');
    }
}

var isFirstToggleMusic = true;
function toggleMusicPanel() {
    $('#music-control').toggleClass('on');
    if (isFirstToggleMusic) {
        _gaq.push(['_trackEvent', 'ToggleMusic', 'InRecent', window.location.pathname]);
        isFirstToggleMusic = false;
    }
}

function processPageView(rows) {
    if (rows === undefined) {
        return;
    }
    $('.post-block').each(function() {
        var myPath = $(this).children('h2').children('a').attr('href');
        if (myPath) {
            myPath = myPath.slice('http://blog.zhangweixiang.com'.length);
            var len = rows.length;
            var cnt = 0;
            for (var i = 0; i < len; ++i) {
                var thatPath = rows[i][0];
                var queryId = thatPath.indexOf('?');
                var mainPath = queryId >= 0 ? thatPath.slice(0, queryId) : thatPath;
                if (thatPath === myPath || mainPath === myPath 
                        || mainPath === myPath + 'index.html' 
                        || myPath === mainPath + 'index.html') {
                    cnt += parseInt(rows[i][1]);
                }
            }
            if ($(this).hasClass('cn')) {
                $(this).append('<div class="view-cnt">（' + cnt + ' 人已阅）</div>');
            } else {
                $(this).append('<div class="view-cnt">(' + cnt + ' viewed)</div>');
            }
        }
    });
}

LazyLoad.css('/css/font.css');

LazyLoad.js('http://zhangweixiang.com/js/jquery.min.js', function () {
    $('h1').each(function() {
        if ($(this).children('.h1-link').length === 0) {
            var id = $(this).text().replace(/\ /g, '-').replace(/\W^\-/g, '')
                    .toLowerCase();
            if (id !== '') {
                $(this).attr('id', id)
                        .append(' <a class="h1-link" href="#' + id + '">#</a>');
            }
        }
    });

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) === false) {
        LazyLoad.js('/js/jquery.timeago.min.js', function () {
            $('.timeago').timeago().show();
        });
    }

    LazyLoad.js('/js/unviel.min.js', function () {
        $("img").unveil();

        // google pageview
        setTimeout(function() {
            $.ajax({
                url: 'https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A115361882&start-date=30daysAgo&end-date=today&metrics=ga%3Ausers&dimensions=ga%3ApagePath&access_token=ya29.dQIsAydlmvSGHbfYDgHG14gjLIxzaaO4YAlR7YuMIayeaK6T-Uf4hPDvp9_0SGEYxGeX',
                dataType: 'jsonp',
                timeout: 1000 * 3, // 3 sec
                success: function(data) {
                    processPageView(data.rows);
                },
                error: function() {
                    // if fail to get up-to-date data from GAE, get cached local version
                    console.log('Failed to get page view from GAE!');
                    $.ajax({
                        url: '/pageview.json',
                        dataType: 'json',
                        success: function(data) {
                            console.log('Local page view used.');
                            processPageView(data.rows);
                        }
                    })
                }
            });
        }, 2000);
    });

    // add target="_blank" for external links
    $(document.links).filter(function() {
        return this.hostname !== window.location.hostname;
    }).attr('target', '_blank');

    if (typeof jQueryCallBack === 'function') {
        jQueryCallBack();
    }
});

// emoji
setTimeout(function() {
    LazyLoad.css('/css/emojify.min.css', function () {
        LazyLoad.js('/js/emojify.min.js', function () {
            emojify.setConfig({
                emoticons_enabled: true,
                people_enabled: true,
                nature_enabled: true
            });
            emojify.run();
        });
    });
}, 5000);
LazyLoad.js('/js/jquery.qrcode.min.js', function () {
//Get shorturl by sina
	var url = toUtf8(window.location.href);  
	$.ajax({ 
			async:false,
			url: "http://api.t.sina.com.cn/short_url/shorten.json?url_long="+url+"&source=724876739",
			context: document.body,
			dataType: "jsoncallback",
			type: "GET",
			dataType:'jsonp',
			success: function(data){
					url = data[0].url_short;//shortname
			},
			error: function(data){
					url = url;
			}
			});
	//generate QR code 
	jQuery('#qrshare').qrcode({     
						render: "table", //table方式      
						width: 200, //宽度      
						height:200, //高度  
						text: url //任意内容
						}); 
        });

// other files for different pages, define loadJs arrary
if (typeof loadJs === 'object') {
    for (var i = 0, len = loadJs.length; i < len; ++i) {
        // load each js file and call callback
        LazyLoad.js(loadJs[i][0], loadJs[i][1]);
    }
}
function toUtf8(str) {    
    var out, i, len, c;    
    out = "";    
    len = str.length;    
    for(i = 0; i < len; i++) {    
        c = str.charCodeAt(i);    
        if ((c >= 0x0001) && (c <= 0x007F)) {    
            out += str.charAt(i);    
        } else if (c > 0x07FF) {    
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));    
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));    
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));    
        } else {    
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));    
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));    
        }    
    }    
    return out;    
}
