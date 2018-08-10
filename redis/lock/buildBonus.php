<?php
	require( "connect.php" );
	function buildBonus( $redis, $count ){
                for( $i = 1; $i <= $count; $i++ ){
                        $redis->sadd( 'bonus', '1000' . $i );
                }
        }
	buildBonus( $redis, 1000 );
?>

