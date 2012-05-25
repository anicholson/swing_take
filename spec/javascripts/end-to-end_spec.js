describe('swing model', function(){
	
	var model = new SwingModel;
	
	var set1 = {
		teachers : {
			teacher_1: 'Jack',
			teacher_2: 'Jill',
			strategy : 'normal'
		},

		students : [
			 {classes_taken: 1, payment_method: 'prepaid'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'}
		],

		attendance: 11,

		rent : {
			amount : 23.00,
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
			 {classes_taken: 1, payment_method: 'cash'},
			 {classes_taken: 2, payment_method: 'cash'},
			 {classes_taken: 2, payment_method: 'cash'},
			 {classes_taken: 1, payment_method: 'cash'}
		],

		attendance: 10,

		door_amount: 10.0,

		rent : {
			amount : 3.00,
			strategy : 'prorata'
		}
	};

	it('should return a correct set of results for input set 1', function() {
		console.log(model);
		var m1 = model.money_model(set1);
		expect(m1.cash_takings).toBe(150.00);
		expect(m1.prepaid_takings).toBe(13.00);
		expect(m1.net_revenue).toBe(140.00);
		expect(m1.attendance).toBe(11);
		expect(m1.rent).toBe(23.00);
		expect(m1.door).toBe(0.00);
		expect(m1.host).toBe(57.00);
		expect(m1.teachers[0].pay).toBe(35.00);
		expect(m1.teachers[1].pay).toBe(35.00);
	});

	it('should return a correct set of results for input set 2', function() {
		var m2 = model.money_model(set2);
		expect(m2.cash_takings).toBe(178.00);
		expect(m2.prepaid_takings).toBe(19.00);
		expect(m2.net_revenue).toBe(157.00);
		expect(m2.attendance).toBe(10);
		expect(m2.rent).toBe(30.00);
		expect(m2.door).toBe(10.00);
		expect(m2.host).toBe(59);
		expect(m2.teachers[0].pay).toBe(55);
		expect(m2.teachers[1].pay).toBe(24);
	});

});