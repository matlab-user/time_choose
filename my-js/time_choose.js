/*
	site[] . id
			. department
			. campus
			. room
			. close_t -- [ [st1, et1], [st2, et2].. ]
			. occ_info[]. date -- year/mon/day							// 每个occ_info[]代表一天
						. usage_t -- [[st1, et1],[st2, et2],...]     	// 占用时间
						. choosed
*/
var site = new Array();
site[0] = new Object();
site[0].close_t = [[0,8],[22,23]];
site[0].occ_info = [];
site[0].occ_info[0] = new Object();
site[0].occ_info[0].data = 0;
site[0].occ_info[0].usage_t = [[9, 12],[15,15],[17,21]];
site[0].occ_info[0].choosed = [];

function tc_init() {
	var str = "<div class='contextMenu' id='myMenu'><ul class='menu_1'>\
						<li id='item_1'>&nbsp;&nbsp;&nbsp;申请</li> \
						<li id='item_2'>&nbsp;&nbsp;&nbsp;取消</li> \
					</ul></div>";
	
	$('body').append( $(str) );
	$('#myMenu').hide();
	
}

// c_id - 容器id值，无 ‘#’
// site_index 
// occ_info_index
function gen_tc( c_id, site_index, occ_info_index ) {
	var can = $( '#'+c_id );
	can.append( $('<p class="tc_t">0</p>') );
	can.append( $('<p class="tc_t">6</p>') );
	can.append( $('<p class="tc_t">12</p>') );
	can.append( $('<p class="tc_t tc_t_pre_end">18</p>') );
	can.append( $('<p class="tc_t tc_t_end">23</p>') );
	
	var tc_b1 = $('<ul class="tc_b1"></ul>');
	tc_b1.attr( 'site_index', site_index );	
	tc_b1.attr( 'occ_info_index', occ_info_index );
	can.append( tc_b1 );
	
	for(var i=0; i<24; i++ ) {
		var mid = $('<li class="tc_h tc_h_green"></li>');
		mid.attr( 'time', i );
		if( i==0 )
			mid.addClass( 'tc_h_f' );
		if( i==23 )
			mid.addClass( 'tc_h_e' );
		tc_b1.append( mid );
	}
	
	set_tc( c_id, site_index, occ_info_index );		// must be here
		
	var lis = tc_b1.children('li.tc_h_green');
	lis.click( function() {
		
		$('#jqContextMenu').hide();
		$('#jqContextMenu_shadow').hide();
		
		var tar = $(this);
		var tar_p = tar.parent('ul');
		
		var s_ind = tar_p.attr( 'site_index' ) * 1;
		var occ_ind = tar_p.attr( 'occ_info_index' ) * 1;
		var choosed = site[s_ind].occ_info[occ_ind].choosed;
		
		var clicked_li = tar_p.children( 'li.clicked' );
	
		var choose = tar.parent('ul').children('div.choose');
		if( choose.length>0 )
			choose.hide();
			
		if( clicked_li.length>=2 ) {
			clicked_li.removeClass( 'clicked' );
			choosed.length = 0;
			choosed[0] = tar.attr( 'time' )*1;
		}
		
		if( clicked_li.length==0 )
			choosed[0] = tar.attr( 'time' )*1;
		
		if( clicked_li.length==1 ) {					// 区间时段选择
			choosed[1] = tar.attr( 'time' )*1;
			
			var w = tar.width();
			var h = tar.height();
			
			if( choose.length<=0 ) {
				choose = $('<div class="choose"></div>');
				tar_p.append( choose );
			}
			
			var choose_f = tar_p.children( "li[time='"+choosed[0]+"']" );
			choose_f.removeClass( 'clicked' );		// must be put here
			
			if( choosed[0]>choosed[1] ) {
				var left2 = choose_f.position().left;
				var left1 = tar.position().left;
			}
			else {
				var left1 = choose_f.position().left;
				var left2 = tar.position().left;
			}
			
			var base = tar_p.children( "li[time='0']" ).position().left;		
			
			choose.css( 'left', left1-base+'px' );
			choose.width( left2-left1+w );
			choose.height( h );
			choose.show();
			
			return false;
				
		}
		
		tar.addClass( 'clicked' );
		
		return false;					// 阻止事件传播
	} );
	
	can.click( function() {
		
		$('#jqContextMenu').hide();
		$('#jqContextMenu_shadow').hide();
		
		var tar = $(this).children('ul');
		tar.children('.choose').hide();
		tar.children('li.clicked').removeClass( 'clicked' );
		return false;
	} );
	
	//  添加右键菜单
	$('#'+c_id).contextMenu( 'myMenu', {
						  
		itemHoverStyle: {
			backgroundColor: '#AAB2BD',
			border: 'none'
		},
		  
		 bindings: {
			'item_1': function(t) {
				//alert('Trigger was '+t.id+'\nAction was item_1');
				var trigger = $('#'+t.id);
				var choose_div = trigger.find('div.choose');
				if( choose_div.length<=0 || choose_div.is(':hidden') )
					return false;
				
				var s_ind = trigger.find('ul.tc_b1').attr( 'site_index' ) * 1;
				var occ_ind = trigger.find('ul.tc_b1').attr( 'occ_info_index' ) * 1;
				if( check( s_ind, occ_ind ) ) {		// 冲突
					alert( '时间选择冲突，请重新选择！' );
					
				}
				else {
					alert( '已申请！' );
				}
			},
			
			'item_2': function(t) {}
		}
		
	} );
}

function set_tc( c_id, site_index, occ_info_index ) {
	
	var target = $( '#'+c_id );
	var lis = target.children('ul').children('li');
	
	// 设置关门时间
	$.each( site[site_index].close_t, function(k,v) {
		lis.each( function(k2,v2) {
			var jv2 = $(v2);
			var hour = jv2.attr('time');
			if( hour>=v[0] && hour<=v[1] ) {
				jv2.removeClass( 'tc_h_green' );
				jv2.addClass( 'tc_h_grey' );
			}
		} );	
	} );
	
	// 设置已占用时间
	$.each( site[site_index].occ_info[occ_info_index].usage_t, function(k,v) {
		for(var i=v[0]; i<=v[1]; i++ ) {
			var jv = lis.nextAll('li[time="'+i+'"]');
			jv.removeClass( 'tc_h_green' );
			jv.addClass( 'tc_h_red' );
		}	
	} );
}

// 判断选中的时间段是否有冲突
// 返回 true - 冲突 
function check( site_index, occ_info_index ) {
	
	var choosed = site[site_index].occ_info[occ_info_index].choosed;
	var sig = false;
	
	// c1 <= c2
	if( choosed[0]>choosed[1] ) {
		var c1 = choosed[1];
		var c2 = choosed[0];
	}
	else {
		var c1 = choosed[0];
		var c2 = choosed[1];
	}
		
	$.each( site[site_index].occ_info[occ_info_index].usage_t, function(k,v) {

		if( v[0]>=c1 && v[0]<=c2 ) {
			sig = true;
			return false;
		}
		
		if( v[1]>=c1 && v[1]<=c2 ) {
			sig = true;
			return false;
		}
		
		if( c1>=v[0] && c1<=v[1] ) {
			sig = true;
			return false;
		}
		
		if( c2>=v[0] && c2<=v[1] ) {
			sig = true;
			return false;
		}
	} );
	
	return sig;
	
}