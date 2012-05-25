var cash = {
	teachers : {
		teacher_1: 'Jack',
		teacher_2: 'Jill',
		strategy : 'normal'
	},
	
	students : [
		 {classes_taken: 1, payment_method: 'cash'},
		 {classes_taken: 2, payment_method: 'cash'},
		 {classes_taken: 3, payment_method: 'cash'}
	],
	
	attendance: 3,
	
	rent: {
		amount: 50.00,
		strategy: 'fixed'
	},
	
	door_amount: 20.00
};

var prepaid = {
	teachers : {
		teacher_1: 'Jack',
		teacher_2: 'Jill',
		strategy : 'normal'
	},

	students : [
		 {classes_taken: 1, payment_method: 'prepaid'},
		 {classes_taken: 2, payment_method: 'prepaid'},
		 {classes_taken: 3, payment_method: 'prepaid'}
	],

	attendance: 3
};

var cadet = {
	teachers : {
		teacher_1: 'Jack',
		teacher_2: 'Jill',
		strategy : 'cadet'
	},
	
	students : [
		 {classes_taken: 1, payment_method: 'cash'},
		 {classes_taken: 2, payment_method: 'cash'},
		 {classes_taken: 3, payment_method: 'cash'}
	],

	attendance: 3,

	rent : {
		amount : 3.00,
		strategy : 'prorata'
	}
};

var model = new SwingModel;

describe('cash revenue', function(){
	it('should be zero with no students', function(){
		expect(model.calculate_cash_takings({})).toBe(0);
	});
	
	it('should not include prepaid revenue', function() {
		expect(model.calculate_cash_takings(prepaid)).toBe(0);
	});
	
	it('should charge students according to the $15/$22/$30 model', function() {
		expect(model.calculate_cash_takings(cash)).toBe(67.0);
	});
});

describe('prepaid revenue', function(){
	it('should be zero with no students', function() {
		expect(model.calculate_prepaid_revenue({})).toBe(0);
	});
	
	it('should not include cash revenue', function() {
		expect(model.calculate_prepaid_revenue(cash)).toBe(0);
	});
	
	it('should charge students according to the $13/19/26 model', function() {
		expect(model.calculate_prepaid_revenue(prepaid)).toBe(58.0);
	});
});

describe('rental payments', function(){
	describe('flat-rate rental', function() {
		it('should be exactly the amount specified in the input', function() {
			expect(model.calculate_rent_payment(cash)).toBe(cash.rent.amount);
		});
		
		it('should be paid with no students', function() {
			expect(model.calculate_rent_payment({rent: {amount: 100.00, strategy: 'fixed'}})).toBe(100.00);
		});
	});

  describe('pro-rata rental', function() {
		it('should be the rate multiplied by the number of paying students', function() {
			expect(model.calculate_rent_payment(cadet)).toBe(9.00);
		});
	});
});

describe('door payment', function() {
	it('should be exactly the amount specified in the input', function() {
		expect(model.calculate_door_payment(cash)).toBe(cash.door_amount);
	});
	
	it('should not be made with no students', function() {
		expect(model.calculate_door_payment({})).toBe(0.00);
	});
})

describe("swing patrol's take", function() {

	it("should be 50% of net revenue", function(){
		expect(model.calculate_host_payment(100, 0)).toBe(50.0);
	});

	it("should have prepaid revenue deducted", function() {
		expect(model.calculate_host_payment(100, 13)).toBe(37.0);
	});
});

describe("teachers' take", function() {

	it("should equal 50% of net revenue", function(){
		var net_revenue = 100.00;
		teachers = model.calculate_teacher_payment(cash, net_revenue / 2.0);
		expect(teachers[0].pay + teachers[1].pay).toEqual(50.00);
	});

	it("should be a 50/50 split under normal circumstances", function(){
		teachers = model.calculate_teacher_payment(cash, 100.00);
		expect(teachers[0].pay).toEqual(teachers[1].pay);
	});

	it("should be a 70/30 split in a cadet scenario", function() {
		teachers = model.calculate_teacher_payment(cadet, 50.00);
		expect(teachers[0].pay + teachers[1].pay).toEqual(50.00);
		expect(teachers[0].pay).toBeGreaterThan(teachers[1].pay);
	});
});
