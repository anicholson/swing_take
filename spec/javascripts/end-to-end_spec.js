describe('swing model', function(){
	var set1 = {
		teachers : {
			teacher_1: 'Jack',
			teacher_2: 'Jill',
			strategy : 'normal'
		},

		students : [
			 {classes_taken: 1, payment_method: 'prepaid'},
			 {classes_taken: 2, payment_method: 'prepaid'},
			 {classes_taken: 3, payment_method: 'prepaid'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 2, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 2, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 2, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 2, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 2, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 2, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 2, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'}
		],
		
		rent : {
			amount : 100.00,
			strategy: 'fixed'
		}
	};

	var set2 = {
		teachers : {
			teacher_1: 'Jack',
			teacher_2: 'Jill',
			strategy : 'cadet'
		},

		students : [
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 2, payment_method: 'cash'},
			 {classes_taken: 3, payment_method: 'cash'},
			 {classes_taken: 2, payment_method: 'prepaid'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 2, payment_method: 'cash'},
		],

		rent : {
			amount : 3.00,
			strategy : 'prorata'
		}
	};
	
	it('', function() {
		console.log(money_model(set1));
		console.log(money_model(set2));
	})
});