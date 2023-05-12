extends CharacterBody2D


@export var speed : float  = 300.0
@export var jump_velocity : float = -400.0
@onready var animated_sprite : AnimatedSprite2D = $AnimatedSprite2D
var animation_locked : bool = false
var direction : Vector2 = Vector2.ZERO
@export var max_hp : int = 1000
var current_hp : int
var attack = preload("res://attack.tscn")

# Get the gravity from the project settings to be synced with RigidBody nodes.
var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")

func _ready():
	current_hp = max_hp


func _physics_process(delta):
	# Add the gravity.
	if not is_on_floor():
		velocity.y += gravity * delta

	# Handle Jump.
	if Input.is_action_just_pressed("w") and is_on_floor():
		velocity.y = jump_velocity

	# Get the input direction and handle the movement/deceleration.
	# As good practice, you should replace UI actions with custom gameplay actions.
	direction = Input.get_vector("a", "d", "w", "s")
	if direction:
		velocity.x = direction.x * speed
	else:
		velocity.x = move_toward(velocity.x, 0, speed)

	move_and_slide()
	updateAnimation()
	updateFacingDirection()
	attackLoop()
	
	
func updateAnimation():
	if not animation_locked:
		if direction.x != 0:
			animated_sprite.play("run")
		else:
			animated_sprite.play("idle")

func updateFacingDirection():
	if direction.x > 0:
		animated_sprite.flip_h = false
	elif direction.x < 0:
		animated_sprite.flip_h = true
		
func attackLoop():
	if Input.is_action_just_pressed("attack"):
		var attack_instance = attack.instantiate()
		get_parent().add_child(attack_instance)
