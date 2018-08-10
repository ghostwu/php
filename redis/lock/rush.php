<?php
	require "connect.php";
	require "RedisModel.php";
?>

<?php
	function getBonus( $redis, $user_id ){
		$rest_num = $redis->sCard( 'bonus' );
		if( $rest_num > 0 ) {
			$code = $redis->sPop( 'bonus' );
			$redis->hSet( 'activity1', 'user:' . $user_id, $code );
			die( json_encode( [ 'status' => 'ok', 'msg' => 'you got a bonus,congratuation!', 'data' => [
				'user_id' => $user_id,
				'code' => $code
			] ] ) );
		}else{
			die( json_encode( [ 'status' => 'error', 'msg' => 'bonus is over', 'data' => [] ] ) );
		}
	}

	$act = isset( $_GET['act'] ) ? $_GET['act'] : 'rush';
	$user_id = isset( $_GET['user_id'] ) ? $_GET['user_id'] : 0;
	if( empty( $user_id ) ) {
		die( json_encode( [ 'status' => 'error', 'msg' => 'not exist this user', 'data' => [] ] ) );
	}
	$lock_name = "lockBonus";
	$get_lock = $redisM->lock( $lock_name );
	switch( $act ) {
		case 'rush':
			if( $get_lock ){
				getBonus( $redis, $user_id );
			}else{
				die( json_encode( [ 'status' => 'error', 'msg' => 'service is busy', 'data' => [] ] ) );
			}
			break;
	}
?>
