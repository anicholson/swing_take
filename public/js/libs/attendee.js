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
		return _.reduce(this.get('classes'), function(memo, c){ return (c ? memo + 1 : memo); }, 0);
	},
	
	attendance_data: function() {
		return {
			name: this.get('name'),
			classes_taken: this.classes_attended(),
			payment_method: this.get('paid')
		};
	},
	
	counts_for_rent: function(){
		var p = this.get('paid');
		if(this.classes_attended() == 0) {
			return false;
		}
		return (p == 'cash' || p == 'prepaid');
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
	
	retrieve_info: function(student) {
		var x = student.attendance_data();
		return x;
	},
	
	student_data: function() {
		return {
			
			students: this.map(this.retrieve_info),
			
			attendance: this.filter(function(s) {return s.counts_for_rent() == true;}).length,
			
			teachers: {
				teacher_1: "Teacher 1",
				teacher_2: "Teacher 2",
				strategy: 'normal'
			},
			
			rent: {
				amount : 3.00,
				strategy: 'prorata'
			}
		};
	}
});

var SwingEvent = Backbone.View.extend({
	template: _.template($('#running_sheet_template').html()),
	el: '#running_sheet',
	
	defaults: function(){

	},
	
	initialize: function(options) {
		this.class_list = options.class_list;
		this.rule_set = options.rule_set;
		
		this.class_list.bind('change', this.render, this);
		this.render();
	},
	
	numberCrunch : function(classes) {
		return classes.student_data();
	},
	
	render: function() {
		var new_results = this.numberCrunch(this.class_list);

		console.log("student data", new_results);
		var output = this.rule_set.money_model(new_results);
		console.log("output data", output);
		
		this.$el.html(this.template(output));

	}
	
	
});

var AttendeeView = Backbone.View.extend({

	tagName: 'tr',

	template: _.template($('#attendee_template').html()),	
	
	events: {
		'click .delete'  : "clear",
		'keypress .name' : 'newOnEnter',
		'change .attribute': 'updateModel'
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

		var classes = $.map(['#l1', '#l2', '#l3', '#soc'], function(i) {
			return $(i + '_' + c).prop('checked');
		});
		
		console.log(classes);

		m.save({
			name: $('#name_' + c).val(),
			paid: $('#paid_' + c).val(),
			role: $('#lf_' + c).val(),
			classes: classes
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

var SwingClassList = new ClassList;
var RunningSheet   = new SwingEvent({class_list: SwingClassList, rule_set: new SwingModel});


var AppView = Backbone.View.extend({
	
	el: $("#attendance_records"),
	
	events: {
		
	},
	
	students: SwingClassList,
	running_sheet: RunningSheet,
	
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

SwingClassList.fetch();

if(SwingClassList.length == 0) {
	SwingClassList.add(new Attendee());
}

});