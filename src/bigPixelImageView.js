;(function($) {
	/*
		ops = {
			"imgPathArray": [[],[],[]], // 存储图片的二维数组
			"canvasId": "", //canvas元素的id
			"blockWidth": 256, //小图块宽度，单位px
			"blockHeight": 256, //小图块高度，单位px
			"blockRowNum": 2, //小图块行数
			"blockColNum": 74,//小图块列数目
			"cacheImgNum": 400 //缓存图片数量
		}
	*/
	function BigPixelImageView(ops) {

		var def = {
			"blockWidth": 256,
			"blockHeight": 256

		}
		this.ops = $.extend({}, def, ops);
		this._cache = {
			"imgArr" : []
		};
		this.$canvas = $("#" + this.ops.canvasId);

		//canvas必须显示设置 width和height属性，否则单位不能统一
		this.$canvas.attr("width", this.$canvas.width());
		this.$canvas.attr("height", this.$canvas.height());

	}

	BigPixelImageView.prototype.init = function (startX, startY, callback) {
		this.positionX = startX || 0;
		this.positionY = startY || 0;

		this.draw(this.positionX , this.positionY, callback);
	};

	/*
		绘制图块
		参数：startX,startY 为在大图像中的起点坐标
		callback: 全部绘制完毕之后的回调函数
	*/
	BigPixelImageView.prototype.draw = function (startX, startY, callback) {
		var that, $canvas, endX, endY, startRow, startCol, endRow, endCol, cxt, i, j, img, imgArr, blockWidth, blockHeight, index, position;

		that        = this;
		position    = that.fixPosition(startX, startY);
		startX      = position.startX;
		startY      = position.startY;
		$canvas     = that.$canvas; //canvas element
		cxt         = $canvas[0].getContext("2d");
		blockWidth  = that.ops.blockWidth;
		blockHeight = that.ops.blockHeight;

		endX = startX + $canvas.width(); //绘制结束点坐标
		endY = startY + $canvas.height();

		startRow = Math.floor(startY / blockHeight); //绘制起点位于大图像的第多少行
		startCol = Math.floor(startX / blockWidth);
		endRow   = Math.ceil(endY / blockHeight) - 1; //绘制终点位于大图像的第多少行
		endCol   = Math.ceil(endX / blockWidth) - 1;

		//循环绘制 
		for (i = startRow; i <= endRow; i++) {	
			for (j = startCol; j <= endCol; j++) {

				img = new Image();

				img.src = that.ops.imgPathArray[i][j];

				that._cache.imgArr.push(img); //缓存已经加载的图片
				imgArr = that._cache.imgArr;

				if (imgArr.length >= that.ops.cacheImgNum && (imgArr[0].complete||(imgArr[0].width > 0))) {
					// 控制缓存图片数量，在缓存大于一定值之后会引起chrome崩溃。
					// 默认400
					imgArr[0] = null;
					imgArr.shift();
				}

				//异步加载
				;(function(img, i, j) {
					var temX  = Math.round(j * blockWidth - startX);
					var temY  = Math.round(i * blockHeight - startY);

					if (img.complete) {
						cxt.drawImage(img, temX,  temY, blockWidth, blockHeight);
						index ++;
						if ((index === (endRow-startRow+1)*(endCol-startCol+1))) {
							callback && callback();
						}

						img.onload = null;
					} else {
						/*clearCanvas(j * width - x, i * height - y,j * width - x + width,i * height - y+height);*/
						img.onload = function() {
							index ++;
							cxt.drawImage(img,  temX,  temY, blockWidth, blockHeight);
							if ((index === (endRow-startRow+1)*(endCol-startCol+1))&&!isMove) {
							 	callback && callback();							 		
							}
						};
					}
				})(img, i, j);
			}
		}


	};

	BigPixelImageView.prototype.bindEvent = function () {
		var $canvas;
		var that = this;

		$canvas = this.$canvas;
		$canvas.bind("mousedown.bp", function (event){
			var mouseX, mouseY;

			mouseX = event.offsetX || event.originalEvent.layerX;
			mouseY = event.offsetY || event.originalEvent.layerY;

			$canvas.bind("mousemove.bp", function (event){
				var newX = event.offsetX || event.originalEvent.layerX;
				var newY = event.offsetY || event.originalEvent.layerY;

				that.positionX = that.positionX - (newX - mouseX);
				that.positionY = that.positionY - (newY - mouseY);
				that.draw(that.positionX, that.positionY);
				
				mouseX = newX;
				mouseY = newY;
			});
			$canvas.bind("mouseout.bp", function (event){
				$canvas.unbind("mousemove.bp");
				$canvas.unbind("mouseout.bp");
			});
			$canvas.bind("mouseup.bp", function (event){
				$canvas.unbind("mousemove.bp");

			});
		});



	};

	BigPixelImageView.prototype.fixPosition = function (startX, startY) {
		var correct = {};
		if (startX < 0) {
			startX = 0;
		}
		if (startY < 0) {
			startY = 0;
		}
		if (startX + this.$canvas.width() > (this.ops.blockWidth * this.ops.blockColNum) ) { //左边留白58像素
			startX = this.ops.blockWidth * this.ops.blockColNum - this.$canvas.width();
		}
		if (startY + this.$canvas.height() > this.ops.blockHeight * this.ops.blockRowNum) {
			startY = this.ops.blockHeight * this.ops.blockRowNum - this.$canvas.height();
		}
		correct.startX = startX;
		correct.startY = startY;
		this.positionX = startX; //记录当前位置信息
		this.positionY = startY;

		return correct;
	};

	if (typeof module != "undefined" &&
		typeof module.exports != "undefined") {
		module.exports = BigPixelImageView;
	}
	else {
		window.BigPixelImageView = BigPixelImageView;
	}
})(jQuery);

