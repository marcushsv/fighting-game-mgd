extends TextureProgressBar

var player_hp



func _ready():
	player_hp = get_parent().get("health")
	set_value_no_signal(player_hp)
