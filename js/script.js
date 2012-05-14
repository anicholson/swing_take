/* Author:

*/

function update_money_state(attendance_info) {
	var cash_float       = $('#start_amount_ph'),
	    cash_revenue     = $('#cash_revenue_ph'),
	    prepaid_revenue  = $('#prepaid_revenue_ph'),
	    gross_revenue    = $('#gross_revenue_ph'),
	    rental_cost      = $('#rental_ph'),
	    door_cost        = $('#door_ph');
	    
}

function calculate_cash_takings(inputs) {
	var class_costs = [6.0, 15.0, 22.0, 29.0];
	
	var attendance = inputs.students;
	
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
	
	if (rent.strategy == 'fixed') {
		return rent.amount;
	} else {
		return (rent.amount * attendance);
	}
}

function calculate_door_payment(inputs) {
	return inputs.door_amount;
}

function calculate_host_payment(net_revenue, pp_revenue) {
	return (net_revenue / 2.0) - pp_revenue;
}

function calculate_teacher_payment(inputs, net_revenue) {
	var teacher_info = inputs.teachers;
	
	if(teacher_info.strategy == 'cadet') {
		return [{
			name: teacher_info.teacher_1,
			pay: (net_revenue / 2) * 0.7;
		}, {
			name: teacher_info.teacher_2,
			pay: (net_revenue / 2) * 0.3;
		}];
	} else {
		return [{
			name: teacher_info.teacher_1,
			pay: (net_revenue / 4);
		}, {
			name: teacher_info.teacher_2,
			pay: (net_revenue / 4);
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


$(document).ready(function(){
	//When the input values change, cascade the changes through
	$('#start_amount').on('keyup', function(event){
		$('#start_amount_ph').html($(this).val());
	});
	
	
	
});



