# 本示例只包含识别部分

##  将识别物转换成Base64 字符串

> PS: 建议所有识别图大小不要超过400K, AR目前的数据传输类似JSbridge方式，超过400K以后 在部分Android机器上会出现数据丢失问题

> 注意此字符的获取是经过一些算法计算后，压缩，再进行base64后得到，生成工具可以移步这里：http://gitlab.alibaba-inc.com/Tmall-Interaction/iOS-ARSDK

```

var dataObject = "XXXXX";

```

## 启动

```

	Ali.call('ARPlugin.startUp', [dataObject], function (b) {
		
	});


```

## 监听识别事件

```

	document.addEventListener('arpluginupdate', arPluginUpdate, false);

```


### 如果你不想使用3d做渲染，只要识别到目标以后就做内容展示  可以这样:

```

function arPluginUpdate(e){
	if (e.param.models.length > 0) {
		console.log("识别到结果");
	}
}

```


### 如果你想在识别到目标后使用3D做渲染，识别程序会返回下面几个结果:

+ viewport
+ projection Matrix
+ model Matrix


示例JOSN:

```

{
	"viewport": [-105, 0, 851, 1136], // Viewport
	"models": [
	{
		"name": "pinball", 
		"mvprojection": [ // Model View Projection
			2.394426, -0.04623331, -0.1083115, -0.1077713, 
			0.0528238, 1.809534, -0.05749675, -0.05720999, 
			-0.2414996, -0.06555773, -0.9975035, -0.9925284, 
			-187.2699, -213.9585, 399.7688, 407.75
		],
		"projection": [ //Projection
			0, -1.811002, 0, 0, 
			2.407058, 0, 0, 0, 
			0.02137727, 0.0334729, -1.005013, -1, 
			0, 0, -10.02506, 0
		],
		"modelmatrix": [  //Model
			0.02752107, 0.9937948, 0.1077713, 0, 
			-0.9981321, 0.02143729, 0.05720999, 0, 
			0.05454468, -0.1091445, 0.9925284, 0, 
			110.6072, -74.17903, -407.75, 1
		]
	}
]}


```



## 唤起程序(点击对应图片 识别下方的图片)

扫码：


```
tmall://page.tm/AR?url=http://groups.demo.taobao.net/Tmall-Interaction-Native/testar
```

![扫码](//img.alicdn.com/tps/TB1CAQ9OVXXXXaqapXXXXXXXXXX-656-650.png)

## 识别图


![ios](//gw.alicdn.com/mt/TB1lAm6KXXXXXb6XXXXXXXXXXXX-478-255.png)
![ios](//gw.alicdn.com/mt/TB13Um9KXXXXXaHXXXXXXXXXXXX-202-201.jpg)
![ios](//gw.alicdn.com/mt/TB1XVKWKXXXXXb.XpXXXXXXXXXX-202-201.jpg)
![ios](//gw.alicdn.com/mt/TB1S55IKXXXXXaqXVXXXXXXXXXX-203-203.jpg)
![ios](//gw.alicdn.com/mt/TB14Wq5KXXXXXcIXXXXXXXXXXXX-1024-1024.jpg)
![ios](//gw.alicdn.com/mt/TB1OQc7KXXXXXbDXFXXXXXXXXXX-1024-1024.jpg)
![ios](//gw.alicdn.com/mt/TB1btJmKVXXXXcyXVXXXXXXXXXX-640-312.jpg)

![ios](//gw.alicdn.com/mt/TB1Li7MLXXXXXX8XpXXXXXXXXXX-620-207.jpg)
![ios](//gw.alicdn.com/mt/TB1Q_.TLXXXXXbbXXXXXXXXXXXX-640-222.jpg)






