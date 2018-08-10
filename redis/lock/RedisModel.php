<?php

	/*
	*  redis class for seckill business by ghostwu
	*/

	class RedisModel {

		private $_config;
		private $_redis;

		public function __construct( $config = [] ){
			$this->_config = $config;
			$this->_redis = $this->connect();	
		}

		private function connect(){
			try{
				$redis = new Redis();
				$redis->connect( $this->_config['host'], $this->_config['port'] );
			}catch( RedisException $e ) {
				throw new Exception( $e->getMessage() );	
				return false;
			}
			return $redis;
		}
		
		public function	lock( $key, $expire = 5 ) {
			$get_lock = $this->_redis->setnx( $key, time() + $expire );
			if( !$get_lock ){
				$lock_time = $this->_redis->get( $key );	
				if( time() > $lock_time ) {
					$this->unlock( $key );
					$get_lock = $this->_redis->setnx( $key, time() + $expire );
				}
			}	
			return $get_lock ? true : false;
		}

		public function unlock( $key ) {
			return $this->_redis->delete( $key );
		}
	}
	$redisM = new RedisModel( [ 'host' => '127.0.0.1' ], [ 'port' =>  6379 ] );
?>

