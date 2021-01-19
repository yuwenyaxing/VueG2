//数字滚动
;(function($, window, document) {
    "use strict";
    var defaults = {
        deVal: 0,       //传入值
        className:'dataNums',   //样式名称
        digit:''    //默认显示几位数字
    };
    function rollNum(obj, options){
        console.log(obj, options)
        this.obj = obj;
        this.options = $.extend(defaults, options);
        this.init = function(){
             this.initHtml(obj,defaults);
        }
    }
    rollNum.prototype = {
        initHtml: function(obj,options){
            var strHtml = '<ul class="' + options.className + ' inrow">';
            var valLen = options.digit ||  (options.deVal + '').length;
            if(obj.find('.'+options.className).length <= 0){
                for(var i = 0; i<  valLen; i++){
                    strHtml += '<li class="dataOne "><div class="dataBoc"><div class="tt" t="38"><span class="num0">0</span> <span class="num1">1</span> <span class="num2">2</span> <span class="num3">3</span> <span class="num4">4</span><span class="num5">5</span> <span class="num6">6</span> <span class="num7">7</span> <span class="num8">8</span> <span class="num9">9</span><span class="num10">.</span><span class="num0">0</span> <span class="num1">1</span> <span class="num2">2</span> <span class="num3">3</span> <span class="num4">4</span><span class="num5">5</span> <span class="num6">6</span> <span class="num7">7</span> <span class="num8">8</span> <span class="num9">9</span><span class="num10">.</span></div></div></li>';
                }
                strHtml += '</ul>';
                obj.html(strHtml);
            }
              this.scroNum(obj, options);
        },
        scroNum: function(obj, options){
            var number = options.deVal;
			var $num_item = $(obj).find('.' + options.className).find('.tt');
            var h = $(obj).find('.dataBoc').height(); 
            console.log(h)
            $num_item.css('transition','all 2s ease-in-out');
            var numberStr = number.toString();
            console.log(numberStr, $num_item)
            if(numberStr.length <= $num_item.length - 1){
                var tempStr = '';
                for(var a = 0; a < $num_item.length - numberStr.length; a++){
                    tempStr += '0';
                }
                numberStr = tempStr + numberStr;
                console.log(numberStr)
            }

            var numberArr = numberStr.split('');
            console.log(numberArr[1], -parseInt(numberArr[1])*h - h*11 + 'px')
            console.log(numberArr[2], -parseInt(numberArr[2])*h - h*11 + 'px')
            console.log(numberArr[3], -parseInt(numberArr[3])*h - h*11 + 'px')
            console.log(numberArr[4], 10*h - h*11 + 'px')
            $num_item.each(function(i, item) {
                setTimeout(function(){
                    if (numberArr[i] === '.') {
                        $num_item.eq(i).css('top',-parseInt(10)*h - h*11 + 'px');
                    } else {
                        $num_item.eq(i).css('top',-parseInt(numberArr[i])*h - h*11 + 'px');
                    }
                },i*100)

            });
        }
    }
    $.fn.rollNum = function(options){
        var $that = this;
        var rollNumObj = new rollNum($that, options);
        rollNumObj.init();
    };
})(jQuery, window, document);