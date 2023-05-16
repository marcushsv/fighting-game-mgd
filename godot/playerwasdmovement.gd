extends CharacterBody2D


@export var speed : float  = 300.0
@export var jump_velocity : float = -400.0
<<<<<<< HEAD
@onready var sprite : AnimatedSprite2D = $AnimatedSprite2D
var direction : Vector2 = Vector2.ZERO
var state_machine
=======
@onready var sprite : Sprite2D = $playersheets
var animation_locked : bool = false
var direction : Vector2 = Vector2.ZERO
@export var max_hp : int = 1000
var current_hp : int
>>>>>>> master

# Get the gravity from the project settings to be synced with RigidBody nodes.
var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")

func _ready():
<<<<<<< HEAD
	state_machine = $AnimationTree.get("parameters/playback")

=======
	current_hp = max_hp
func _process(delta):
	move_and_slide()
	updateFacingDirection()
>>>>>>> master

func _physics_process(delta):
	# Add the gravity.
	if not is_on_floor():
		velocity.y += gravity * delta

	if Input.is_action_just_pressed("w") and is_on_floor():
		velocity.y = jump_velocity
<<<<<<< HEAD
		
	if Input.is_action_just_pressed("space"):
		attack()
	
	direction = Input.get_vector("a", "d", "w", "s")
=======

	# Get the input direction and handle the movement/deceleration.
	# As good practice, you should replace UI actions with custom gameplay actions.
	direction = Input.get_vector("a", "d", "w", "attack")
>>>>>>> master
	if direction:
		velocity.x = direction.x * speed
	else:
		velocity.x = move_toward(velocity.x, 0, speed)

<<<<<<< HEAD
	move_and_slide()
	updateFacingDirection()

=======
>>>>>>> master
func updateFacingDirection():
	if direction.x > 0:
		sprite.flip_h = false
	elif direction.x < 0:
		sprite.flip_h = true
<<<<<<< HEAD

func attack():
	state_machine.travel("slasher")

func _on_sword_hit_area_entered(area):
	if area.is_in_group("hurtbox"):
		area.take_damage()
=======
>>>>>>> master
