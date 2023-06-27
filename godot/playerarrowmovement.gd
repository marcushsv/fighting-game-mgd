extends CharacterBody2D


@onready var sprite : AnimatedSprite2D = $AnimatedSprite2D
@onready var cooldown = $attackCooldown
@onready var dashCooldown = $dashCooldown
@onready var hitCooldown = $hitCooldown
@onready var animation = $AnimationTree.get("parameters/playback")
@export var speed : float  = 300.0
@export var jump_velocity : float = -400.0
var can_attack = true
var can_move = true
var can_dash = true
var dashing = false
var is_hurting = false
var dashDirection = Vector2.ZERO
var health : int = 1000
var direction : Vector2 = Vector2.ZERO
var animation_locked : bool = false
var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")






func _process(delta):
	if health <= 0:
		GlobalVars.setwinner_arrows()
		die()


func _physics_process(delta):
	update_health()
	if cooldown.is_stopped():
		can_move = true
		can_attack = true
		dashing = false
		can_dash = true
	if hitCooldown.is_stopped():
		can_move = true
		can_attack = true
	if dashCooldown.is_stopped():
		pass
	get_input(delta)
	if Input.is_action_just_pressed("down_arrow"):
		parry()
	if Input.is_action_just_pressed("up_arrow"):
		attack()
	dash()




func get_input(delta):
	
	if can_move == true:
		move_and_slide()
	
	direction = Input.get_vector("left_arrow", "right_arrow", "null", "null")

	if not is_on_floor():
		velocity.y += gravity * delta

	if direction:
		if direction.x < 0:
			dashDirection = Vector2(-1,0)
			walk()
		if direction.x > 0:
			dashDirection = Vector2(1,0)
			walk_bw()
		velocity.x = direction.x * speed
	else:
		velocity.x = move_toward(velocity.x, 0, speed)
		animation.travel("idle")


func attack():
	if can_attack == true and cooldown.is_stopped():
		animation.travel("slash")
		can_move = false
		can_attack = false
		cooldown.start(1)


func parry():
	if can_attack == true and cooldown.is_stopped():
		animation.travel("parry")
		can_move = false
		can_attack = false
		cooldown.start(1)


func hurt():
		can_move = false
		can_attack = false
		is_hurting = true
		cooldown.start(.3)
		animation.travel("hurt")


func die():
	animation.travel("death")
	get_tree().change_scene_to_file("res://screens/gameover.tscn")


func walk():
	animation.travel("walk")


func walk_bw():
	animation.travel("walk_bw")


func _on_sword_hit_area_entered(area):
	if area.is_in_group("hurtbox"):
		print("dealt damage")
		area.take_damage()


func _on_hurtbox_area_entered(hitbox):
	var base_damage = hitbox.damage
	self.hurt()
	self.health -= base_damage
	print(health)


func update_health():
	var healthbar = $hpbar
	healthbar.value = health
	
func dash():
	if Input.is_action_just_pressed("Ctrl") and dashCooldown.is_stopped():
		if direction.x < 0:
			animation.travel("dash")
		if direction.x > 0:
			animation.travel("dash")
		move_toward(velocity.x, 0, speed)
		velocity += dashDirection.normalized() * 2000
		print("dashed")
		dashCooldown.start(health/200)


