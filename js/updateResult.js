setTimeout(function() {
		 $.ajax({
			url: 'http://www.zhangweixiang.com/visitinfo.ashx?url='+window.location.pathname,
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
        }, 2000);