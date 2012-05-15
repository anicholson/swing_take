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
	var attendance = inputs.attendance;
	if(!attendance && inputs.students) {
		attendance = inputs.students.length;
	}

	if(!attendance) {
		attendance = 0;
	}

	if (rent.strategy == 'fixed') {
		return rent.amount;
	} else {
		return (rent.amount * attendance);
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
	return (net_revenue / 2.0) - pp_revenue;
}

function calculate_teacher_payment(inputs, net_revenue) {
	var teacher_info = inputs.teachers;

	if(teacher_info.strategy == 'cadet') {
		return [{
			name: teacher_info.teacher_1,
			pay: (net_revenue / 2) * 0.7
		}, {
			name: teacher_info.teacher_2,
			pay: (net_revenue / 2) * 0.3
		}];
	} else {
		return [{
			name: teacher_info.teacher_1,
			pay: (net_revenue / 4)
		}, {
			name: teacher_info.teacher_2,
			pay: (net_revenue / 4)
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

	var host_payment = calculate_host_payment(net_revenue, pp_revenue),
	    teachers_pay = calculate_teacher_payment(input_data, net_revenue);

	return {
		rent: rent,
		door: door,
		host: host_payment,
		teachers: teachers_pay
	};
}
