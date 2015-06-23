+function(win, doc, undefined){
	// Define common utils

	var byId = function(id){
		return typeof id === 'object' ? id : doc.getElementById(id);
	};

	var byTag = function (){

	};

	var css = function (obj, attr, val){
		if (arguments.length == 2) {
			return parseFloat(obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, null)[attr]);
		} else {
			switch (attr){
				case 'width':
				case 'height':
				case 'padding-left':
				case 'padding-right':
				case 'padding-bottom':
				case 'padding-top':
					val = Math.max(val, 0);
				case 'left':
				case 'top':
				case 'margin-left':
				case 'margin-right':
				case 'margin-top':
				case 'margin-bottom':
					obj.style[attr] = val + 'px';
					break;
				case 'opacity':
					obj.style.opacity = val;
					obj.style.filter = 'alpha(opacity:'+(val*100)+')';
					break;
				default : 
					obj.style[attr] = val;
			}

			return function (attr_in, attr_val){css(obj, attr_in, attr_val);};
		}
	}
	var create = function (tag, sClass){
		var el = doc.createElement(tag);
		if(sClass) el.className = sClass;
		return doc.body.appendChild(el);
	};


	var extend = function(dest, src){
		for (var i in src) {
			
		}
		return dest;
	};

	var forEach = function (elems, fn){
		for (var i=0, el; el = elems[i]; i++){
			fn.call(el, i, el);
		}
	}

	var log = function (k, v){
		window.console && window.console.log && ( v ? console.log(k, v) : console.log(k));
	};

	// 添加形状
	var getSupportedShapes = function (){
		var s = '';
			s += '0,0,0,1,0,2,0,3';

		return s.split(';');
	};


	function GameCenter (opt){
		this.board = byId(opt.id);
		this.players = [];
		this.shapes = getSupportedShapes();
	};

	GameCenter.prototype = {
		addPlayer : function (player){
			this.players.push(player);
			player.judger = this;
			return this;
		},
		start : function (){
			log('starting');
			var _ = this;
			//log(_.players);
			forEach(_.players, function(i, player){
				//log(player);
				player.init();
			});
			_.bindEvents();
		},
		bindEvents : function (){

		},
		stop : function (){
			log('stopping');
		},
		message : function (msg){
			alert(msg);
		},
		quit : function (info){
			if(confirm(info)){
				win.close();
			}
		}
	};

	function randShapes (el, els){
		var shapes = getSupportedShapes();
		var shape = shapes[0];
		var shapeArray = shape.split(',');
		el.shape = shapeArray;
		forEach(els, function (i, el){
			//log(2*i, 2*i+1);
			el.row = +shapeArray[2*i];
			el.col = +shapeArray[2*i+1];
		});
		return els;
	}

	function Tetrix (opt){
		this.offset = {l : 0, t : 0};
		this.w = opt.w || 20;
		this.h = opt.h || 20;
		this.x = opt.x || 3;
		this.y = opt.y || 3;
		this.board = byId(opt.board);
	}

	Tetrix.prototype  = {
		init : function (){
			var _ = this;
			_.divs = [create('div', 'block ca'), create('div', 'block ca'), create('div', 'block ca'), create('div', 'block ca')];
			_.divs = randShapes(_, _.divs);
			forEach(_.divs, function (i, div){
				(_.board).appendChild(div);
				var l = (_.offset.l + _.x + div.col) * _.w;
				var t = (_.offset.t + _.y + div.row) * _.h;
				css(div, 'left', l);
				css(div, 'top', t);
			});

			_.bindEvents();
		},
		bindEvents : function(){
			var _ = this;
			document.onkeydown = function(e){
				var e = e || window.event;
				switch(e.keyCode) {
					case 37:
						_.moveH(-1);
						break;
					case 38:
						_.rotate();
						break;
					case 39:
						_.moveH(1);
						break;
					case 40:
						_.moveD();
						break;
				}
			};
		},
		rotate : function (){
			// 旋转算法
			var _ = this;
			var shapeArray = _.shape;
			var els = _.divs;
			for (var i=0;i<4;i++) {
				var t = shapeArray[2*i];
				shapeArray[2*i] = shapeArray[2*i+1];
				shapeArray[2*i+1] = 3 - t;
			}
			forEach(els, function (i, el){
				el.row = +shapeArray[2*i];
				el.col = +shapeArray[2*i+1];
			});
			_.refresh();
		},
		moveH : function(step){
			var _ = this;
			_.offset.l += step;
			_.refresh();
		},
		moveD : function (){
			var _ = this;
			_.offset.t += 1;
			_.refresh();
		},
		refresh : function (){
			var _ = this;
			forEach(_.divs, function(i, div){
				var l = (_.offset.l + _.x + div.col) * _.w;
				var t = (_.offset.t + _.y + div.row) * _.h;
				
				css(div, 'left', l);
				css(div, 'top', t);
			});
		}
	};

	win.GameCenter = GameCenter;
	win.Tetrix = Tetrix;

}(window, document);