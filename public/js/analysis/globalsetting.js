$(function() {

	// All Checkbox click event
	$('input[type=checkbox][name*="_all"]').click(function() {
		// console.log(this.name);
		//- All을 클릭하면, 하위 아이템을 모두 클리어해줌.
		if (this.checked) {
			getCBItemObject(this.name).prop('checked', false);
		}
		getSubMessageObject(this.name).text('');
	});

	// Item Checkbox click event
	$('input[type=checkbox][name*="_item"]').click(function() {
		// console.log(this.name);
		//- 하나라도 클릭하면, All을 클리어해준다.
		if (this.checked && getCBAllObject(this.name).prop('checked')) {
			getCBAllObject(this.name).prop('checked', false);
		}
		//- 클릭에 따라 몇개를 선택했는지 타이틀 오른쪽에 표시한다.
		var str = getCheckedString(getCBItemObject(this.name));
		getSubMessageObject(this.name).text(str);
	});

	$('#saveChanges').click(function() {
		saveBGPublicSetting();
		location.reload(true); 
	});

	var resetAll = function() {
		$('input[type=checkbox][name*="_all"]').prop('checked', true);
		$('input[type=checkbox][name*="_item"]').prop('checked', false);
	};

	var getCBAllObject = function(name) {
		if (name === undefined) return null;
		return $('input[type=checkbox][name=' + name.charAt(0) + '_all]');
	};

	var getCBItemObject = function(name) {
		if (name === undefined) return null;
		return $('input[type=checkbox][name=' + name.charAt(0) + '_item]');
	};

	var getSubMessageObject = function(name) {
		if (name === undefined) return null;
		return $('#sub_message_' + name.charAt(0));
	};

	var getCheckedString = function(obj) {
		var total = 0;
		var checked = 0;
		//.each(function(_idx,_data){
		obj.each(function(_idx, _data) {
			total++;
			if (_data.checked) checked++;
		});
		if (checked === 0) return '';
		return checked + '/' + total;
	};

	var saveBGPublicSetting = function() {
		var checkeditems = [];
		$('input[type=checkbox][name*="_item"]:checked').each(function(_idx, _data) {
			// console.log(_data.name, _data.value);
			var domain = null;
			checkeditems.forEach(function(data) {
				if (data.domain === _data.name.charAt(0)) domain = data;
			});

			if (domain !== null) {
				domain.checked.push(_data.value);
			} else {

				checkeditems.push({
					domain: _data.name.charAt(0),
					checked: [_data.value],
				});
			}
		});
		// Filter Option을 저장
		bg_public.setFilterOption(checkeditems);
		// 필터링
		var filtered = bg_public.filter(checkeditems);
		// 필터링 결과 저장
		bg_public.setFiltered(filtered);

		// 좌상단 화면 갱신
		setBGPublicDataMenuStr();
	};

	// var getBGPublicSetting = function() {
	// 	// var bg_public_data = window.localStorage.getItem('bg_public_data');
	// 	var bg_public_data = $('#checkeditems').text();
	// 	console.log('getSetting', bg_public_data);
	// 	return bg_public_data;
	// };

	var setBGPublicDataMenuStr = function() {
		$('#bg_public_data_menu_str').text(bg_public.getMenuCountText());
	};

	var init = function() {
		// 메뉴 좌상단 문자열 표시 ex: (543/543)
		setBGPublicDataMenuStr();

		var options = bg_public.getFilterOption();
		console.log('options', options);
		options.forEach(function(option) {
			option.checked.forEach(function(checked){
				console.log('init:', checked);
				var obj = $('input[type=checkbox][value="' + checked + '"]');
				var name = obj.prop('name');
				getCBAllObject(name).prop('checked', false);
				obj.prop('checked', true);
				// //
				var str = getCheckedString(getCBItemObject(name));
				getSubMessageObject(name).text(str);
			});
		});
	};

	console.log('globalsetting.js : reloading');
	resetAll();
	init();
});
