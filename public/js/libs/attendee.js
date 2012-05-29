$(function(){ 

var Attendee = Backbone.Model.extend({
	defaults: function() {
		return {
			name: '',
			classes: [],
			paid: 'cash',
			role: 'lead'
		};
	},
	
	classes_attended: function() {
		return this.get('classes').length;
	}
	
});

var ClassList = Backbone.Collection.extend({
	model: Attendee,
	
	localStorage: new Store('swing_take_backbone'),
	
	student_data: function() {
		return {};//TODO: return an object the model calculator can use
	}
});

var SwingEvent = new ClassList;

var AttendeeView = Backbone.View.extend({

	tagName: 'tr',

	template: _.template($('#attendee_template').html()),
	
	events: {
		'click .delete'  : "clear",
		'keypress .name' : 'newOnEnter'
	},
	
	initialize: function() {
		this.model.bind('change', this.render, this);
		this.model.bind('destroy', this.remove, this);
	},
	
	render : function(){
		this.$el.html(this.template($.extend({}, this.model.toJSON(), {cid: this.model.cid})));
		return this;
	},
	
	clear : function(){
		this.model.clear();
	},
	
	newOnEnter: function(e){
		if(e.keyCode == 13){
			SwingEvent.create();
		}
	}
});

var AppView = Backbone.View.extend({
	
	el: $("#attendance_records"),
	
	events: {
		
	},
	
	initialize: function() {
		SwingEvent.bind('add', this.addOne, this);
		SwingEvent.bind('all', this.render, this);
		SwingEvent.bind('reset', this.addAll, this);
		
		SwingEvent.add(new Attendee());
	},
	
	render: function(){
		
	},
	
	addOne: function(attendee) {
		var view = new AttendeeView({model: attendee});
		this.$el.append(view.render().el);
	},
	
	addAll: function(){
		SwingEvent.each(this.addOne);
	}
});

var App = new AppView;


});