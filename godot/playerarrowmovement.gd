extends CharacterBody2D


@onready var sprite : AnimatedSprite2D = $AnimatedSprite2D
@onready var cooldown = $attackCooldown
@onready var animation = $AnimationTree.get("parameters/playback")
@export var speed : float  = 300.0
@export var jump_velocity : float = -400.0
var can_attack = true
var can_move = true
var health : int = 1000
var direction : Vector2 = Vector2.ZERO
var animation_locked : bool = false
var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")





func _process(delta):
	if health <= 0:
		die()


func _physics_process(delta):
	update_health()
	if cooldown.is_stopped():
		can_move = true
		can_attack = true
	get_input(delta)
	if Input.is_action_just_pressed("down_arrow"):
		parry()
	if Input.is_action_just_pressed("up_arrow"):
		attack()



func get_input(delta):
	
	if can_move == true:
		move_and_slide()
	
	direction = Input.get_vector("left_arrow", "right_arrow", "null", "null")

	if not is_on_floor():
		velocity.y += gravity * delta

	if direction:
		if direction.x < 0:
			walk()
		if direction.x > 0:
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
	if can_attack == true and cooldown.is_stopped():
		animation.travel("hurt")
		can_move = false
		can_attack = false
		cooldown.start(.2)


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
	self.health -= base_damage
	hurt()
	print(health)


func update_health():
	var healthbar = $hpbar
	healthbar.value = health

