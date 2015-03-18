
// DEBUG
THREE.ImageUtils.crossOrigin = '';

////////////////////////////////////////////////////////////////////////
// Custom geometries
////////////////////////////////////////////////////////////////////////

function bevel_box(width, height, depth, bevel) {
	var w = 0.5 * width;
	var h = 0.5 * height;
	var d = 0.5 * depth;
	var b = bevel;
	
	var geometry = new THREE.Geometry();

	var i, j, k;

	for (i = -1; i <= 1; i += 2)
		for (j = -1; j <= 1; j += 2)
			for (k = -1; k <= 1; k += 2)
				geometry.vertices.push(
					new THREE.Vector3(i * w, j * (h - b), k * (d - b)),
					new THREE.Vector3(i * (w - b), j * h, k * (d - b)),
					new THREE.Vector3(i * (w - b), j * (h - b), k * d)
				);
				
	function index(i, j, k) {
		return (((i+1) * 2 + j+1) + (k+1) / 2) * 3;
	}
	
	var i0, i1, i2, i3, m;
	
	var uv0 = new THREE.Vector2(0, 0);
	var uv1 = new THREE.Vector2(1, 0);
	var uv2 = new THREE.Vector2(0, 1);
	var uv3 = new THREE.Vector2(1, 1);
	
	for (i = -1; i <= 1; i += 2) {
		for (j = -1; j <= 1; j += 2) {
			for (k = -1; k <= 1; k += 2) {
				// Corner
				i0 = index(i, j, k);
				m = (((i + j + k + 3) / 2) + 1) % 2;
				
				geometry.faces.push(
					new THREE.Face3(i0, i0 + 1 + m, i0 + 2 - m)
				);
				geometry.faceVertexUvs[0].push([uv0, uv1, uv2]);
			}
			
			// Edges
			m = (((i + j + k + 3) / 2) % 2) * 2 - 1;
				
			i0 = index(i, j, 1 * m);
			i1 = index(i, j, -1 * m);
			geometry.faces.push(
				new THREE.Face3(i0 + 0, i0 + 1, i1 + 0),
				new THREE.Face3(i0 + 1, i1 + 1, i1 + 0)
			);
			geometry.faceVertexUvs[0].push([uv0, uv1, uv2], [uv1, uv3, uv2]);
			
			i0 = index(i, -1 * m, j);
			i1 = index(i, 1 * m, j);
			geometry.faces.push(
				new THREE.Face3(i0 + 0, i0 + 2, i1 + 0),
				new THREE.Face3(i0 + 2, i1 + 2, i1 + 0)
			);
			geometry.faceVertexUvs[0].push([uv0, uv1, uv2], [uv1, uv3, uv2]);
			
			i0 = index(1 * m, i, j);
			i1 = index(-1 * m, i, j);
			geometry.faces.push(
				new THREE.Face3(i0 + 1, i0 + 2, i1 + 1),
				new THREE.Face3(i0 + 2, i1 + 2, i1 + 1)
			);
			geometry.faceVertexUvs[0].push([uv0, uv1, uv2], [uv1, uv3, uv2]);
		}
		
		// Faces
		m = (((i + j + k + 3) / 2) % 2) * 2 - 1;
			
		i0 = index(i, -1, -1) + 0;
		i1 = index(i, 1 * m, -1 * m) + 0;
		i2 = index(i, -1 * m, 1 * m) + 0;
		i3 = index(i, 1, 1) + 0;
		geometry.faces.push(
			new THREE.Face3(i0, i1, i2),
			new THREE.Face3(i1, i3, i2)
		);
		geometry.faceVertexUvs[0].push([uv0, uv1, uv2], [uv1, uv3, uv2]);
		
		i0 = index(-1, i, -1) + 1;
		i1 = index(1 * m, i, -1 * m) + 1;
		i2 = index(-1 * m, i, 1 * m) + 1;
		i3 = index(1, i, 1) + 1;
		geometry.faces.push(
			new THREE.Face3(i0, i2, i1),
			new THREE.Face3(i2, i3, i1)
		);
		geometry.faceVertexUvs[0].push([uv0, uv1, uv2], [uv1, uv3, uv2]);
		
		i0 = index(-1, -1, i) + 2;
		i1 = index(1 * m, -1 * m, i) + 2;
		i2 = index(-1 * m, 1 * m, i) + 2;
		i3 = index(1, 1, i) + 2;
		geometry.faces.push(
			new THREE.Face3(i0, i1, i2),
			new THREE.Face3(i1, i3, i2)
		);
		geometry.faceVertexUvs[0].push([uv0, uv1, uv2], [uv1, uv3, uv2]);
	}
	
	geometry.computeBoundingSphere();
	geometry.computeFaceNormals();

	return geometry;
}

function bevel_tetrahedron(radius, bevel) {
	var b = bevel;
	
	var x = Math.sqrt(8) / 3 * b;
	var y = -1 / 3 * b;
	var z = Math.sqrt(2 / 3) * b;

	var p0 = new THREE.Vector3(0, b, 0);
	var p1 = new THREE.Vector3(x, y, 0);
	var p2 = new THREE.Vector3(-0.5 * x, y, z);
	var p3 = new THREE.Vector3(-0.5 * x, y, -z);
	
	var geometry = new THREE.Geometry();

	var r = radius / b - 2;

	geometry.vertices.push(
		p0.clone().multiplyScalar(r).add(p1).add(p2),
		p0.clone().multiplyScalar(r).add(p2).add(p3),
		p0.clone().multiplyScalar(r).add(p3).add(p1),
		
		p1.clone().multiplyScalar(r).add(p0).add(p2),
		p1.clone().multiplyScalar(r).add(p2).add(p3),
		p1.clone().multiplyScalar(r).add(p3).add(p0),

		p2.clone().multiplyScalar(r).add(p0).add(p1),
		p2.clone().multiplyScalar(r).add(p1).add(p3),
		p2.clone().multiplyScalar(r).add(p3).add(p0),

		p3.clone().multiplyScalar(r).add(p0).add(p1),
		p3.clone().multiplyScalar(r).add(p1).add(p2),
		p3.clone().multiplyScalar(r).add(p2).add(p0)
	);
	
	geometry.faces.push(
		// Corner
		new THREE.Face3(2, 1, 0),
		new THREE.Face3(3, 4, 5),
		new THREE.Face3(8, 7, 6),
		new THREE.Face3(9, 10, 11),
		
		// Edges
		new THREE.Face3(3, 2, 0),
		new THREE.Face3(5, 2, 3),
		
		new THREE.Face3(0, 1, 6),
		new THREE.Face3(6, 1, 8),
		
		new THREE.Face3(1, 2, 9),
		new THREE.Face3(9, 11, 1),
		
		new THREE.Face3(6, 4, 3),
		new THREE.Face3(7, 4, 6),
		
		new THREE.Face3(9, 5, 4),
		new THREE.Face3(4, 10, 9),
	
		new THREE.Face3(7, 8, 10),
		new THREE.Face3(10, 8, 11),
		
		// Face
		new THREE.Face3(6, 3, 0),
		new THREE.Face3(11, 8, 1),
		new THREE.Face3(2, 5, 9),
		new THREE.Face3(4, 7, 10)
		
		
		//~new THREE.Face3(4, 3, 0),
		//~new THREE.Face3(6, 7, 4),
		//~new THREE.Face3(0, 1, 6),
		//~new THREE.Face3(6, 4, 0),
		//~
		//~new THREE.Face3(0, 3, 5),
		//~new THREE.Face3(5, 10, 9),
		//~new THREE.Face3(9, 2, 0),
		//~new THREE.Face3(0, 5, 9),
		//~
		//~new THREE.Face3(8, 6, 1),
		//~new THREE.Face3(9, 11, 8),
		//~new THREE.Face3(1, 2, 9),
		//~new THREE.Face3(9, 8, 1),
		//~
		//~new THREE.Face3(4, 7, 8),
		//~new THREE.Face3(8, 11, 10),
		//~new THREE.Face3(10, 5, 4),
		//~new THREE.Face3(4, 8, 10)
	);
	
	geometry.computeBoundingSphere();
	geometry.computeFaceNormals();

	return geometry;
}

////////////////////////////////////////////////////////////////////////
// Collisions
////////////////////////////////////////////////////////////////////////

function sphere_sphere_intersection(c0, r0, c1, r1, mtv) {
	//     .--:--:--.              .--'--.      .--'--.
	// c0 /  /    \  \ c1      c0 /       \    /       \ c1
	//    |  |===>|  |            |       |<===|       |
	//    \  \    /  /            \       /    \       /
	//     '--:--:--'              '--.--'      '--.--'
	//        mtv                          mtv

	var r = r0 + r1;
	
	var dx = c0.x - c1.x;
	var dy = c0.y - c1.y;
	var dz = c0.z - c1.z;
	
	if (mtv !== undefined) {
		var l = Math.sqrt(dx * dx + dy * dy + dz * dz);
		var dl = (r - l) / Math.max(l, 0.0001);
		
		mtv.set(dl * dx, dl * dy, dl * dz);
		return dl > 0;
	}
	
	return (dx * dx + dy * dy + dz * dz) < r * r;
}

function aabb_sphere_intersection(v0, v1, c, r, mtv) {
	// v0, v1: aabb corner points
	// c, r: sphere center, radius
	// mtv: minimum translation vector (optional)
	
	var px, py, pz;
	
	if (c.x < v0.x) px = v0.x; else if (c.x > v1.x) px = v1.x; else px = c.x;
	if (c.y < v0.y) py = v0.y; else if (c.y > v1.y) py = v1.y; else py = c.y;
	if (c.z < v0.z) pz = v0.z; else if (c.z > v1.z) pz = v1.z; else pz = c.z;
	
	var dx = c.x - px;
	var dy = c.y - py;
	var dz = c.z - pz;
	
	if (mtv !== undefined) {
		var l = Math.sqrt(dx * dx + dy * dy + dz * dz);
		var dl = (r - l) / Math.max(l, 0.0001);
		
		mtv.set(dl * dx, dl * dy, dl * dz);
		return dl > 0;
	}
	
	return (dx * dx + dy * dy + dz * dz) < r * r;
}

////////////////////////////////////////////////////////////////////////
// Player
////////////////////////////////////////////////////////////////////////

var metal_tex = THREE.ImageUtils.loadTexture('textures/metal.jpg');
//~var metal_bump_tex = THREE.ImageUtils.loadTexture('textures/metal_bump.jpg');
//~var metal_mat = new THREE.MeshPhongMaterial({color: 0xffffff, map: metal_tex, bumpMap: metal_bump_tex, bumpScale:0.05});
var metal_mat = new THREE.MeshPhongMaterial({color: 0xffffff, map: metal_tex});
//~var metal_mat = new THREE.MeshPhongMaterial({color: 0xffffff});

var Player = function (world) {
	this.last_cp;
	this.world = world;
	
	// object
	this.radius = 1;
	
	var geom = new THREE.SphereGeometry(this.radius, 20, 20);
	this.sphere = new THREE.Mesh(geom, metal_mat);
	
	this.sphere.castShadow = true;
	this.sphere.receiveShadow = true;
	
	world.scene.add(this.sphere);
	
	// physics
	this.v = new THREE.Vector3();
	this.pos = new THREE.Vector3();
	
	this.angle = 0;
	this.angle_vel = 0;
	
	this.jump_keyed = false;
	this.jump_keyed_last = 0;
	this.bounced = false;
	this.bounced_last = 0;
	this.bounced_dir = new THREE.Vector3();
	
	this.info_text = new Text(10, 10);
	this.axis = new THREE.AxisHelper(2);
	world.scene.add(this.axis);
};

Player.prototype = {
	respawnPos: function(pos, angle) {
		this.v.set(0, 0, 0);
		this.pos.copy(pos);
		
		this.angle_vel = 0;
		if (angle !== undefined)
			this.angle = angle;
	},
	//~respawnPlatform: function(platform) {
		//~var offset = 0.5 * platform.height + this.radius;
		//~this.respawnPos(platform.box.position.clone().add(new THREE.Vector3(0, offset, 0)));
	//~},
	respawn: function(checkpoint) {
		if (checkpoint !==undefined)
			this.last_cp = checkpoint;
		this.respawnPos(this.last_cp.position());
	},
	
	collide: function(mtv) {
		var d = new THREE.Vector3();
		var collide_dist = -Infinity;
		var has_collided = false;
		
		for (i = 0; i < this.world.platforms.length; i++) {
			var c = aabb_sphere_intersection(
				this.world.platforms[i].v0, this.world.platforms[i].v1,
				this.pos, this.radius,
				d
			);
			
			if (c) {
				if (has_collided)
					mtv.add(d);
				else {
					has_collided = true;
					mtv.copy(d);
				}
				collide_dist = mtv.length();
			} else if (!has_collided) {
				var l = -d.length();
				if (l > collide_dist) {
					collide_dist = l;
					mtv.copy(d);
				}
			}
		}
		
		return collide_dist
	},
	
	update_control: function(delta) {
		var keyboard = this.world.game.keyboard;
	
		var max_vel = 10;
		var vel_acc = max_vel * 2;
		var vel_rest = 0.1;
		//~var side_vel_rest = 0.9;
		var side_vel_rest = 0.3;
		
		var max_turn_vel = 3;
		var turn_acc = max_turn_vel * 5;
		var turn_rest = 0.2;
		
		// Advance control
		var dir = new THREE.Vector3(Math.cos(this.angle), 0, Math.sin(this.angle));
		var up = new THREE.Vector3(0, 1, 0);
		var side = new THREE.Vector3().crossVectors(dir, up);
		
		if (this.bounced_last == 0)
			this.v.sub(side.clone().multiplyScalar(side_vel_rest * this.v.dot(side)));
		else
			this.v.sub(side.clone().multiplyScalar(0.1 * this.v.dot(side)));
		this.info_text.set_text(this.bounced_last == 0);
		
		var vel = this.v.dot(dir);
		this.v.sub(dir.clone().multiplyScalar(vel));
		
		var up_key = keyboard.pressed("up");
		var down_key = keyboard.pressed("down");
		
		//~var slope = 0.01;
		//~vel_acc = vel_acc * (Math.exp(-slope * Math.abs(vel) / max_vel) - Math.exp(-slope)) / (1 - Math.exp(-slope));
		//~vel_acc = vel_acc * (1 - Math.pow(Math.abs(vel) / max_vel, 0.5));
		//~if (this.bounced_last > 0)
			//~vel_acc = 0;
		//~this.info_text.set_text('acc: ' + vel_acc.toFixed(3));
		
		if (up_key && !down_key) {
			if (vel < max_vel)
				vel += vel_acc * delta;
		} else if (down_key && !up_key) {
			if (vel > -max_vel)
				vel -= vel_acc * delta;
		} else
			vel -= vel_rest * vel;
			
		this.v.add(dir.clone().multiplyScalar(vel));
		
		// Angle control
		var turn_dir = 1;
		//~if (vel > -0.1)
			//~var turn_dir = 1;
		//~else
			//~var turn_dir = -1;
		
		var left_key = keyboard.pressed("left");
		var right_key = keyboard.pressed("right");
		
		if (left_key && !right_key) {
			this.angle_vel -= turn_dir * turn_acc * delta;
		} else if (right_key && !left_key) {
			this.angle_vel += turn_dir * turn_acc * delta;
		} else
			this.angle_vel -= turn_rest * this.angle_vel;
			
		if (this.angle_vel < -max_turn_vel) this.angle_vel = -max_turn_vel;
		if (this.angle_vel > max_turn_vel) this.angle_vel = max_turn_vel;
		
		// Jump
		if (keyboard.down("space")) {
			this.jump_keyed = true;
			this.jump_keyed_last = 0;
		} else
			this.jump_keyed_last += delta;
		
		// Respawn
		if (keyboard.down("shift"))
			this.respawn();
			
		// Restart
		if (keyboard.down("enter")) {
			for (var i = 0; i < this.world.checkpoints.length; ++i)
				this.world.checkpoints[i].reset();

			this.last_cp = this.world.start_cp;
			this.respawn();
		}
	},
	
	update: function (delta) {
		var dir = new THREE.Vector3(Math.cos(this.angle), 0, Math.sin(this.angle));
		var up = new THREE.Vector3(0, 1, 0);
		var side = new THREE.Vector3().crossVectors(dir, up);
		
		// Physics
		var a = new THREE.Vector3(0, -9.8 * 2, 0);
		this.v.add(a.multiplyScalar(delta));
		
		this.pos.add(this.v.clone().multiplyScalar(delta));
		this.angle += this.angle_vel * delta;

		this.angle = this.angle % (2 * Math.PI);

		// Collisions
		var bounce_damping = 0.3;
		
		var mtv = new THREE.Vector3();
		var dist = this.collide(mtv);
		
		if (dist > 0) {
			this.pos.add(mtv);
			var mtv_unit = mtv.clone().normalize();
			var v_norm = mtv_unit.clone().multiplyScalar(this.v.dot(mtv_unit));
			this.v.sub(v_norm.multiplyScalar(1 + bounce_damping));
			
			this.bounced = true;
			this.bounced_last = 0;
			this.bounced_dir.copy(mtv_unit);
		} else
			this.bounced_last += delta;
		
		// Jumps
		var wall_jump = 0.5;
		
		if (this.bounced && this.jump_keyed) {
			if (Math.abs(this.bounced_last - this.jump_keyed_last) < 0.1) {
				var jump_dir = this.bounced_dir.clone();
				jump_dir.add(up.clone().multiplyScalar(wall_jump)).normalize();
				
				var jump_power = Math.max(10 - this.v.dot(jump_dir), 0);
				//~this.v.sub(jump_dir.clone().multiplyScalar(this.v.dot(jump_dir)));
				this.v.add(jump_dir.clone().multiplyScalar(jump_power));
				
				//~dir - 2 * jump_dir.dot(dir)
				//~var new_dir = dir.clone().multiplyScalar(1 - 2 * jump_dir.dot(dir));
				var alt_jump_dir = jump_dir.clone().setY(0).normalize();
				var new_dir = dir.clone().sub(alt_jump_dir.multiplyScalar(-2 * Math.abs(alt_jump_dir.dot(dir))));
				//~new_dir.setY(0).normalize();
				var angle = Math.atan2(dir.x, dir.z) - Math.atan2(new_dir.x, new_dir.z);
				angle = (angle + Math.PI) % (2 * Math.PI) - Math.PI;
				//~var threshold = 0.8;
				//~if (angle > threshold * Math.PI) angle = angle - Math.PI;
				//~if (angle < -threshold * Math.PI) angle = angle + Math.PI;

				//~if (angle * this.angle_vel > 0 && Math.abs(this.angle_vel) > 0.5)
					//~this.angle += angle * 0.6;
				//~else if (angle * this.angle_vel < 0 && Math.abs(this.angle_vel) > 0.5) {
					//~angle = (angle + Math.PI + Math.PI) % (2 * Math.PI) - Math.PI;
					//~this.angle += angle * 0.6;
				//~}

				//~this.angle += angle * 0.8;
			}
			
			this.bounced = false;
			this.jump_keyed = false;
		}
		
		// Controls
		this.update_control(delta);

		// Update objects
		this.sphere.position.copy(this.pos);
		
		this.sphere.updateMatrixWorld(true);
		var obj_side = this.sphere.worldToLocal(side.clone().add(this.pos)).normalize();
		var quat = new THREE.Quaternion();
		quat.setFromAxisAngle(obj_side, -Math.atan(this.v.dot(dir) * delta / this.radius));
		this.sphere.quaternion.multiply(quat);
		
		var camera = this.world.camera;
		var cam_target = this.pos.clone().add(up.clone().multiplyScalar(3)).add(dir.clone().multiplyScalar(-5));
		camera.position.add(cam_target.sub(camera.position).multiplyScalar(0.1));
		camera.lookAt(this.pos.clone().add(up.clone().multiplyScalar(1)));
		
		//~light.target.position.copy(this.pos);
		this.axis.position.copy(this.pos);
		this.axis.quaternion.copy(this.sphere.quaternion);
	}
};

////////////////////////////////////////////////////////////////////////
// Animation
////////////////////////////////////////////////////////////////////////

var Animation = function(duration, callback) {
	this.duration = duration;
	this.callback = callback;
	this.playing = false;
	this.t = 0;
}

Animation.prototype = {
	start: function() {
		this.playing = true;
	},
	update: function(delta) {
		if (!this.playing)
			return;
		
		if (this.t > 1) {
			this.callback(1);
			this.playing = false;
			this.t = 0;
		} else {
			this.callback(this.t);
			this.t += delta / this.duration;
		}
	},
};

////////////////////////////////////////////////////////////////////////
// Checkpoint
////////////////////////////////////////////////////////////////////////

var base_mat = new THREE.MeshPhongMaterial({color: 0x000000});
var drone_mat_1 = new THREE.MeshPhongMaterial({color: 0xff0000, transparent: true, opacity: 1});
var drone_mat_2 = new THREE.MeshPhongMaterial({color: 0x00af00, transparent: true, opacity: 1});

var Checkpoint = function (scene, platform, player) {
	this.platform = platform;
	this.player = player;
	
	this.checked = false;
	
	// Base
	var base_size = Math.sqrt(Math.min(platform.width, platform.depth, 0.6) - 0.2);
	var base_geom = bevel_box(base_size, 0.2, base_size, 0.05);
	this.base = new THREE.Mesh(base_geom, base_mat);
	
	this.base.position.x = platform.box.position.x;
	this.base.position.y = platform.box.position.y + 0.5 * platform.height;
	this.base.position.z = platform.box.position.z;
	
	this.base.rotation.y = 0.25 * Math.PI;
	
	this.base.castShadow = true;
	this.base.receiveShadow = true;
	
	scene.add(this.base);
	
	// Drone
	this.drone_height = 2;
	
	var drone_geom = bevel_tetrahedron(1.5, 0.25);
	this.drone = new THREE.Mesh(drone_geom, drone_mat_1);
	
	this.drone.position.x = platform.box.position.x;
	this.drone.position.y = platform.box.position.y + 0.5 * platform.height + this.drone_height;
	this.drone.position.z = platform.box.position.z;
	
	this.drone.rotation.x = 2 * Math.PI * Math.random();
	this.drone.rotation.y = 2 * Math.PI * Math.random();
	
	this.drone.castShadow = true;
	this.drone.receiveShadow = true;
	
	scene.add(this.drone);
	
	// Animation
	var checkpoint = this;
	this.check_anim = new Animation(0.2, function(t) {
		if (t < 0.5) {
			var scale = 1 + 2 * t;
			var mat = drone_mat_1;
		} else if (t != 1) {
			var scale = 4 - 4 * t;
			var mat = drone_mat_2;
		} else {
			var scale = 1;
			checkpoint.drone.visible = false;
		}
		//~checkpoint.drone.material = mat;
		checkpoint.drone.scale.set(scale, scale, scale);
	});
};

Checkpoint.prototype = {
	position: function() {
		return this.drone.position;
	},
	
	update: function(delta) {
		var rot_speed = 5;
		this.drone.rotation.x += rot_speed * delta;
		this.drone.rotation.y += rot_speed * delta;
		
		if (!this.checked && sphere_sphere_intersection(this.position(), 1,
						this.player.sphere.position, this.player.radius)) {
			this.checked = true;
			this.player.last_cp = this;
			this.check_anim.start();
		}
	
		this.check_anim.update(delta);
	},
	
	reset: function() {
		this.checked = false;
		this.drone.visible = true;
	},
};

////////////////////////////////////////////////////////////////////////
// Platform
////////////////////////////////////////////////////////////////////////

var stone_tex = THREE.ImageUtils.loadTexture('textures/stone.jpg');
var wood_tex = THREE.ImageUtils.loadTexture('textures/wood.jpg');

var stone_mat = new THREE.MeshPhongMaterial({color: 0xffffff, map: stone_tex});
var wood_mat = new THREE.MeshPhongMaterial({color: 0xffffff, map: wood_tex});

var Platform = function (scene) {
	//~var min_volume = 0.1;
	var min_thickness = 0.5;
	var max_thickness = 10;
	var world_size = 40;
	
	this.width = min_thickness + Math.random() * (max_thickness - min_thickness);
	this.height = min_thickness + Math.random() * (max_thickness - min_thickness);
	this.depth = min_thickness + Math.random() * (max_thickness - min_thickness);
	//~this.width = Math.max(Math.random(), min_thickness);
	//~this.height = Math.max(Math.random(), min_thickness);
	//~this.depth = volume / this.width / this.height;
	
	if (Math.random() > (this.width + this.height + this.depth) / 30)
		var material = wood_mat;
	else
		var material = stone_mat;
	//~var geom = new THREE.BoxGeometry(this.width, this.height, this.depth);
	var geom = bevel_box(this.width, this.height, this.depth, 0.1);
	this.box = new THREE.Mesh(geom, material);
	
	this.box.position.x = (Math.random() - 0.5) * world_size;
	this.box.position.y = (Math.random() - 0.5) * world_size;
	this.box.position.z = (Math.random() - 0.5) * world_size;
	
	this.box.castShadow = true;
	this.box.receiveShadow = true;
	
	scene.add(this.box);
	
	this.v0 = new THREE.Vector3(-this.width / 2, -this.height / 2, -this.depth / 2).add(this.box.position);
	this.v1 = new THREE.Vector3(this.width / 2, this.height / 2, this.depth / 2).add(this.box.position);
}

////////////////////////////////////////////////////////////////////////
// Text
////////////////////////////////////////////////////////////////////////

var Text = function(x, y, text) {
	this.div = document.createElement('div');
	this.div.style.position = 'absolute';
	//this.div.style.zIndex = 1;
	
	this.div.style.top = y + 'px';
	this.div.style.left = x + 'px';
	
	this.font = document.createElement('font');
	this.font.color = '#ffffff';
	
	if (text !== undefined)
		this.font.innerHTML = text;
	
	this.div.appendChild(this.font);
	document.body.appendChild(this.div);
};

Text.prototype = {
	set_text: function(text) {
		this.font.innerHTML = text;
	},
};

////////////////////////////////////////////////////////////////////////
// Layers
////////////////////////////////////////////////////////////////////////

var Layer = function(game) {
	this.game = game;
	
	this.active = true;
	this.visible = true;
};

Layer.prototype = {
	set_active: function(active) { this.active = active; },
	pause: function() { this.set_active(false); },
	resume: function() { this.set_active(true); },
	
	//~set_visible: function(visible) { this.visible = visible; this.set_active(visible); },
	set_visible: function(visible) { this.visible = visible; },
	show: function() { this.set_visible(true); },
	hide: function() { this.set_visible(false); },
	
	resize: function(width, height) {},
	
	update: function(delta) {},
	render: function() {},
};

// HUD
////////////////

var HUD = function(game) {
	Layer.call(this, game);
};

HUD.prototype = Object.create(Layer.prototype);
HUD.prototype.constructor = HUD;

HUD.prototype.update = function(delta) {
};

HUD.prototype.render = function() {
};

/*
var GameState = function() {
	this.STATE_START = 0;
	this.STATE_RUN = 1;
	this.STATE_PAUSE = 1;
	this.STATE_FINISH = 2;
	this.state = this.STATE_START;
	
	this.time = 0;
	this.time_text = new Text(10, 30);
	
	this.cp_text = new Text(10, 50);
};

GameState.prototype = {
	format_chrono: function(time) {
		function pad(num, numZeros) {
			var n = Math.abs(num);
			var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
			var zeroString = Math.pow(10, zeros).toString().substr(1);
			if (num < 0)
				zeroString = '-' + zeroString;
			return zeroString + n;
		}
		
		var sign = '';
		if (time < 0)
			sign = '-';
		time = Math.abs(time);
		
		hours = Math.floor(time / 3600);
		mins = Math.floor((time - 3600 * hours) / 60);
		secs = time - 3600 * hours - 60 * mins;
		
		if (hours > 0)
			return sign + hours + ':' + pad(mins, 2) + ':' + pad(secs.toFixed(2), 2);
		else
			return mins + ':' + pad(secs.toFixed(2), 2);
	},
	
	update: function(delta) {
		// Time
		this.time += delta;
		this.time_text.set_text('time: ' + this.format_chrono(this.time));
		
		// Checkpoints
		var cp_count = 0
		for (var i = 0; i < checkpoints.length; ++i)
			if (checkpoints[i].checked)
				++cp_count;
				
		this.cp_text.set_text('cp: ' + cp_count + '/' + checkpoints.length);
	},
};
*/

// World
////////////////

var World = function(game) {
	Layer.call(this, game);
	
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	
	// Objects
	this.player = new Player(this);
	this.platforms = [];
	this.checkpoints = [];

	for (i = 0; i < 100; i++)
		this.platforms.push(new Platform(this.scene));

	for (i = 0; i < 10; i++)
		this.checkpoints.push(new Checkpoint(this.scene, this.platforms[i], this.player));

	this.start_cp = this.checkpoints[0];
	this.player.respawn(this.start_cp);

	// Lights
	var sky_light = new THREE.HemisphereLight(0xadccff, 0x826739);
	this.scene.add(sky_light);


	var light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2, 1);
	light.position.set(500, 1500, 500);
	light.target.position.set(0, 0, 0);

	light.castShadow = true;

	light.shadowCameraNear = 1200;
	light.shadowCameraFar = 2500;
	light.shadowCameraFov = 5;

	//light.shadowCameraVisible = true;

	light.shadowBias = 0.00018;
	light.shadowDarkness = 0.6;

	light.shadowMapWidth = 1024 * 4;
	light.shadowMapHeight = 1024 * 4;

	this.scene.add(light);


	//~var sun_light = new THREE.DirectionalLight(0xffffff);
	//~sun_light.position.set(1, 0.5, 1);
	//~scene.add(sun_light);

	this.scene.add(new THREE.AxisHelper(1));
};

World.prototype = Object.create(Layer.prototype);
World.prototype.constructor = World;

World.prototype.resize = function(width, height) {
	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();
};

World.prototype.update = function(delta) {
	delta = Math.min(delta, 0.1);

	this.player.update(delta);
	
	for (i = 0; i < this.checkpoints.length; i++)
		this.checkpoints[i].update(delta);
};

World.prototype.render = function() {
	this.game.renderer.render(this.scene, this.camera);
	this.game.context2d.drawImage(this.game.renderer.domElement, 0, 0);
};

// Main menu
////////////////

function button(ctx, text, cx, cy, w, h) {
	//~var dims = ctx.measureText(text);
	var dims = {width: 0, height: 0};
	
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(cx - w / 2 + 1, cy - h / 2 + 1, w - 2, h - 2);
	
	ctx.fillStyle = "#ffffff";
	ctx.fillText(text, cx - dims.width / 2, cy + dims.height / 2);
}

var MainMenu = function(game) {
	Layer.call(this, game);
};

MainMenu.prototype = Object.create(Layer.prototype);
MainMenu.prototype.constructor = MainMenu;

MainMenu.prototype.update = function(delta) {
};

MainMenu.prototype.render = function () {
	var ctx = this.game.context2d;
	var w = this.game.canvas.width;
	var h = this.game.canvas.height;
	
	//~ctx.save();
	
	ctx.globalAlpha = 0.9;
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, w, h);
	
	button(ctx, 'Play', 200, 200, 100, 30);
	
	//~ctx.restore();
};

////////////////////////////////////////////////////////////////////////
// Game
////////////////////////////////////////////////////////////////////////

var Game = function() {
	// 3D renderer
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	
	this.renderer.domElement.style = 'z-index: 1';
	document.body.appendChild(this.renderer.domElement);

	this.renderer.shadowMapEnabled = true;
	this.renderer.shadowMapType = THREE.PCFShadowMap;

	// 2D renderer
	this.canvas = document.createElement('canvas');
	this.context2d = this.canvas.getContext('2d');

		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	this.canvas.style = 'z-index: 2';
	document.body.appendChild(this.canvas);

	// Resize event
	window.addEventListener('resize', this.on_resize.bind(this), false);

	// Misc
	this.keyboard = new KeyboardState();
	this.clock = new THREE.Clock();

	// Layers
	this.world = new World(this);
	this.main_menu = new MainMenu(this);
	
	//~this.layers = [this.world, this.main_menu];
	this.layers = [this.world];
};

Game.prototype = {
	on_resize: function() {
		for (var i = 0; i < this.layers.length; ++i)
			this.layers[i].resize(window.innerWidth, window.innerHeight);
				
		this.renderer.setSize(window.innerWidth, window.innerHeight);
			
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		//~this.canvas.style.width = window.innerWidth + 'px';
		//~this.canvas.style.height = window.innerHeight + 'px';
	},
	
	update: function() {
		var delta = this.clock.getDelta();
		this.keyboard.update();
	
		for (var i = 0; i < this.layers.length; ++i)
			if (this.layers[i].active)
				this.layers[i].update(delta);
	},
	
	render: function() {
		for (var i = 0; i < this.layers.length; ++i)
			if (this.layers[i].visible)
				this.layers[i].render();
		
	},
	
	run: function() {
		requestAnimationFrame(this.run.bind(this));
		
		this.update();
		this.render();
	},
};

////////////////////////////////////////////////////////////////////////
// main
////////////////////////////////////////////////////////////////////////

var game = new Game();
game.run();
