// TODO:
// 	allow user to change min and max
//	comments
//  allow user to set keyboard shortcuts for two buttons
//  allow option to enable nightlight

'use strict'
const St = imports.gi.St
const Main = imports.ui.main
const Util = imports.misc.util
const Clutter = imports.gi.Clutter
let panelButton, panelButtonText
let buttonDec, buttonInc
const initBri = 0.5
let currBri = initBri // would make not global, but I'm having trouble 
					  // passing parameters to lambdas

// makes sure currbri string length is at least 4
function getBriStrFormatted() {
	let currBriStr = currBri.toString()

	if (!currBriStr.includes("."))
		currBriStr += ".00"

	for (let i = 0; i < (4 - currBriStr.length); i++)
		currBriStr += "0"

	return currBriStr
}

// don't know how to do lambda with parameter, so I made two functions
function changeBri2() {
	Util.spawnCommandLine("xrandr --output eDP --brightness " + currBri)
	panelButtonText.text = getBriStrFormatted()
}
function changeBriDec() {
	if (currBri <= 0.3)
		currBri = 0.3
	else if (currBri > 1)
		currBri = 1
	else
	{
		currBri += -0.05
		currBri = parseFloat(currBri.toFixed(2))
	}

	changeBri2()
}
function changeBriInc() {
	if (currBri < 0.3)
		currBri = 0.3
	else if (currBri >= 1)
		currBri = 1
	else
	{
		currBri += 0.05
		currBri = parseFloat(currBri.toFixed(2))
	}

	changeBri2()
}

function init() {
	// code for when users want it to be reset every time it's enabled
	// currBri = initBri 
	Util.spawnCommandLine("xrandr --output eDP --brightness " + currBri)

	panelButton = new St.Bin({
		style_class: "panel-button"
	})
	panelButtonText = new St.Label({
		style_class: "exchangePanelText",
		text: getBriStrFormatted() + "  test",
		y_align: Clutter.ActorAlign.CENTER
	})
	panelButton.set_child(panelButtonText)

	buttonDec = new St.Bin({
		style_class: 'panel-button',
		reactive: true,
		can_focus: true,
		track_hover: true
	})
	buttonInc = new St.Bin({
		style_class: 'panel-button',
		reactive: true,
		can_focus: true,
		track_hover: true
	})

	let iconL = new St.Icon({
		style_class: 'icon-arrow-down'
	})
	let iconR = new St.Icon({
		style_class: 'icon-arrow-up'
	})

	buttonDec.set_child(iconL)
	buttonDec.connect('button-press-event', changeBriDec)
	buttonInc.set_child(iconR)
	buttonInc.connect('button-press-event', changeBriInc)
}

function enable() {
	Main.panel._rightBox.insert_child_at_index(buttonInc, 0)
	Main.panel._rightBox.insert_child_at_index(panelButton, 0)
	Main.panel._rightBox.insert_child_at_index(buttonDec, 0)

	// code for when users want it to be reset every time it's enabled
	// currBri = initBri 
	Util.spawnCommandLine("xrandr --output eDP --brightness " + currBri)
	panelButtonText.text = getBriStrFormatted()
}

function disable() {
	Main.panel._rightBox.remove_child(buttonDec)
	Main.panel._rightBox.remove_child(panelButton)
	Main.panel._rightBox.remove_child(buttonInc)
	
	Util.spawnCommandLine("xrandr --output eDP --brightness " + 1)
}
