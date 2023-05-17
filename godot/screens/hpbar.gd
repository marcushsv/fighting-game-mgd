extends Node

var bar1
var bar2
var player1
var player2


func _ready():
	$hp_player1.set_value_no_signal(5)
	bar2 = $hp_player2.value
	player1 = $"player1(wasd)".current_hp
	player2 = $"player2(arrows)".current_hp
	
func _process(delta):
	bar1 = 5.0
	bar2 = player2
