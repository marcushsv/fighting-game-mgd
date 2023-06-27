extends Node2D


# Called when the node enters the scene tree for the first time.
func _ready():
	gameovertext()



func gameovertext():
	$RichTextLabel.add_text(GlobalVars.winner + " has won the game!")
