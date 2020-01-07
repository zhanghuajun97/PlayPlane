var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
 *
 * @author
 *
 */
var Blueplane = (function (_super) {
    __extends(Blueplane, _super);
    function Blueplane() {
        return _super.call(this) || this;
    }
    /**
     * 创建主角
     */
    Blueplane.prototype.init = function (s) {
        var plane = new Plane();
        var planeImage = new egret.Bitmap(RES.getRes("BluePlane_png"));
        plane.blood = 100;
        plane.bulletImage = "bullet_03_png";
        plane.Image = planeImage;
        plane.Type = "UP";
        plane.lives = 0;
        var sound = RES.getRes("bullet_mp3");
        plane.bulletSound = sound;
        this.BottomCenter(plane, s);
        planeImage.touchEnabled = true;
        s.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.PlaneMoveHandle, [plane, s]);
        s.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.PlaneMoveHandle, [plane, s]);
        return plane;
    };
    /**
     * 飞机移动处理
     */
    Blueplane.prototype.PlaneMoveHandle = function (e) {
        var plane = this[0];
        if (plane.Image == null)
            return;
        var parent = this[1];
        var hight = plane.Image.height;
        var wight = plane.Image.width;
        plane.Image.x = e.stageX - (wight / 2);
        plane.Image.y = e.stageY - (hight / 2);
        if (plane.Image.x <= 0) {
            plane.Image.x = 0;
        }
        if (e.stageX + wight / 2 >= parent.stage.stageWidth) {
            plane.Image.x = parent.stage.stageWidth - wight;
        }
        if (plane.Image.y <= 0) {
            plane.Image.y = 0;
        }
        if (e.stageY + hight / 2 >= parent.stage.stageHeight) {
            plane.Image.y = parent.stage.stageHeight - hight;
        }
        plane.X = plane.Image.x;
        plane.Y = plane.Image.y;
    };
    /**
     * 初始默认底部居中位子
     */
    Blueplane.prototype.BottomCenter = function (bit, s) {
        var mapHight = s.stage.stageWidth;
        var mapwight = s.stage.stageHeight;
        var hight = bit.Image.height;
        var wight = bit.Image.width;
        bit.X = (mapHight / 2) - (bit.Image.width / 2);
        bit.Y = mapwight - bit.Image.height;
        bit.Image.x = (mapHight / 2) - (bit.Image.width / 2);
        bit.Image.y = mapwight - bit.Image.height;
    };
    return Blueplane;
}(egret.DisplayObjectContainer));
__reflect(Blueplane.prototype, "Blueplane");
