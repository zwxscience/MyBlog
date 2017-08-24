
LazyLoad.js('http://zhangweixiang.com/js/jquery.min.js', function () {
var queryId = window.location.pathname.indexOf('?');
var mainPath = queryId >= 0 ? window.location.pathname.slice(0, queryId) : window.location.pathname;
mainPath = mainPath == "/"? window.location.href:mainPath;//frontPage
var title = ($(document).attr("title") == null) ? $('title').text() : $(document).attr("title");
function dealvisitCount()
{
		 $.ajax({
			url: 'http://www.zhangweixiang.com/visitInfo.ashx?method=get&from=blog',
			dataType: 'jsonp',
			timeout: 1000 * 3, // 3 sec
			jsonp: "callback",  
				jsonpCallback: "jsonpCallback",
			success: function(data) {
				processSinglePage(data);
			},
			error: function(xhr,status,error) {
				// if fail to get up-to-date data from mysite, get cached local version
				console.log(xhr);
				console.log('Failed to get page view from my site!');	
			}
		});	
	setTimeout("dealvisitCount()",3000);
}

var pagecnt = 0;
function processSinglePage(rows) {
	if (rows == undefined) {
		return;
	}
	var myPath = $.trim(title);

	var currentCount = getVisitCount(rows,myPath);
	if(pagecnt< currentCount)
	{
		pagecnt = currentCount;
		$("#pageview").html("访问量 <span id = 'visitcount' >"+ currentCount+"</span>").show();
		$('#visitcount').addClass('visitcount');
		setTimeout("$('#visitcount').removeClass('visitcount')",1500);
	}
}
setTimeout(function() {

		 $.ajax({
			url: 'http://www.zhangweixiang.com/visitinfo.ashx?url='+mainPath+'&from=blog&title=' + $.trim(title),
			dataType: 'jsonp',
			timeout: 1000 * 3, // 3 sec
			jsonp: "callback",  
    			jsonpCallback: "jsonpCallback",
			success: function(data) {
				console.log('update site visit result:'+data);
			},
			error: function(xhr,status,error) {
				// if fail to get up-to-date data from mysite, get cached local version
				console.log('Failed to get page view from my site!');	
			}
		});	
		

        }, 1000);
});

