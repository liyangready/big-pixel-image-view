# big-pixel-image-view
基于canvas的web端实时浏览大图像解决方案

##背景

作为一个web应用，http往往是最大的敌人。在传统web站点中，图片一直是让人又爱又恨的东西。通过图片可以让你的web站点变得丰富多彩，但是在web应用中又不得不考虑图片的体积，一张高清的图片如果不被压缩处理，浏览器需要大量的时间来请求和渲染，用户体验很难跟上。

故宫一直致力于将传统文物和现代信息化技术结合起来，比如古字画在线访问，故宫希望可以通过在线技术让不能亲自前往故宫一睹文物风采的人可以足不出户感受到文物的魅力。于是故宫为古字画提供了高清影像，拿《清明上河图来说》，故宫提供的图片大小达到了1G左右，要提供在线展示功能，传统的直接展现图片的方式基本变成了不可能，于是我采用了图像分割配合canvas完成实时渲染，这也是这个项目的来源，同时也是我的毕设内容。

##成果

[故宫名画记在线展示](http://minghuaji.dpm.org.cn/index_new.html)

已经上线，其中清明上河图和韩熙载都使用了这种技术

##原理

对于《清明上河图》这样的图像，长宽都到了几千*几千的地步，正常情况下，无法在一个屏幕里面完全展现，其体积之庞大也决定了无法直接渲染在客户端。

比较容易想到的办法就是把大的图像切成无数的小块，根据用户当前屏幕浏览的位置，按需加载当前需要的小块，拼接成一幅**局部图像**，用户可以自由拖拽和缩放来实现对全局的浏览。

这样做的好处：

1 按需加载只需要加载用户需要的这一屏幕的图片，大小完全处于可控状态，拿清图来说，一整张图一个G，但是一屏幕的图只需要500k左右。网络请求完全不会有问题。

2 现代浏览器对于图片都支持并发请求，小图片集合可以做到并发请求，减少整体请求时间。

##why canvas

其实大图像浏览可以理解成一个**地图应用**，类似百度地图，地图可以是无边界的，我们通过块状拼接来实现浏览一个无边界的图片。百度地图使用的是纯dom的方法，每个小块都是一个div，通过定位来实现图片的拼接，我们为什么没用采用这种方式？

1 **干净程度**   
可以去看一下百度地图的html元素，每一个小块对应一个div再加上里面的交互元素，页面中包含了成百上千个dom节点，不仅让html变得很难维护，而且大量的dom给浏览器的渲染带来了很大的挑战。

而canva的实现方式可以看出来，就一个 canvas 标签，非常干净明了。

2 **坐标计算**   
拼接图片块是一个非常精细的过程，canvas本身有一套坐标系统，而div实际上不是做这种工作的，当然通过绝对定位可以实现，但是比起canvas来说，还是没有那么方便。

3 **效率**   
我们都知道，dom操作是非常非常昂贵的事情，这也是为什么 _React_的虚拟dom一出就受到了很大的关注。而在拖动和缩放的过程中，整个页面都在不断的reflow && repaint，通过canvas带来的好处是，利用cpu来换gpu的性能，canvas一次绘制结束之后就是一张图片，没有dom上面的性能问题。

关于canvas和dom性能的问题，flipbord的项目也备受关注。

[利用canvas绘制页面](https://github.com/Flipboard/react-canvas)

4 **尝试**  
其实也是对canvas的一次试水，故宫作为传统的代表，同意了我的方案，也是一种开创性的尝试。

5 **低版本浏览器**
我不认为通过dom实现能在低版本带来多好的体验，与其为了将就低版本浏览器而放弃好的尝试，还不如提醒低版本浏览器去升级而获得更好的体验。

##开源了什么

由于故宫的一些版权问题（给国家机构干活就是这样的 - -!），项目不能开源，我想着可以把这套解决方案抽象出来。 所以这个项目里面的内容可能比较简单，就当是**提供一个思路**，如果对这方面有兴趣的可以一起探讨。

##欢迎拍砖

这项目是我大四毕设作品，那时候自学前端，认识肤浅，难免有各种问题，欢迎拍砖。