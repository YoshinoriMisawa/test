var getRestAPIScript = Class.create();
getRestAPIScript.prototype = Object.extendsObject(AbstractAjaxProcessor, {

	getValues: function() {
		var status              = '';
		var err_code            = '';
		var requestBody         = '';
		var responseBody        = '';
		var message             = '';
		var data                = '';
		var total_count         = 0;
		var restObject;
		var end_point           = 'https://yahoo.co.jp/finance.php[parm]';
		var send_param          = '';
		var use_basic_auth      = false;
		var use_auth_header     = false;
		var basic_auth_id       = 'auth_id';
		var basic_auth_pw       = 'auth_pw';
		var auth_header         = '';
		var debug_flg           = true;
		var log                 = '';

		try {
			// rest message start
			restObject = new sn_ws.RESTMessageV2();
			restObject.setHttpMethod('get');
			restObject.setEndpoint(end_point);
			// Basic認証
			if( use_basic_auth && basic_auth_id && basic_auth_pw ) {
				restObject.setBasicAuth(basic_auth_id, basic_auth_pw);
			}
			// Authnication header
			if( use_auth_header && auth_header ) {
				restObject.setRequestHeader('Authorization', 'Bearer ' + auth_header);
			}
			// REST送信パラメータ設定
			if(send_param) {
				restObject.setStringParameter("parm", send_param);	// escape機能あり
				//restObject.setStringParameterNoEscape("parm", send_param);	// escape機能なし
			}
			// logging
			if( debug_flg ) {
				log += "------ start REST execute ----- \n";
				log += " EndPoint=" +  end_point   + "\n";
				log += " Param="    +  send_param  + "\n";
				gs.log(log, 'getRestAPIScript');
			}

			/* not async execute
			// set rest message timer(msec)
			restObject.setHttpTimeout(10000);
			// rest message excute
			var response = restObject.execute();
			*/

			// rest message async excute
			var response = restObject.executeAsync();
			// set rest message timer(sec)
			response.waitForResponse(10);

			// get rest message response
			status          = response.getStatusCode();
			if( status == '200' ) {
				message     = response.getMessage();
				total_count = response.getHeader( 'X-Total-Count' );
				data        = response.getBody();
			} else {
				err_code    = response.getErrorCode();
				message     = '[err-code]' + err_code + ' [err-msg]' + response.getErrorMessage();
				total_count = 0;
				data        = '\"undefined\"';
			}
		} catch(ex) {
			status          = '500';
			message         = ex.getMessage();
			total_count     = 0;
			data            = '\"undefined\"';
		} finally {
			requestBody     = restObject ? restObject.getRequestBody():null;
			responseBody    = '{"result":{"status":"' + status + '","message":"' + message + '","max":"' + total_count + '","data":' + data + '}}';
		}

		// logging
		if( debug_flg ) {
			log = "------ end REST execute ----- \n";
			log += " EndPoint="     +  end_point         + "\n";
			log += " Param="        +  send_param        + "\n";
			log += " Status="       +  status            + "\n";
			log += " max="          +  total_count       + "\n";
			log += " RequestBody="  +  requestBody       + "\n";
			log += " ResponseBody=" +  responseBody      + "\n";
			gs.log(log, 'getRestAPIScript');
		}

		// return response
		return responseBody;
	},
	type: 'getRestAPIScript'
});