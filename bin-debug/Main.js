//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
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
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.listResources = new Array(new Resources("Plane", "飞机模型"), new Resources("Bullet", "子弹模型"), new Resources("Bgm", "背景音乐"));
        /**触发主角开枪时间的间隔*/
        _this.planeShootTime = new egret.Timer(500);
        /**触发创建敌机的间隔*/
        _this.enemyFightersTimer = new egret.Timer(500);
        /**触发敌人开枪时间的间隔*/
        _this.enemyShootTime = new egret.Timer(1000);
        /**敌人的飞机*/
        _this.enemyFighterslist = [];
        /*子弹集合*/
        _this.Bulletlist = [];
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        _this._lastTime = egret.getTimer();
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载Plane资源组。
     * configuration file loading is completed, start to pre-load the Plane resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        for (var item in this.listResources) {
            var list = this.listResources[item];
            var resources = list;
            RES.loadGroup(resources.name);
        }
    };
    /**
     * Plane资源组加载完成
     * Preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        var isOver = false;
        for (var item in this.listResources) {
            var list = this.listResources[item];
            var resources = list;
            if (event.groupName == resources.name) {
                resources.isOver = true;
            }
            isOver = resources.isOver;
        }
        if (isOver) {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            //背景
            this.bg = new BgMap(); //创建可滚动的背景
            this.addChild(this.bg);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * Plane资源组加载进度
     * Loading process of Plane resource group
     */
    Main.prototype.onResourceProgress = function (event) {
        for (var item in this.listResources) {
            var list = this.listResources[item];
            var resources = list;
            if (event.groupName == resources.name) {
                this.loadingView.setCustomProgress(event.itemsLoaded, event.itemsTotal, resources.chinese);
            }
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        this.start();
    };
    //游戏结束
    Main.prototype.GameOver = function () {
        var over = RES.getRes("game_over_mp3");
        over.play(0, 1);
        this._channel.stop();
        this._channel = null;
        this.planeShootTime.stop();
        this.enemyFightersTimer.stop();
        this.enemyShootTime.stop();
        /**触发主角开枪时间的间隔*/
        this.planeShootTime = null;
        /**触发创建敌机的间隔*/
        this.enemyFightersTimer = null;
        /**触发敌人开枪时间的间隔*/
        this.enemyShootTime = null;
        for (var item in this.enemyFighterslist) {
            this.removeChild(this.enemyFighterslist[item].Image);
        }
        this.enemyFighterslist = [];
        for (var item in this.Bulletlist) {
            this.removeChild(this.Bulletlist[item].Image);
        }
        this.Bulletlist = [];
        this.bg.pause();
        var lives = this.myfighter.lives;
        this.removeChild(this.myfighter.Image);
        this.myfighter.Image = null;
        this.myfighter.lives = 0;
        var overbg = new egret.Bitmap(RES.getRes("gameover_png"));
        var backButton = new egret.Bitmap(RES.getRes("btn_finish_png"));
        var label = new egret.TextField();
        label.text = lives + "分";
        label.x = this.stage.stageWidth / 2 - label.width / 2;
        label.y = this.stage.stageHeight / 2;
        backButton.x = this.stage.stageWidth / 2 - backButton.width / 2;
        backButton.y = (this.stage.stageHeight / 2) + 80;
        var mapthis = this;
        backButton.touchEnabled = true;
        backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            mapthis._lastTime = 0;
            mapthis.removeChild(overbg);
            mapthis.removeChild(label);
            mapthis.removeChild(backButton);
            mapthis.start.apply(mapthis);
        }, this);
        this.addChild(overbg);
        this.addChild(label);
        this.addChild(backButton);
    };
    //开始游戏
    Main.prototype.start = function () {
        this.bg.start();
        this.sound = RES.getRes("game_music_mp3");
        this._channel = this.sound.play(0, -1);
        /**触发主角开枪时间的间隔*/
        this.planeShootTime = new egret.Timer(500);
        /**触发创建敌机的间隔*/
        this.enemyFightersTimer = new egret.Timer(500);
        /**触发敌人开枪时间的间隔*/
        this.enemyShootTime = new egret.Timer(2000);
        //初始化主角
        var buleplane = new Blueplane();
        var plane = buleplane.init(this);
        this.addChild(plane.Image);
        this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
        this.myfighter = plane;
        //主角添加事件
        this.planeShootTime.addEventListener(egret.TimerEvent.TIMER, this.AddMyPlane, [this, plane]);
        this.planeShootTime.start();
        //敌人开火事件
        this.enemyShootTime.addEventListener(egret.TimerEvent.TIMER, this.enemyShootTimefun, this);
        this.enemyShootTime.start();
        //敌人添加事件
        this.enemyFightersTimer.addEventListener(egret.TimerEvent.TIMER, this.enemyFightersTimerfun, this);
        this.enemyFightersTimer.start();
    };
    //添加主角事件
    Main.prototype.AddMyPlane = function () {
        var bullet = this[1].Shoot();
        this[0].Bulletlist.push(bullet);
        this[0].addChild(bullet.Image);
        bullet.bulletSound.play(0, 1);
    };
    //敌军子弹
    Main.prototype.enemyShootTimefun = function () {
        var i = 0;
        var theFighter;
        var enemyFighterCount = this.enemyFighterslist.length;
        for (i = 0; i < enemyFighterCount; i++) {
            theFighter = this.enemyFighterslist[i];
            var bullet = theFighter.Shoot();
            this.Bulletlist.push(bullet);
            this.addChild(bullet.Image);
        }
    };
    //加入敌军
    Main.prototype.enemyFightersTimerfun = function () {
        //加入敌军
        var enemyplaneClass = new Enemyplane();
        var x = Math.random() * (this.stage.width - 128); //随机坐标
        var enemyplane = enemyplaneClass.init(x, -128);
        this.enemyFighterslist.push(enemyplane);
        this.addChild(enemyplane.Image);
        var bullet = enemyplane.Shoot();
        this.Bulletlist.push(bullet);
        this.addChild(bullet.Image);
    };
    /*飞机碰撞检测*/
    Main.prototype.collision = function () {
        var bullet = this.Bulletlist;
        var drplane = this.enemyFighterslist;
        var myplan = this.myfighter;
        for (var i in bullet) {
            if (bullet[i].Plane.Image != myplan.Image) {
                if (myplan.Image != null) {
                    var isHit = myplan.Image.hitTestPoint(bullet[i].X, bullet[i].Y - 40, true);
                    if (isHit) {
                        this.removeChild(bullet[i].Image);
                        bullet.splice(bullet.indexOf(bullet[i]), 1);
                        this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
                        this.GameOver.apply(this);
                        return;
                    }
                }
            }
            else {
                for (var l in drplane) {
                    if (this.myfighter != null) {
                        var myHit = drplane[l].Image.hitTestPoint(this.myfighter.X, this.myfighter.Y, true);
                        if (myHit) {
                            this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
                            this.GameOver.apply(this);
                            return;
                        }
                    }
                    var isHit = drplane[l].Image.hitTestPoint(bullet[i].X, bullet[i].Y, true);
                    if (isHit) {
                        this.removeChild(bullet[i].Image);
                        bullet.splice(bullet.indexOf(bullet[i]), 1);
                        this.removeChild(drplane[l].Image);
                        drplane.splice(drplane.indexOf(drplane[l]), 1);
                        this.myfighter.lives += 1;
                    }
                }
            }
        }
    };
    /**游戏画面更新*/
    Main.prototype.gameViewUpdate = function (evt) {
        //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
        var nowTime = egret.getTimer();
        var fps = 1000 / (nowTime - (this._lastTime));
        this._lastTime = nowTime;
        var speedOffset = 60 / fps;
        /**
         * 统一子弹管理
         */
        var i = 0;
        var bullet;
        var BulletsCount = this.Bulletlist.length;
        for (; i < BulletsCount; i++) {
            bullet = this.Bulletlist[i];
            if (bullet.Type == "UP") {
                if (bullet.Y < 0) {
                    this.removeChild(bullet.Image);
                    this.Bulletlist.splice(i, 1);
                    i--;
                    BulletsCount--;
                }
                bullet.Y -= 7 * speedOffset;
                bullet.Image.y -= 7 * speedOffset;
            }
            else if (bullet.Type == "Donw") {
                if (bullet.Y - bullet.Image.height > this.stage.stageHeight) {
                    this.removeChild(bullet.Image);
                    this.Bulletlist.splice(i, 1);
                    i--;
                    BulletsCount--;
                }
                bullet.Y += 7 * speedOffset;
                bullet.Image.y += 7 * speedOffset;
            }
        }
        //敌人飞机运动
        var theFighter;
        var enemyFighterCount = this.enemyFighterslist.length;
        for (i = 0; i < enemyFighterCount; i++) {
            theFighter = this.enemyFighterslist[i];
            if (theFighter.Y - theFighter.Image.height > this.stage.stageHeight) {
                this.removeChild(theFighter.Image);
                this.enemyFighterslist.splice(i, 1);
                i--;
                enemyFighterCount--;
            }
            theFighter.Y += 4 * speedOffset;
            theFighter.Image.y += 4 * speedOffset;
        }
        this.collision();
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
