extends CharacterBody2D


@export var speed : float  = 300.0
@export var jump_velocity : float = -400.0
@onready var sprite : Sprite2D = $playersheets
var animation_locked : bool = false
var direction : Vector2 = Vector2.ZERO
@export var max_hp : int = 1000
var current_hp : int

# Get the gravity from the project settings to be synced with RigidBody nodes.
var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")

func _ready():
	current_hp = max_hp
func _process(delta):
	move_and_slide()
	updateFacingDirection()

func _physics_process(delta):
	# Add the gravity.
	if not is_on_floor():
		velocity.y += gravity * delta

	# Handle Jump.
	if Input.is_action_just_pressed("w") and is_on_floor():
		velocity.y = jump_velocity

	# Get the input direction and handle the movement/deceleration.
	# As good practice, you should replace UI actions with custom gameplay actions.
	direction = Input.get_vector("a", "d", "w", "attack")
	if direction:
		velocity.x = direction.x * speed
	else:
		velocity.x = move_toward(velocity.x, 0, speed)

func updateFacingDirection():
	if direction.x > 0:
		sprite.flip_h = false
	elif direction.x < 0:
		sprite.flip_h = true
