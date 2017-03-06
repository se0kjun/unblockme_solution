
function init() {
	var envCanvas = document.getElementById('environment');
	var blockCanvas = document.getElementById('block');
	var movingBlockCanvas = document.getElementById('moving_block');
	// var glowCanvas = document.getElementById('glow');

	var eCtx = envCanvas.getContext('2d');
	var bCtx = blockCanvas.getContext('2d');
	var mvCtx = movingBlockCanvas.getContext('2d');
	// var gCtx = glowCanvas.getContext('2d');

	var speed = 2;
	var mouse_down_pos;
	var mouse_up_pos;
	var mouse_move_pos;
	var mouse_move_prev_pos;

	var mouse_up_flag = false;
	var mouse_down_flag = false;
	var mouse_drag_flag = false;
	var mouse_x = 0;
	var mouse_y = 0;

	imageLoader = new function() {
		this.backgroundSprite = new Image();
		this.blockSprite = new Image();
		this.objectblockSprite = new Image();
		this.blockSprite1 = new Image();
		this.blockSprite2 = new Image();
		this.blockSprite3 = new Image();
		this.blockSprite4 = new Image();

		this.backgroundSprite.src = "./res/background.png";
		this.objectblockSprite.src = "./res/gold_object_block.png";
		this.blockSprite1.src = "./res/horizon_200.png";
		this.blockSprite2.src = "./res/horizon_300.png";
		this.blockSprite3.src = "./res/vertical_200.png";
		this.blockSprite4.src = "./res/vertical_300.png";


		this.backgroundSprite.onload = function() {
			hud.draw();
		}
		this.blockSprite.onload = function() {
		}
		this.objectblockSprite.onload = function() {
			block_manager.start();
		}
	}

	hud = new function() {
		this.draw = function() {
			eCtx.drawImage(imageLoader.backgroundSprite, 0, 0, envCanvas.width, envCanvas.height);
		}

		this.resize = function() {
		}

		this.clear = function() {
			eCtx.clearRect(0, 0, envCanvas.width, envCanvas.height);
		}
	}

	block_manager = new function() {
		this.block_grid = [];
		this.block_list = [];
		this.edit_block;
		this.block_edit_flag;

		this.start = function() {
			this.block_grid = [
				[{state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}],
				[{state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}],
				[{state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}],
				[{state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}],
				[{state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}],
				[{state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}, {state:0, block_idx:-1}],
			];
		}

		this.draw = function() {
			this.block_list.forEach(function(elem, idx) {
				elem.draw(bCtx);
			});
			block_edit_manager.clear();
			
			if(this.block_edit_flag) {
				block_edit_manager.move(this.block_grid, this.edit_block);
			}
		}

		this.clear = function() {
			bCtx.clearRect(0, 0, blockCanvas.width, blockCanvas.height);
		}

		this.resize = function() {
		}

		this.edit = function(block_code, block_type, size) {
			var b = new block(block_code, block_type, size);
			this.edit_block = b;
			this.block_edit_flag = true;
		}

		this.addblock = function() {
			var block_idx = this.block_list.push(this.edit_block) - 1;
			for (var i = 0; i < (this.edit_block.local_size.width * this.edit_block.local_size.height / 10000); i++) {
				if(this.edit_block.bl_type == BLOCK_TYPE.VERTICAL) {
					this.block_grid[Math.floor(this.edit_block.y / 100) + i][Math.floor(this.edit_block.x / 100)].state = 1;
					this.block_grid[Math.floor(this.edit_block.y / 100) + i][Math.floor(this.edit_block.x / 100)].block_idx = block_idx;
				}
				else {
					this.block_grid[Math.floor(this.edit_block.y / 100)][Math.floor(this.edit_block.x / 100) + i].state = 1;
					this.block_grid[Math.floor(this.edit_block.y / 100)][Math.floor(this.edit_block.x / 100) + i].block_idx = block_idx;
				}
			}
		}

		this.solution = function() {
			//get data using ajax
			// var data = "[{'idx': 1,'move_x': 100,'move_y': 100,'direction': 0}]";
			// JSON.parse(data);
			var data = [
				{
					'idx': 0,
					'move_x': 100,
					'move_y': 200,
					'direction': 0,
				},
				{
					'idx': 1,
					'move_x': 400,
					'move_y': 100,
					'direction': 2,
				},
			];
			var local_idx = 0;
			var self = this;
			var timer = setInterval(function() {
				var elem = data[local_idx];
				var move_block = self.block_list[elem.idx];
				if(move_block.x != elem.move_x || move_block.y != elem.move_y) {
					if(elem.direction == DIRECTION.UP)
						move_block.y -= (speed * 1);
					else if(elem.direction == DIRECTION.DOWN)
						move_block.y += (speed * 1);
					else if(elem.direction == DIRECTION.LEFT)
						move_block.x -= (speed * 1);
					else if(elem.direction == DIRECTION.RIGHT)
						move_block.x += (speed * 1);
				} else {
					// console.log(elem.idx);
					// console.log(move_block);
					local_idx++;
					// self.block_grid.forEach(function(e, idx) {
					// 	if(e.block_idx == elem.idx) {
					// 		self.block_grid[idx].state = 0;
					// 		self.block_grid[idx].block_idx = -1;
					// 	}
					// });
					self.blockgrid_update(move_block, elem.idx);
					if(local_idx == data.length)
						clearInterval(timer);
				}
				block_manager.clear();
			}, 10);
		}

		this.blockgrid_update = function(b, block_idx) {
			console.log(block_idx);
			this.block_grid.forEach(function(elem, idx){
				elem.forEach(function(grid, idx){
					if(grid.block_idx == block_idx) {
						grid.block_idx = -1;
						grid.state = 0;
					}
				});
			});
			for (var i = 0; i < (b.local_size.width * b.local_size.height / 10000); i++) {
				if(b.bl_type == BLOCK_TYPE.VERTICAL) {
					this.block_grid[Math.floor(b.y / 100) + i][Math.floor(b.x / 100)].state = 1;
					this.block_grid[Math.floor(b.y / 100) + i][Math.floor(b.x / 100)].block_idx = block_idx;
				}
				else {
					this.block_grid[Math.floor(b.y / 100)][Math.floor(b.x / 100) + i].state = 1;
					this.block_grid[Math.floor(b.y / 100)][Math.floor(b.x / 100) + i].block_idx = block_idx;
				}
			}
		}

	}

	block_edit_manager = new function() {
		this.edit_block_pos;

		this.draw = function() {
			mvCtx.beginPath();
			mvCtx.moveTo(100, 0);
			mvCtx.lineTo(100, 600);
			mvCtx.moveTo(200, 0);
			mvCtx.lineTo(200, 600);
			mvCtx.moveTo(300, 0);
			mvCtx.lineTo(300, 600);
			mvCtx.moveTo(400, 0);
			mvCtx.lineTo(400, 600);
			mvCtx.moveTo(500, 0);
			mvCtx.lineTo(500, 600);
			mvCtx.moveTo(0, 100);
			mvCtx.lineTo(600, 100);
			mvCtx.moveTo(0, 200);
			mvCtx.lineTo(600, 200);
			mvCtx.moveTo(0, 300);
			mvCtx.lineTo(600, 300);
			mvCtx.moveTo(0, 400);
			mvCtx.lineTo(600, 400);
			mvCtx.moveTo(0, 500);
			mvCtx.lineTo(600, 500);
			mvCtx.lineWidth = 5;
			// mvCtx.shadowColor = '#00ff00';
			// mvCtx.shadowBlur = 40;
			mvCtx.strokeStyle = '#ffffff';
			// mvCtx.shadowOffsetX = 0;
			// mvCtx.shadowOffsetY = 0;
			mvCtx.stroke();

			mvCtx.beginPath();
			mvCtx.moveTo(this.edit_block_pos.x, this.edit_block_pos.y);
			mvCtx.lineTo(this.edit_block_pos.x + this.edit_block_pos.size.width, this.edit_block_pos.y);
			mvCtx.lineTo(this.edit_block_pos.x + this.edit_block_pos.size.width, this.edit_block_pos.y + this.edit_block_pos.size.height);
			mvCtx.lineTo(this.edit_block_pos.x, this.edit_block_pos.y + this.edit_block_pos.size.height);
			mvCtx.lineTo(this.edit_block_pos.x, this.edit_block_pos.y);
			mvCtx.lineWidth = 10;
			if(block_manager.edit_block.validate()) {
				mvCtx.shadowColor = '#00ff00';
				mvCtx.strokeStyle='#00ff00';
			} else {
				mvCtx.shadowColor = '#ff0000';
				mvCtx.strokeStyle='#ff0000';
			}
			mvCtx.shadowBlur = 10;
			
			mvCtx.stroke();
		}
		
		this.move = function(block_grid, block) {
			if(mouse_move_pos !== undefined) {
				this.clear();
				if(block.local_size.width * block.local_size.height == 20000) {
					if(block.bl_type == BLOCK_TYPE.HORIZONTAL) {
						this.edit_block_pos = {
							x: (Math.round(mouse_move_pos.x / 100) * 100) - 100,
							y: Math.floor(mouse_move_pos.y / 100) * 100,
							size: block.local_size
						};
					} else {
						this.edit_block_pos = {
							x: Math.floor(mouse_move_pos.x / 100) * 100,
							y: (Math.round(mouse_move_pos.y / 100) * 100) - 100,
							size: block.local_size
						};
					}
				} else if(block.local_size.width * block.local_size.height == 30000) {
					if(block.bl_type == BLOCK_TYPE.HORIZONTAL) {
						this.edit_block_pos = {
							x: (Math.floor(mouse_move_pos.x / 100) * 100) - 100,
							y: Math.floor(mouse_move_pos.y / 100) * 100,
							size: block.local_size
						};
					} else {
						this.edit_block_pos = {
							x: Math.floor(mouse_move_pos.x / 100) * 100,
							y: (Math.floor(mouse_move_pos.y / 100) * 100) - 100,
							size: block.local_size
						};
					}
				}
				// if(this.edit_block_pos.x < 0 || this.edit_block_pos.y < 0 || this.edit_block_pos.x > )
				block_manager.edit_block.x = this.edit_block_pos.x;
				block_manager.edit_block.y = this.edit_block_pos.y;
			}
			this.draw();
		}
		
		this.clear = function() {
			mvCtx.clearRect(0, 0, movingBlockCanvas.width, movingBlockCanvas.height);
		}
		
		this.resize = function() {
		}
	}

	var block = function(block_code, block_type, size) {
		this.initial_pos = {x:0, y:0};
		this.x = 0;
		this.y = 0;
		this.bl_type = block_type;
		this.bl_code = block_code;
		this.local_size = size; //[width, height]
		this.center_x = this.x + (size.width / 2);
		this.center_y = this.y + (size.height / 2);
	};

	block.prototype = {
		move: function(move_x, move_y, direction){
			while(this.x != move_x && this.y != move_y) {
				if(direction == DIRECTION.UP)
					this.y += (speed * 1);
				else if(direction == DIRECTION.DOWN)
					this.y -= (speed * 1);
				else if(direction == DIRECTION.LEFT)
					this.x -= (speed * 1);
				else if(direction == DIRECTION.RIGHT)
					this.x += (speed * 1);
				block_manager.draw();
			}
		},

		draw: function(context){
			if(this.bl_code == BLOCK_CODES.OBJECTIVE) {
				context.drawImage(imageLoader.objectblockSprite, this.x, this.y, this.local_size.width, this.local_size.height);
			} else if(this.bl_code == BLOCK_CODES.NORMAL) {
				if(this.local_size.width == 200 || this.local_size.height == 200) {
					if(this.bl_type == BLOCK_TYPE.VERTICAL)
						context.drawImage(imageLoader.blockSprite3, this.x, this.y, this.local_size.width, this.local_size.height);		
					else
						context.drawImage(imageLoader.blockSprite1, this.x, this.y, this.local_size.width, this.local_size.height);
				} else {
					if(this.bl_type == BLOCK_TYPE.VERTICAL)
						context.drawImage(imageLoader.blockSprite4, this.x, this.y, this.local_size.width, this.local_size.height);
					else
						context.drawImage(imageLoader.blockSprite2, this.x, this.y, this.local_size.width, this.local_size.height);
				}
					
			}
		},

		validate: function() {
			for (var i = 0; i < (this.local_size.width * this.local_size.height / 10000); i++) {
				if(this.bl_type == BLOCK_TYPE.VERTICAL) {
					if(block_manager.block_grid[Math.floor(this.y / 100) + i][Math.floor(this.x / 100)].state & 1) {
						return false;
					}
				} else if(this.bl_type == BLOCK_TYPE.HORIZONTAL) {
					if(block_manager.block_grid[Math.floor(this.y / 100)][Math.floor(this.x / 100) + i].state & 1) {
						return false;
					}
				}
			}

			return true;
		},
	};

	DIRECTION = {
		UP: 0,
		DOWN: 1,
		RIGHT: 2,
		LEFT: 3,
	}

	BLOCK_CODES = {
		NORMAL: 0,
		OBJECTIVE: 1,
		NONE: 2,
	}

	BLOCK_TYPE = {
		VERTICAL: 0,
		HORIZONTAL: 1,
		NONE: 2,
	}

	function animate() {
		requestAnimFrame(animate);
		block_manager.draw();
	}

	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame   || 
		    window.webkitRequestAnimationFrame || 
		    window.mozRequestAnimationFrame    || 
		    window.oRequestAnimationFrame      || 
		    window.msRequestAnimationFrame     || 
		    function(callback, element){
		    	window.setTimeout(callback, 1000 / 60);
		    };
	})();

	$('#moving_block').mousedown(function(e) {
		if(block_manager.block_edit_flag && block_manager.edit_block.validate()) {
			$('#moving_block').css({
				'background-color': '#CCC',
				'opacity': 0,
			});

			block_manager.addblock();
			block_manager.block_edit_flag = false;

			mouse_down_pos = {
				x: e.pageX - ($('#moving_block').offset().left - window.pageXOffset),
				y: e.pageY - ($('#moving_block').offset().top - window.pageYOffset),
			};
			mouse_down_flag = true;
		}
	});

	$('#moving_block').mousemove(function(event) {
		mouse_move_pos = {
			x: event.pageX - ($('#moving_block').offset().left - window.pageXOffset),
			y: event.pageY - ($('#moving_block').offset().top - window.pageYOffset),
		};
	});

	// $('#moving_block').mouseleave(function() {
	// 	block_manager.block_edit_flag = false;
	// });

	$('#object_block').click(function() {
		$('#moving_block').css({
			'background-color': '#DCDCDC',
			'opacity': 0.4,
		});
		block_manager.edit(BLOCK_CODES.OBJECTIVE, BLOCK_TYPE.HORIZONTAL, {width:200, height:100});
	})

	$('.big_block').click(function() {
		$('#moving_block').css({
			'background-color': '#DCDCDC',
			'opacity': 0.4,
		});
		if($(this).attr('value') == 'big_horizontal') {
			block_manager.edit(BLOCK_CODES.NORMAL, BLOCK_TYPE.HORIZONTAL, {width:300, height:100});
		} else if($(this).attr('value') == 'big_vertical') {
			block_manager.edit(BLOCK_CODES.NORMAL, BLOCK_TYPE.VERTICAL, {width:100, height:300});
		}
	});

	$('.small_block').click(function() {
		$('#moving_block').css({
			'background-color': '#DCDCDC',
			'opacity': 0.4,
		});
		if($(this).attr('value') == 'small_horizontal') {
			block_manager.edit(BLOCK_CODES.NORMAL, BLOCK_TYPE.HORIZONTAL, {width:200, height:100});
		} else if($(this).attr('value') == 'small_vertical') {
			block_manager.edit(BLOCK_CODES.NORMAL, BLOCK_TYPE.VERTICAL, {width:100, height:200});
		}
	});

	$('#solution').click(function() {
		block_manager.solution();
	});
	animate();
}

document.addEventListener("DOMContentLoaded", init);