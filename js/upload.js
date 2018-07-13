
/*咖啡拉花机上传图案*/

var $edit = document.querySelector('.upload-edit');
var $result = document.querySelector('.upload-result');
var original = '';/*原图base64*/
var wait = false;/*防止重复提交*/

var drawing = document.getElementById('upload-canvas');
var ratio = window.devicePixelRatio ? window.devicePixelRatio : 1;/*获取设备像素密度，实现高清。存在性能问题*/
var wrap = document.querySelector('.upload-file');
var rem = 100;/*根目录font-size默认100*/

var wrapWidth = 0;/*图案容器宽度*/
var wrapHeight = 0;/*图案容器高度*/
var inToDataURL = false;/*重新生成图片中*/

var userZoom = 1;/*用户放大缩小*/
var userRotate = 0;/*用户旋转*/
var userY = 0;/*用户上下移动*/
var userX = 0;/*用户左右移动*/

var upload = {}

upload.previewImage = function(file){
    if(file.files && file.files[0]){
        var reader = new FileReader();
        wrap.classList.add('upload-file-ing');
        reader.onload = function(evt){
            wrap.classList.remove('upload-file-ing');
            wrap.classList.add('upload-file-hide');
            original = evt.target.result;
            upload.drawing.repeat();

            /*重置用户操作*/
            userZoom = 1;/*用户放大缩小*/
            userRotate = 0;/*用户旋转*/
            userY = 0;/*用户上下移动*/
            userX = 0;/*用户左右移动*/
        }
        reader.readAsDataURL(file.files[0]);
    }
};

upload.chooseCup = function(obj){
    for(var i = 0; i < $cups.length; i++){
        $cups[i].classList.remove('checked');
    }
    obj.classList.add('checked');
};

upload.uploadSubmit = function(self){
    var $self = self;
    if(wait) return;
    var img = drawing.toDataURL('image/png');

    // var $image = document.querySelector('.upload-image');
    // $image.innerHTML = '<img src="'+img+'" />';

    if(!original || !img) {
        alert('请上传图案');
        return;
    }

    wait = true;
    $self.innerHTML = '提交中';
    $self.classList.add('disabled');

    /*请求返回执行 start*/ 
    setTimeout(function(){/*setTimeout是模拟请求时间，开发时请移除*/

        // console.log('图案:'+img);
        wait = false;
        $result.style.display = 'block';
        $edit.style.display = 'none';
        $self.innerHTML = '确&emsp;定';
        $self.classList.remove('disabled');
        /*清空图片*/
        upload.drawing.clear();
        /*清空图片 end*/

    },2000);
    /*请求返回执行 end*/ 

};

upload.back = function(){
    $result.style.display = 'none';
    $edit.style.display = 'block';
};

window.onresize = function(){
    upload.drawing();/*画布大小调整*/
    upload.drawing.repeat();
};

window.onload = function(){
    upload.drawing();
};

/*画布初始化*/
upload.drawing = function(){
    if(!wrap) return;
    wrapWidth = wrap.offsetWidth;
    wrapHeight = wrap.offsetHeight;
    rem = upload.drawing.rem();
    if(!drawing) return;
    drawing.width = upload.drawing.ratio(wrapWidth);
    drawing.height = upload.drawing.ratio(wrapHeight);
};

/*画图*/
upload.drawing.repeat = function(option){
    if(inToDataURL || !drawing) return;

    if(option && !original){
        alert('请先上传图案');
        return;
    }

    inToDataURL = true;
    userZoom = (option && option.userZoom) ? userZoom * option.userZoom : userZoom;
    userRotate = (option && option.userRotate) ? userRotate + option.userRotate : userRotate;
    userY = (option && option.userY) ? userY + option.userY : userY;
    userX = (option && option.userX) ? userX + option.userX : userX;
    var ctx = drawing.getContext('2d');
    var wrapWidthRatio = upload.drawing.ratio(wrapWidth);
    var wrapHeightRatio = upload.drawing.ratio(wrapHeight);
    var remRatio = upload.drawing.ratio(rem);
    var bg = new Image();
    if(original){
        bg.src = original;
        bg.onload = function(){
            ctx.clearRect(0, 0, wrapWidthRatio, wrapHeightRatio);/*清空*/
            var bgZoom = wrapWidthRatio/Math.min(bg.width, bg.height) * userZoom;/*缩放比*/

            ctx.save();/*保存状态*/
            ctx.translate(wrapWidthRatio/2 + userX, wrapHeightRatio/2 + userY);
            ctx.rotate(userRotate*Math.PI/180);
            ctx.translate(-wrapWidthRatio/2, -wrapHeightRatio/2);
            ctx.drawImage(bg, (wrapWidthRatio - bg.width*bgZoom)/2 , (wrapHeightRatio - bg.height*bgZoom)/2 , bg.width*bgZoom, bg.height*bgZoom);
            ctx.restore();/*恢复状态*/

            inToDataURL = false;
        }
    }else{
            inToDataURL = false;        
    }
};

/*清空画布*/
upload.drawing.clear = function(){
    var ctx = drawing.getContext('2d');
    ctx.clearRect(0, 0, drawing.width, drawing.height);
    original = '';
    wrap.classList.remove('upload-file-hide');
};

/*获取相应像素密度的值，解决canvas存在模糊问题*/
upload.drawing.ratio = function(val){
    return val * ratio;
};

/*获取页面rem*/
upload.drawing.rem = function(){
    var boundWidth = document.documentElement.getBoundingClientRect().width;
    var rem = boundWidth/6.4>100?100:(boundWidth/6.4<50?50:boundWidth/6.4);    
    return rem;
};