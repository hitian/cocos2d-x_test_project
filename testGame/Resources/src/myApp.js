/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var MyLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    ctor:function() {
        this._super();
        cc.associateWithNative( this, cc.Layer );
    },

    init:function () {

        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();
        this.size = size
        this.setTouchEnabled(true);

        var bg = cc.Sprite.create('res/dong_dongwu_144966_10.jpg');
        var bgSize = bg.getContentSize();
        bg.setScale(size.height / bgSize.height);
        bg.setAnchorPoint(cc.p(0, 0));
        bg.setPosition(cc.p(0,0));
        this.addChild(bg, -1);

        var maskWidth = size.width * 0.8;
        var maskHeight = size.height * 0.8;

        // var layer = cc.LayerColor.create(cc.c4b(255, 0, 0, 128), maskWidth, maskHeight);
        // // this.sprite = cc.Sprite.create("res/HelloWorld.png");
        // layer.setAnchorPoint(cc.p(0.5, 0.5));
        // layer.setPosition(cc.p(size.width * 0.5, size.height * 0.5));

        //
        //this.addChild(layer, 0);

        var target = cc.RenderTexture.create(maskWidth, maskHeight);
        target.setPosition(cc.p(size.width / 2, size.height / 2));
        target.setPosition(cc.p(maskWidth / 2,maskHeight / 2));
        //this.addChild(target, 1);

        this._target = target;

        this._lastLocation = cc.p(size.width / 2, size.height / 2);

        this._brush = cc.Sprite.create('res/Untitled.png');
        this._brush.retain();

        this.updateMask();


        //this._brush.setColor(cc.red());
        //this._brush.setOpacity(20);


        return true;
    },

    drawInLocation:function (location) {
        cc.log("draw: " + JSON.stringify(location));
        var distance = cc.pDistance(location, this._lastLocation);

        if (distance > 1) {
            var locBrush = this._brush, locLastLocation = this._lastLocation;
            this._target.begin();
            var pos = this._target.getPosition();
            for (var i = 0; i < distance; i++) {
                var diffX = locLastLocation.x - location.x;
                var diffY = locLastLocation.y - location.y;

                var delta = i / distance;

                locBrush.setPosition(location.x + diffX * delta - pos.x + this.size.width * 0.4, location.y + diffY * delta - pos.y + this.size.height * 0.4);
                // locBrush.setRotation(Math.random() * 360);
                locBrush.setScale(3);
                // locBrush.setColor(cc.c3b(Math.random() * 255, 255, 255));
                locBrush.visit();
            }
            this._target.end();
            //this.updateMask();
            //this._clip.cisit();
        }
        this._lastLocation = location;
        this.getPercentageTransparent();
    },

    getPercentageTransparent : function() {
        var size = this._clip.getContentSize();
        cc.log("test : contentSizeInPixels:" + JSON.stringify(size));
    },

    updateMask : function() {
        var clip = cc.ClippingNode.create(this._target);
        //clip.addChild(cc.LayerColor.create(cc.c4f(0,0,0,255), this.size.width * 0.8, this.size.height * 0.8));
        var cover = cc.Sprite.create('res/mask.png');
        cover.setPosition(this.size.width / 2, this.size.height / 2);
        cover.setScale(3);
        clip.addChild(cover);
        clip.setInverted(true);
        clip.setAlphaThreshold(0);
        clip.setAnchorPoint(cc.p(0,0));
        clip.setPosition(cc.p(0,0));
        this.addChild(clip, 10, 1001);
        this._clip = clip;
    },

    onTouchesBegan:function (touches, event) {
        this._lastLocation = touches[0].getLocation();
        return true;
    },

    onTouchesMoved:function (touches, event) {
        this.drawInLocation(touches[0].getLocation());
        return true;
    }

});

var MyScene = cc.Scene.extend({
    ctor:function() {
        this._super();
        cc.associateWithNative( this, cc.Scene );
    },

    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});
