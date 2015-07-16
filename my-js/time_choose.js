/*
	site[] . id
			. department
			. campus
			. room
			. close_t -- [ [st1, et1], [st2, et2].. ]
			. occ_info[]. date -- year/mon/day
						. state -- 0:empty; 1:used;
						. t -- [st, et]
*/
var site = new Array();
site[0] = new Object();
site[0].close_t = [[0,8],[22,23]];

var choosed = new Array();

// c_id - 容器id值，无 ‘#’
function tc_init( c_id ) {
	var can = $( '#'+c_id );
	can.append( $('<p class="tc_t">0</p>') );
	can.append( $('<p class="tc_t">6</p>') );
	can.append( $('<p class="tc_t">12</p>') );
	can.append( $('<p class="tc_t tc_t_pre_end">18</p>') );
	can.append( $('<p class="tc_t tc_t_end">23</p>') );
	
	var tc_b1 = $('<ul class="tc_b1"></ul>');
	can.append( tc_b1 );
	
	for(var i=0; i<24; i++ ) {
		var mid = $('<li class="tc_h mouse_response tc_h_green"></li>');
		mid.attr( 'time', i );
		if( i==0 )
			mid.addClass( 'tc_h_f' );
		if( i==23 )
			mid.addClass( 'tc_h_e' );
		tc_b1.append( mid );
	}
	
	set_tc( c_id, 0 );
		
	var lis = tc_b1.children('li.tc_h_green');
	lis.click( function() {
		var tar = $(this);
		var tar_p = tar.parent('ul');
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
		var tar = $(this).children('ul');
		tar.children('.choose').hide();
		choosed.length = 0;
		tar.children('li.clicked').removeClass( 'clicked' );
		return false;
	} );
}

function set_tc( c_id, i ) {
	
	var target = $( '#'+c_id );
	var lis = target.children('ul').children('li');
	
	$.each( site[i].close_t, function(k,v) {
		lis.each( function(k2,v2) {
			var jv2 = $(v2);
			var hour = jv2.attr('time');
			if( hour>=v[0] && hour<=v[1] ) {
				jv2.removeClass( 'tc_h_green' );
				jv2.addClass( 'tc_h_grey' );
			}
		} );
		
	} );
	
}