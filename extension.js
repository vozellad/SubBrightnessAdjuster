// TODO:
//	

/*	UNFINISHED
	Lowers brightness of display's colors. 
	For when the display's brightness at its lowest is still too high.

	Date created: 2021/12/26
	Date last modified: 2021/12/29
	
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

	If you're wondering why there are so many comments, 
	it's how I was taught in school, 
	and I don't yet know how to scale it down 
	without failing to explain things I need to.
*/

'use strict'
const St = imports.gi.St
const Main = imports.ui.main
const Util = imports.misc.util
const Clutter = imports.gi.Clutter

// Label to show brightness amount
let panelButton, panelButtonText
// Decrement and increment buttons 
// on each side of the brightness amount.
let buttonDec, buttonInc
// Initial brightness amount 
// when extension starts(different from enabled).
const initBri = 0.5
// Holds current brightness amount. Changes based on user input.
let currBri = initBri // would make not global, but I'm having trouble 
					  // passing parameters to lambdas
	// Maybe shouldn't be global, but I don't really know yet.

// Function that calls function to make terminal command. 
// 0 is off, 1 is default.
// Command sets display's brightness at given amount. 
function setBri(currBri) {
	Util.spawnCommandLine("xrandr --output eDP --brightness " + currBri)
}

// Formats current brightness as a string with at least 4 characters.
function getBriStrFormatted() {
	let currBriStr = currBri.toString()

	// Makes whole numbers decimals with leading 0's to fit the format. 
	if (!currBriStr.includes("."))
		currBriStr += ".00"

	// Adds 0's until str is 4 characters   unless str length is >= 4
	for (let i = 0; i < (4 - currBriStr.length); i++)
		currBriStr += "0"

	return currBriStr
}

// don't know how to do lambda with parameter, so I made two functions.
// trying to reduce repetition by having this function 
// be used by both changeBri functions. I feel like it's not worth it.
// Idk. I'm learning. 
// Sets and outputs brightness.
function setAndOutBri() {
	setBri(currBri)
	panelButtonText.text = getBriStrFormatted()
}
// Decrements brightness.
function changeBriDec() {
	// Limits range.
	if (currBri <= 0.3)
		// Sets number to min to disallow going below the min.
		currBri = 0.3
	// Decrementing, but just in case it's over the max.
	else if (currBri > 1)
		currBri = 1
	// Decrements brightness by the intended amount.
	else
	{
		currBri -= 0.05
		currBri = parseFloat(currBri.toFixed(2))
	}

	setAndOutBri()
}
// Increments brightness.
function changeBriInc() {
	// Limits range.
	// Increments, but just in case it's below the min.
	if (currBri < 0.3)
		currBri = 0.3
	else if (currBri >= 1)
		// Sets number to max to disallow going above the max.
		currBri = 1
	// Increments brightness by the intended amount.
	else
	{
		currBri += 0.05
		currBri = parseFloat(currBri.toFixed(2))
	}

	setAndOutBri()
}

function init() {
	// code if users want it to be reset every time it's enabled
	// currBri = initBri 
	setBri(currBri)

	// Label to show brightness amount.
	panelButton = new St.Bin({
		style_class: "panel-button"
	})
	panelButtonText = new St.Label({
		style_class: "exchangePanelText",
		text: getBriStrFormatted(),
		y_align: Clutter.ActorAlign.CENTER
	})
	panelButton.set_child(panelButtonText)

	// Decrement and increment buttons 
	// on each side of the brightness amount.
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

	// Get button's visual appearance.
	let iconL = new St.Icon({
		style_class: 'icon-arrow-down'
	})
	let iconR = new St.Icon({
		style_class: 'icon-arrow-up'
	})

	// Connects icons to associated buttons.
	buttonDec.set_child(iconL)
	buttonInc.set_child(iconR)

	// Adds event listener for buttons.
	buttonDec.connect('button-press-event', changeBriDec)
	buttonInc.connect('button-press-event', changeBriInc)
}

function enable() {
	// Inserts elements in the gnome panel. 
	// Elements get added to the left since the elements in the gnome 
	// panel are right justified, so the left-most element is the 
	// bottom one written in code. 
	Main.panel._rightBox.insert_child_at_index(buttonInc, 0)
	Main.panel._rightBox.insert_child_at_index(panelButton, 0)
	Main.panel._rightBox.insert_child_at_index(buttonDec, 0)

	setAndOutBri(currBri)
}

function disable() {
	// Removes elements in gnome panel. 
	Main.panel._rightBox.remove_child(buttonDec)
	Main.panel._rightBox.remove_child(panelButton)
	Main.panel._rightBox.remove_child(buttonInc)
	
	// Resets display's brightness.
	setBri(1)
}
