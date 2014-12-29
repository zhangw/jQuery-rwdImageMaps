/*
* rwdImageMaps jQuery plugin v1.5
*
* Allows image maps to be used in a responsive design by recalculating the area coordinates to match the actual image size on load and window.resize
*
* Copyright (c) 2013 Matt Stow
* https://github.com/stowball/jQuery-rwdImageMaps
* http://mattstow.com
* Licensed under the MIT license
*/
;(function($) {
	$.fn.rwdImageMaps = function() {
		var $img = this;
		
		var rwdImageMap = function() {
			$img.each(function() {
				if (typeof($(this).attr('usemap')) == 'undefined')
					return;
			  //设置了usemap属性的某张图  
				var that = this,
					$that = $(that);
				
				/*
         * Since WebKit doesn't know the height until after the image has loaded, perform everything in an onload copy
         * 通过创建一个新的img元素，并指定其源图片的src，重新加载以获取未响应式调整尺寸之前，默认的高宽，以此和实际的高宽(响应式调整之后)比较，动态计算area的坐标值
         * $('<img />').load() method deprecated as jQuery version > 1.8, use image object native
         * method onload instead.
         */
        //内存中加载原图
        var copyimg = $('<img />').attr('src',$that.attr('src'));
        copyimg[0].onload = function() {
          //$('<img />').load(function() {
          //先尝试使用<img width='1024' height='768' />获取原图的属性值(初始值由开发人员指定，属性值在响应式调整中不会改变)
          var attrW = 'width',
          attrH = 'height',
          w = $that.attr(attrW),
          h = $that.attr(attrH);
          //未能通过jQuery获取图片属性，使用copyimg的native方式获取
          if (!w)
            w = this.width;
          if (!h)
            h = this.height;
          map = $that.attr('usemap').replace('#', ''),
          c = 'coords';
          //重新计算usemap的坐标值
          $('map[name="' + map + '"]').find('area').each(function() {
            var $this = $(this);
            //保存未修改的坐标值到data属性中
            if (!$this.data(c))
              $this.data(c, $this.attr(c));
            //创建新的坐标值数组
            var coords = $this.data(c).split(','),
            coordsPercent = new Array(coords.length);
            //偶数/奇数的索引是横/纵坐标，使用当前实际尺寸/原始尺寸重新计算坐标
            for (var i = 0; i < coordsPercent.length; ++i) {
              if (i % 2 === 0)
                coordsPercent[i] = parseInt(coords[i]*($(that).width()/w));
              else
                coordsPercent[i] = parseInt(coords[i]*($(that).height()/h));
            }
            //应用新坐标
            $this.attr(c, coordsPercent.toString());
          });
        };
			});
		};
		$(window).resize(rwdImageMap).trigger('resize');
		return this;
	};
})(jQuery);
