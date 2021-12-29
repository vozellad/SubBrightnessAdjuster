const GObject = imports.gi.GObject
const Gtk = imports.gi.Gtk

function init() {}

function buildPrefsWidget() {
	let widget = new MyPrefsWidget()
	widget.show_all()
	return widget
}

const MyPrefsWidget = new GObject.Class({
	
	Name: "My.Prefs.Widget",
	GTypeName: "MyPrefsWidget",
	Extends: Gtk.Box,

	_init: function (params) {

		this.parent(params)
		this.margin = 20
		this.set_spacing(15)
		this.set_orientation(Gtk.Orientation.VERTICAL)

		// Setting for minimum brightness allowed.
		let labelMin = new Gtk.Label({
			label: "Minimum amount:"
		})

		let spinButtonMin = new Gtk.SpinButton()
		spinButtonMin.set_sensitive(true)
		spinButtonMin.set_range(-60, 60)
		spinButtonMin.set_value(0)
		spinButtonMin.set_increments(1, 2)

		spinButtonMin.connect("value-changed", function (w) {
			log( w.get_value_as_int() )
		})

		let hBoxMin = new Gtk.Box()
		hBoxMin.set_orientation(Gtk.Orientation.HORIZONTAL)

		hBoxMin.pack_start(labelMin, false, false, 0)
		hBoxMin.pack_end(spinButtonMin, false, false, 0)

		this.add(hBoxMin)
		
		// Setting for maximum brightness allowed.
		let labelMax = new Gtk.Label({
			label: "Maximum amount:"
		})

		let spinButtonMax = new Gtk.SpinButton()
		spinButtonMax.set_sensitive(true)
		spinButtonMax.set_range(-60, 60)
		spinButtonMax.set_value(0)
		spinButtonMax.set_increments(1, 2)

		spinButtonMax.connect("value-changed", function (w) {
			log( w.get_value_as_int() )
		})

		let hBoxMax = new Gtk.Box()
		hBoxMax.set_orientation(Gtk.Orientation.HORIZONTAL)

		hBoxMax.pack_start(labelMax, false, false, 0)
		hBoxMax.pack_end(spinButtonMax, false, false, 0)

		this.add(hBoxMax)

		// Label for recommendation.
		let labelRec = new Gtk.Label({
			label: "(Between 0 and 1 recommended.)"
		})

		let hBoxRec = new Gtk.Box()
		hBoxRec.set_orientation(Gtk.Orientation.HORIZONTAL)

		hBoxRec.pack_start(labelRec, true, false, 0)

		this.add(hBoxRec)

		// Setting for increment amount.

		// Button to reset settings.
		let labelReset = new Gtk.Label({
			label: "Reset values."
		})

		let buttonReset = new Gtk.Button()
		buttonReset.set_sensitive(true)
		buttonReset.set_range(-60, 60)
		buttonReset.set_value(0)

		buttonReset.connect("value-changed", function (w) {
			log( w.get_value_as_int() )
		})

		let hBoxReset = new Gtk.Box()
		hBoxReset.set_orientation(Gtk.Orientation.HORIZONTAL)

		hBoxReset.pack_start(labelReset, false, false, 0)
		hBoxReset.pack_end(buttonReset, false, false, 0)

		this.add(hBoxReset)

		// Button to allow nightlight.

	}
})