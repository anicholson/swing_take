var SwingModel = Backbone.Model.extend({


calculate_attendance: function(inputs) {
	if(!inputs) {
		return 0;
	} else if(!inputs.students){
		return 0;
	} else {
		try {
			var a = inputs.students.length;
			return a;
		} catch(e) {
			console.log("Students info garbled or incorrect: ", inputs.students);
			return 0;
		}
	}
},

calculate_cash_takings: function(inputs) {
	var class_costs = [6.0, 15.0, 22.0, 30.0];

	var attendance = inputs.students;

	if(!attendance) {
		return 0.0;
	}

	return $.map(attendance, function(student, i){
		if(student.payment_method == 'cash') {
			return class_costs[student.classes_taken];   
		} else {
			return 0.0;
		}
	}).reduce(function(accum, val){
		return accum + val;
	}, 0.0);
},

calculate_prepaid_revenue: function(inputs) {
	var class_costs = [0.0, 13.0, 19.0, 26.0];

	var attendance = inputs.students;
	if(!attendance) {
		return 0.0;
	}

	return $.map(attendance, function(student, i) {
		if(student.payment_method == 'prepaid') {
			return class_costs[student.classes_taken];
		} else {
			return 0.0;
		}
	}).reduce(function(accum, val) {return accum + val;}, 0.0);
},

calculate_rent_payment: function(inputs) {
	var rent = inputs.rent;
	var attendance = inputs.attendance;

	//default to fixed rental strategy if not specified
  if (!rent.strategy) {
		return rent.amount;
  } else if (rent.strategy == 'prorata') {
		if(!attendance) {
			return 0.0;
		} else {
			return (rent.amount * attendance);
		}
	} else {
		return rent.amount;
	}
},

calculate_door_payment: function(inputs) {
	if(inputs.door_amount){
		return inputs.door_amount;
	} else {
		return 0.0;
	}
},

calculate_host_payment: function(net_revenue, pp_revenue) {
	return Math.floor((net_revenue / 2.0)) - pp_revenue;
},

calculate_teacher_payment: function(inputs, start) {
	var teacher_info = inputs.teachers;

  //assume 50-50 if not spelt out
  if(!teacher_info) {
		teacher_info = {};
	}

  if(!teacher_info.strategy) {
		teacher_info.strategy = 'normal';
  }

	if(teacher_info.strategy == 'cadet') {
		var t1 = Math.floor(start * 0.7);
		var t2 = start - t1;
		return [{
			name: teacher_info.teacher_1,
			pay: t1
		}, {
			name: teacher_info.teacher_2,
			pay: t2
		}];
	} else {
		var t1 = Math.floor(start / 2.0);
		var t2 = start - t1;
		return [{
			name: teacher_info.teacher_1,
			pay: t1
		}, {
			name: teacher_info.teacher_2,
			pay: t2
		}];
	}
}
});

SwingModel = SwingModel.extend({
	money_model: function(input_data) {

		var cash_revenue = this.calculate_cash_takings(input_data),
		    pp_revenue   = this.calculate_prepaid_revenue(input_data),
		    gross_revenue= cash_revenue + pp_revenue;

		var rent         = this.calculate_rent_payment(input_data),
		    door         = this.calculate_door_payment(input_data),
		    net_revenue  = gross_revenue - (rent + door);

		var host_payment = this.calculate_host_payment(net_revenue, pp_revenue);
		var teachers_pay = this.calculate_teacher_payment(input_data, (net_revenue - host_payment - pp_revenue));

		return {
			cash_takings: cash_revenue,
			prepaid_takings: pp_revenue,
			net_revenue: net_revenue,
			attendance: input_data.attendance,
			rent: rent,
			door: door,
			host: host_payment,
			teachers: teachers_pay
		};
	}
})