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



$(document).ready(function(){
	//When the input values change, cascade the changes through
	$('#start_amount').on('keyup', function(event){
		$('#start_amount_ph').html($(this).val());
	});



});
