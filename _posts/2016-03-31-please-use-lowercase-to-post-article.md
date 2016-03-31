---
title: Please Use Lowercase Words To Name Your Article
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

{% highlight text %}
## Please Use Lowercase Words To Name Your Article！
{% endhighlight %}


eg.You write an article named `2016-03-30-review-Who_Moved_My_Cheese.md` and upload it on github.You will not find it on your pages!

The correct way is rename your article as `2016-03-30-review-who_moved_Myy_cheese.md`.Then you can find it on `http://blog.zhangweixiang.com/2016/03/31/review-who-moved-my-cheese/`.

This really is a gental reminder.
