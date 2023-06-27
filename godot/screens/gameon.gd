extends Node



var seconds=0
var Dseconds=90

func _ready():
	$Camera2D.add_target($playerarrows)
	$Camera2D.add_target($playerwasd)
	reset_timer()

func reset_timer():
	seconds=Dseconds


func _on_gametimer_timeout():
	if seconds == 1:
		GlobalVars.setwinner_draw()
		get_tree().change_scene_to_file("res://screens/gameover.tscn")
	seconds -= 1
	$GametimerText.text= "Time: " + str(seconds)
