---
layout: titled
nocomment: true
title: 来人，赏~
subtitle: 送维祥一本书，让他写出更棒的文章！
---

{% include follow.html %}

我喜欢在业余时间捣腾些<a href="https://github.com/zwxscience" target="_blank">有意思的项目</a>。

我每年要读好多书（可以到<a href="http://book.douban.com/people/ovilia1024/collect" target="_blank">豆瓣读书</a>查看我最近读过的书），也要买很多书。自从买了 Kindle Paperwhite 2，阅读量更是直线上升。当然，数字并不能说明一切，因为有的书很厚，有的书需要慢慢品味，有的技术书应该跳着读，所以数字只能作为一个大致的参考。

2014 年我读了 <strong class="text-xlarge">170</strong> 本书，2015 年至今共读了 <strong class="text-xlarge">65</strong> 本书。

<div id="reading-chart" style="height: 400px"></div>

看了这么多书，当然也花了不少钱买书，钱包君表示再也受不了啦~ 好在 Kindle 上买电子书相对便宜些（罪恶地说，也读了不少盗版书。尽量克制自己囤书的欲望，不过该买的还得买买买呀！

所以，如果你愿意贡献一份财力的话，weixiang在这里先行谢过啦！



# 打赏方式

## 方法一：支付宝扫一扫

<img src="{{ site.loadingImg }}" data-src="http://blog.zhangweixiang.com/img/zhifu.png" />

## 方法二：转账到我的支付宝账号

`zwxscience@163.com`

好啦，不多说了，我要读书去啦！


<script type="text/javascript">
    var loadJs = [['{{ site.url }}/js/echarts-all.js', function() {
        // init echarts
        var chart = echarts.init($('#reading-chart')[0]);
        chart.setOption({
            tooltip: {
                trigger: 'value'
            },
            legend: {
                data:['2014', '2015']
            },
            grid: {
                x: 40,
                x2: 40,
                y: 40
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月',
                        '7月', '8月', '9月', '10月', '11月', '12月'],
                axisLine: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                axisLine: {
                    show: false
                }
            }],
            series: [{
                name: '2014',
                type: 'bar',
                data: [5, 28, 11, 9, 16, 9, 16, 13, 12, 5, 9, 9, 7, 6],
                itemStyle: {
                    normal: {
                        color: '#22C3AA'
                    }
                },
                markPoint: {
                    data: [{
                        type: 'max', 
                        name: '最大值'
                    }, {
                        type: 'min',
                        name: '最小值'
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: '平均值'
                    }]
                }
            }, {
                name: '2015',
                type: 'bar',
                data: [7, 9, 9, 7, 8, 7, 4, 1, 9, 2],
                itemStyle: {
                    normal: {
                        color: '#D0648A'
                    }
                },
                markPoint: {
                    data: [{
                        type: 'max', 
                        name: '最大值'
                    }, {
                        type: 'min',
                        name: '最小值'
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: '平均值'
                    }]
                }
            }]
        });

        $(window).resize(chart.resize);
    }]];
</script>
