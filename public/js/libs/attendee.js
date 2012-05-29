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

//Functions for Attendee manipulation...
function roles_for_rendering(model) {
	var roles = ['lead', 'follow'];
	
	return _.map(roles, function(role){
		var selected = !!(model.get('role') == role);
		return [role, selected]; 
	});
};

function payment_types_for_rendering(model) {
	var pays = ['cash', 'prepaid','free'];
	
	return _.map(pays, function(pay){
		var selected = !!(model.get('paid') == pay);
		return [pay, selected];
	});
};

function render_data(model) {
	return $.extend({}, model.toJSON(), {roles: roles_for_rendering(model), pays: payment_types_for_rendering(model), cid: model.cid});
};


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
		'keypress .name' : 'newOnEnter',
		'blur .attribute': 'updateModel'
	},
	
	initialize: function() {
		this.model.bind('create', this.render, this);
		this.model.bind('change', this.updateView, this);
		this.model.bind('destroy', this.close, this);
		this.attributes.parentCollection.bind('remove', this.personRemoved, this);
	},
	
	personRemoved: function(person) {
		console.log("Someone tried to delete a person. Is it", this.model, "?");
		if(person === this.model){
			person.destroy();
		}
		
		if(this.attributes.parentCollection.length == 0) {
			this.attributes.parentCollection.add(new Attendee());
		}
	},
	
	render : function(){
		this.$el.html(this.template(render_data(this.model)));
		return this;
	},
	
	clear : function(){
		this.attributes.parentCollection.remove(this.model);
	},
	
	onClose : function() {
		this.model.unbind('create', this.render);
		this.model.unbind('change', this.updateView);
		this.model.unbind('destroy', this.close);
		this.attributes.parentCollection.unbind('remove', this.personRemoved, this);
	},
	
	updateModel: function() {
		var c = this.model.cid,
		    m = this.model;

		m.save({
			name: $('#name_' + c).val(),
			paid: $('#paid_' + c).val(),
			role: $('#lf_' + c).val()
		});
	},
	
	updateView: function() {
		var c = this.model.cid,
        m = this.model;

		$('#name_' + c).val(m.get('name'));
		$('#paid_' + c).val(m.get('paid'));
		$('#lf_' + c).val(m.get('role'));
	},

	newOnEnter: function(e){
		if(e.keyCode == 13){
			this.updateModel();
			this.attributes.parentCollection.create();
		}
	}
});

var AppView = Backbone.View.extend({
	
	el: $("#attendance_records"),
	
	events: {
		
	},
	
	students: SwingEvent,
	
	initialize: function() {
		this.students.bind('add', this.addOne, this);
		this.students.bind('all', this.render, this);
		this.students.bind('reset', this.addAll, this);
	},
	
	render: function(){
		
	},
	
	addOne: function(attendee) {
		var view = new AttendeeView({model: attendee, attributes: {parentCollection: this.students}});
		this.$el.append(view.render().el);
		view.updateView();
	},
	
	addAll: function(){
		this.students.each(this.addOne, this);
	}
});

var App = new AppView;

SwingEvent.fetch();

if(SwingEvent.length == 0) {
	SwingEvent.add(new Attendee());
}

});