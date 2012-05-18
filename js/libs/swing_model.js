function calculate_attendance(inputs) {
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
}

function calculate_cash_takings(inputs) {
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
	});
}

function calculate_prepaid_revenue(inputs) {
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
	}).reduce(function(accum, val) {return accum + val;});
}

function calculate_rent_payment(inputs) {
	var rent = inputs.rent;
	var attendance = calculate_attendance(inputs);

	//default to fixed rental strategy if not specified
  if (!rent.strategy) {
		return rent.amount;
  } else if (rent.strategy == 'prorata') {
		return (rent.amount * attendance);
	} else {
		return rent.amount;
	}
}

function calculate_door_payment(inputs) {
	if(inputs.door_amount){
		return inputs.door_amount;
	} else {
		return 0.0;
	}
}

function calculate_host_payment(net_revenue, pp_revenue) {
	return Math.floor((net_revenue / 2.0)) - pp_revenue;
}

function calculate_teacher_payment(inputs, start) {
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

function money_model(input_data) {
	
	var cash_revenue = calculate_cash_takings(input_data),
	    pp_revenue   = calculate_prepaid_revenue(input_data),
	    gross_revenue= cash_revenue + pp_revenue;

	var rent         = calculate_rent_payment(input_data),
	    door         = calculate_door_payment(input_data),
	    net_revenue  = gross_revenue - (rent + door);

	var host_payment = calculate_host_payment(net_revenue, pp_revenue);
	var teachers_pay = calculate_teacher_payment(input_data, (net_revenue - host_payment - pp_revenue));

	return {
		cash_takings: cash_revenue,
		prepaid_takings: pp_revenue,
		net_revenue: net_revenue,
		attendance: calculate_attendance(input_data),
		rent: rent,
		door: door,
		host: host_payment,
		teachers: teachers_pay
	};
}
