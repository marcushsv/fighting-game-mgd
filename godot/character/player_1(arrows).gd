extends CharacterBody2D


@export var speed : float  = 300.0
@export var jump_velocity : float = -400.0
@onready var sprite : AnimatedSprite2D = $AnimatedSprite2D
var direction : Vector2 = Vector2.ZERO
var animation_locked : bool = false
@export var max_hp : int = 1000
var current_hp : int
var animation


# Get the gravity from the project settings to be synced with RigidBody nodes.
var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")

func _ready():

	animation = $AnimationTree.get("parameters/playback")
	current_hp = max_hp
	
	
func _process(delta):
	updateFacingDirection()

	if current_hp <= 0:
		die()
		get_tree().change_scene_to_file("res://screens/gameover.tscn")

func _physics_process(delta):
	get_input(delta)
	if Input.is_action_just_pressed("space"):
		attack()




func get_input(delta):
	move_and_slide()
	
	if not is_on_floor():
		velocity.y += gravity * delta
		
	if Input.is_action_just_pressed("w") and is_on_floor():
		velocity.y = jump_velocity
		
	
	
	
	direction = Input.get_vector("a", "d", "null", "null")
	if direction:
		walk()
		velocity.x = direction.x * speed
	else:
		velocity.x = move_toward(velocity.x, 0, speed)
		animation.travel("idle")

func updateFacingDirection():
	if direction.x > 0:
		sprite.flip_h = false
	elif direction.x < 0:
		sprite.flip_h = true

func attack():
	animation.travel("slash")

func hurt():
	animation.travel("hurt")

func die():
	animation.travel("death")

func walk():
	animation.travel("walk")

func _on_sword_hit_area_entered(area):
	if area.is_in_group("hurtbox"):
		print("dealt damage")
		area.take_damage()

func _on_hurtbox_area_entered(hitbox):
	var base_damage = hitbox.damage
	self.current_hp -= base_damage
	hurt()
	print(current_hp)
