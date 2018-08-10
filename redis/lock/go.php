<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
	</head>
	<body>
		<input type="button" value="rush" />		
		<div id="box"></div>
	</body>
	<script src="xhr.js"></script>
	<script>
		var oBtn = document.querySelector( "input" );
		oBtn.onclick = function(){
		//for( var i = 1; i <= 10000; i++ ){
			(new XHR()).get( "./rush.php", { user_id : 1 }, function( x, info ){
	        	});
		//}
		}
	</script>
</html>
