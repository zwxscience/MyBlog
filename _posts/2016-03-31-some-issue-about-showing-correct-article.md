---
title: Some Issue About Showing Correct Article
time: 2016.03.31 14:27:57
layout: post
tags:
- Lowercase
- GitHub
- Jekyll
series: Jekyll
excerpt: I have meet somes problems these days when I try to show new article on page after uploading the md files. After trying servel times I finally find the reason.
---

I have meet somes problems these days when I try to show new article on page after uploading the md files. After trying servel times I finally find the reason.That is

# Please Use Lowercase Words To Name Your Article！

{% highlight text %}
## Please Use Lowercase Words To Name Your Article！
{% endhighlight %}


eg.You write an article named `2016-03-30-review-Who_Moved_My_Cheese.md` and upload it on github.You will not find it on your pages!

The correct way is rename your article as `2016-03-30-review-who_moved_Myy_cheese.md`.Then you can find it on [`http://blog.zhangweixiang.com/2016/03/31/review-who-moved-my-cheese/`](http://blog.zhangweixiang.com/2016/03/31/review-who-moved-my-cheese/).

# Please Use PRETABLE On Github To Check Your Article Title Info！

The title info is very important on showing page orginzing article content.The github could be make the infomation be a table if these info are correct.

eg.You write an article named [`2016-04-24-le-voleur-d'ombres.md`](https://github.com/zwxscience/myblog/edit/gh-pages/_posts/2016-04-24-le-voleur-d'ombres.md) and upload it on github.The title info is:

> 
> ---
> 
> title:《偷影子的人》：什么样的内心反应什么样的人？
> 
> time: 2016.04.24 13:53:57
> 
> layout: post
> 
> tags:
> 
> - 中文
> 
> - 书评
> 
> - 马克·李维 
> 
> - 爱情
> 
> - 成长
> 
> - 文艺 
> 
> series: 书海泛舟人
> 
> excerpt: 前几天在杭州万读书群里，突然讨论到这本书，我形容这本书的主题是“前女友被好哥们泡走了”，“吃着碗里的看着锅里的”。顿时引起一位小朋友的愤怒，直斥我“内心看到什么就是什么”，想起来感觉比较有趣，所以发了这篇。
> 
> ---

<img src="{{ site.loadingImg }}" style="max-width: 400px; max-height: 400px;" data-src="http://blog.zhangweixiang.com/img/post/2016-03-31-some-issue-about-showing-correct-article/incorrect.jpg" />
You will see this image below and this article will not shows on page.Notice:there is a space between the title and the tile content.(all is the same format)

So we add the space and the image shows below and this article shows on pages.You can see the title info are formed as a table on github.

> title: 《偷影子的人》：什么样的内心反应什么样的人？

<img src="{{ site.loadingImg }}" style="max-width: 400px; max-height: 400px;" data-src="http://blog.zhangweixiang.com/img/post/2016-03-31-some-issue-about-showing-correct-article/correct.jpg" />
 
