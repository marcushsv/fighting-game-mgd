extends CharacterBody2D


@export var speed : float  = 300.0
@export var jump_velocity : float = -400.0
@onready var sprite : AnimatedSprite2D = $AnimatedSprite2D
var direction : Vector2 = Vector2.ZERO
var state_machine

# Get the gravity from the project settings to be synced with RigidBody nodes.
var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")

func _ready():
	state_machine = $AnimationTree.get("parameters/playback")


func _physics_process(delta):
	# Add the gravity.
	if not is_on_floor():
		velocity.y += gravity * delta

	# Handle Jump.
	if Input.is_action_just_pressed("w") and is_on_floor():
		velocity.y = jump_velocity
		
	if Input.is_action_just_pressed("space"):
		attack()
	
	direction = Input.get_vector("a", "d", "w", "s")
	if direction:
		velocity.x = direction.x * speed
	else:
		velocity.x = move_toward(velocity.x, 0, speed)

	move_and_slide()
	updateFacingDirection()

func updateFacingDirection():
	if direction.x > 0:
		sprite.flip_h = false
	elif direction.x < 0:
		sprite.flip_h = true

func attack():
	state_machine.travel("slasher")

func _on_sword_hit_area_entered(area):
	if area.is_in_group("hurtbox"):
		area.take_damage()
