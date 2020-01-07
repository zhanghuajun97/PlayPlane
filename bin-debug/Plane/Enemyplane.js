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
var Enemyplane = (function (_super) {
    __extends(Enemyplane, _super);
    function Enemyplane() {
        return _super.call(this) || this;
    }
    /**
    * 创建敌军
    */
    Enemyplane.prototype.init = function (x, y) {
        var enmyplanlist = ["GodPlane_png", "GreenPlane_png", "JitPlane_png", "JpPlane_png", "LiPlane_png", "LXPlane_png"];
        var planeIndex = Math.floor(Math.random() * enmyplanlist.length);
        var plane = new Plane();
        var planeImage = new egret.Bitmap(RES.getRes(enmyplanlist[planeIndex]));
        plane.blood = 100;
        plane.bulletImage = "bullet_02_png";
        plane.Image = planeImage;
        plane.Image.rotation = 180;
        plane.Image.x = x + 128;
        plane.Image.y = y + 128;
        plane.X = plane.Image.x;
        plane.Y = plane.Image.y;
        plane.Type = "Donw";
        plane.lives = 3;
        return plane;
    };
    return Enemyplane;
}(egret.DisplayObjectContainer));
__reflect(Enemyplane.prototype, "Enemyplane");
