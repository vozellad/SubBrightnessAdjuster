/*	
	Lowers brightness of display's colors. 
	For when the display's brightness at its lowest is still too high.

	Date created: 2021/12/26
	Date last modified: 2022/1/1
	
	Output: The extension places three elements in the gnome panel. 
		There's a decimal that shows the brightness level. 
		The default range is from 0.30 to 1.00.

		By each side are buttons. 
		The button on the left decrements, 
		and the button on the right increments.
		The buttons each have an icon that 
		is intended to resemble their behavior. 

	Input: The text showing the brightness level doesn't take input.
		The left and right button decrement and increment 
		the brightness level, respectively.
*/

'use strict'

const St = imports.gi.St
const Main = imports.ui.main
const Util = imports.misc.util
const Clutter = imports.gi.Clutter

// Show brightness amount.
let label
let labelText

// Decrement and increment buttons.
let buttonDec // Left of label.
let buttonInc // Right of label.

// Holds current brightness amount. Changes based on user input.
let currBri = 0.5

// Brightness values.
const incAmtBri = 0.05 // increment amount
const maxBri = 1
const minBri = 0.3

// Changes and outputs brightness.
// Parameter: 0 is off. 1 is full. Default is current brightness.
function applyBri(newBri = currBri) {
	// Change display color's brightness via terminal command.
	Util.spawnCommandLine("xrandr --output eDP --brightness " + newBri)

	// Formats current brightness as a string with at least 4 characters.
	let currBriStr = currBri.toString()
	
	// Makes whole numbers decimals with leading 0's to fit the format. 
	if (!currBriStr.includes("."))
		currBriStr += ".00"
	
	// Adds enough 0's to make it at least 4 characters.
	for (let i = 0; i < (4 - currBriStr.length); i++)
		currBriStr += "0"

	// Updates panel-button with current brightness value.
	labelText.text = currBriStr
}

// Decrements brightness.
function decBri() {
	// Limits range.
	// Prevents going below the min.
	if (currBri <= minBri)
		currBri = minBri
	// To be safe.
	else if (currBri > maxBri)
		currBri = maxBri
	// Decrements brightness.
	else
		currBri = parseFloat((currBri - incAmtBri).toFixed(2))

	applyBri()
}

// Increments brightness.
function incBri() {
	// Limits range.
	// To be safe.
	if (currBri < minBri)
		currBri = minBri
	// Prevents going above the max.
	else if (currBri >= maxBri)
		currBri = maxBri
	// Increments brightness.
	else
		currBri = parseFloat((currBri + incAmtBri).toFixed(2))

	applyBri()
}

function enable() {
	// Label to show brightness amount.
	label = new St.Bin({
		style_class: "panel-button"
	})
	labelText = new St.Label({
		style_class: "exchangePanelText",
		text: " N/A",
		y_align: Clutter.ActorAlign.CENTER
	})
	label.set_child(labelText)

	// Decrement and increment buttons.
	// Left of label.
	buttonDec = new St.Bin({
		style_class: 'panel-button',
		reactive: true,
		can_focus: true,
		track_hover: true
	})
	// Right of label.
	buttonInc = new St.Bin({
		style_class: 'panel-button',
		reactive: true,
		can_focus: true,
		track_hover: true
	})

	// Get button's visual appearance.
	let iconDec = new St.Icon({
		style_class: 'icon-arrow-down'
	})
	let iconInc = new St.Icon({
		style_class: 'icon-arrow-up'
	})

	// Connects icons to associated buttons.
	buttonDec.set_child(iconDec)
	buttonInc.set_child(iconInc)

	// Adds event listener for buttons.
	buttonDec.connect('button-press-event', decBri)
	buttonInc.connect('button-press-event', incBri)

	// Inserts elements in gnome panel.
	Main.panel._rightBox.insert_child_at_index(buttonInc, 0)
	Main.panel._rightBox.insert_child_at_index(label, 0)
	Main.panel._rightBox.insert_child_at_index(buttonDec, 0)

	applyBri(currBri)
}

function disable() {
	// Removes elements in gnome panel. 
	Main.panel._rightBox.remove_child(buttonDec)
	Main.panel._rightBox.remove_child(label)
	Main.panel._rightBox.remove_child(buttonInc)
	
	// Resets display's brightness.
	applyBri(1)
}
