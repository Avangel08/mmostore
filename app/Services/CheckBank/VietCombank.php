<?php

namespace App\Services\CheckBank;

use GuzzleHttp\Client;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use phpseclib\Crypt\RSA;
if(!function_exists('debug')){
    function debug($v, $die = true){
        echo "<pre>";
        print_r($v);
        echo "</pre>";
        if($die)
            die();

    }
}


class VietCombank
{
    protected $ecaptcha_vn = config('services.ecaptcha.key', "966eef428fc9be34a57dd29245b48162");
    protected $captcha1st = '';
    protected $defaultPublicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAikqQrIzZJkUvHisjfu5ZCN+TLy//43CIc5hJE709TIK3HbcC9vuc2+PPEtI6peSUGqOnFoYOwl3i8rRdSaK17G2RZN01MIqRIJ/6ac9H4L11dtfQtR7KHqF7KD0fj6vU4kb5+0cwR3RumBvDeMlBOaYEpKwuEY9EGqy9bcb5EhNGbxxNfbUaogutVwG5C1eKYItzaYd6tao3gq7swNH7p6UdltrCpxSwFEvc7douE2sKrPDp807ZG2dFslKxxmR4WHDHWfH0OpzrB5KKWQNyzXxTBXelqrWZECLRypNq7P+1CyfgTSdQ35fdO7M1MniSBT1V33LdhXo73/9qD5e5VQIDAQAB\n-----END PUBLIC KEY-----";
    protected $clientPublicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCg+aN5HEhfrHXCI/pLcv2Mg01gNzuAlqNhL8ojO8KwzrnEIEuqmrobjMFFPkrMXUnmY5cWsm0jxaflAtoqTf9dy1+LL5ddqNOvaPsNhSEMmIUsrppvh1ZbUZGGW6OUNeXBEDXhEF8tAjl3KuBiQFLEECUmCDiusnFoZ2w/1iOZJwIDAQAB";
    protected $clientPrivateKey = "-----BEGIN RSA PRIVATE KEY-----\r\nMIICXQIBAAKBgQCg+aN5HEhfrHXCI/pLcv2Mg01gNzuAlqNhL8ojO8KwzrnEIEuq\r\nmrobjMFFPkrMXUnmY5cWsm0jxaflAtoqTf9dy1+LL5ddqNOvaPsNhSEMmIUsrppv\r\nh1ZbUZGGW6OUNeXBEDXhEF8tAjl3KuBiQFLEECUmCDiusnFoZ2w/1iOZJwIDAQAB\r\nAoGAEGDV7SCfjHxzjskyUjLk8UL6wGteNnsdLGo8WtFdwbeG1xmiGT2c6eisUWtB\r\nGQH03ugLG1gUGqulpXtgzyUYcj0spHPiUiPDAPY24DleR7lGZHMfsnu20dyu6Llp\r\nXup07OZdlqDGUm9u2uC0/I8RET0XWCbtOSr4VgdHFpMN+MECQQDbN5JOAIr+px7w\r\nuhBqOnWJbnL+VZjcq39XQ6zJQK01MWkbz0f9IKfMepMiYrldaOwYwVxoeb67uz/4\r\nfau4aCR5AkEAu/xLydU/dyUqTKV7owVDEtjFTTYIwLs7DmRe247207b6nJ3/kZhj\r\ngsm0mNnoAFYZJoNgCONUY/7CBHcvI4wCnwJBAIADmLViTcjd0QykqzdNghvKWu65\r\nD7Y1k/xiscEour0oaIfr6M8hxbt8DPX0jujEf7MJH6yHA+HfPEEhKila74kCQE/9\r\noIZG3pWlU+V/eSe6QntPkE01k+3m/c82+II2yGL4dpWUSb67eISbreRovOb/u/3+\r\nYywFB9DxA8AAsydOGYMCQQDYDDLAlytyG7EefQtDPRlGbFOOJrNRyQG+2KMEl/ti\r\nYr4ZPChxNrik1CFLxfkesoReXN8kU/8918D0GLNeVt/C\r\n-----END RSA PRIVATE KEY-----\r\n";
	protected $url = [
        "getCaptcha" => "https://digiapp.vietcombank.com.vn/utility-service/v1/captcha/",
        "login" => "https://digiapp.vietcombank.com.vn/authen-service/v1/login",
        "authen-service" => "https://digiapp.vietcombank.com.vn/authen-service/v1/api-",
        "getHistories" => "https://digiapp.vietcombank.com.vn/bank-service/v1/transaction-history",
        "tranferOut" => "https://digiapp.vietcombank.com.vn/napas-service/v1/init-fast-transfer-via-accountno",
        "genOtpOut" => "https://digiapp.vietcombank.com.vn/napas-service/v1/transfer-gen-otp",
        "genOtpIn" => "https://digiapp.vietcombank.com.vn/transfer-service/v1/transfer-gen-otp",
        "confirmTranferOut" => "https://digiapp.vietcombank.com.vn/napas-service/v1/transfer-confirm-otp",
        "confirmTranferIn" => "https://digiapp.vietcombank.com.vn/transfer-service/v1/transfer-confirm-otp",
        "tranferIn" => "https://digiapp.vietcombank.com.vn/transfer-service/v1/init-internal-transfer",
        "getBanks" => "https://digiapp.vietcombank.com.vn/utility-service/v1/get-banks",
        "getAccountDeltail" => "https://digiapp.vietcombank.com.vn/bank-service/v1/get-account-detail",
        "getlistAccount" => "https://digiapp.vietcombank.com.vn/bank-service/v1/get-list-account-via-cif",
        "getlistDDAccount" => "https://digiapp.vietcombank.com.vn/bank-service/v1/get-list-ddaccount"
    ];
    protected $lang = 'vi';
    protected $_timeout = 60;
    protected $DT = "Windows";
    protected $OV = "10";
    protected $PM = "Chrome 111.0.0.0";
    protected $checkAcctPkg = "1";
    protected $username;
    protected $password;
    protected $account_number;
    protected $captchaToken;
    protected $captchaValue;
    protected $proxy = "";
    #account
    protected $sessionId;
    protected $mobileId;
    protected $clientId;
    protected $cif;
    protected $res;
    protected $browserToken = "";
    protected $browserId = "";
    protected $E = "";
    protected $tranId = "";

    public function __construct($username,$password,$account_number)
    {
        $this->file = "banks/vcb/" . Str::slug($username) . ".txt";
        $this->password = $password;
        
        if(!Storage::exists($this->file)){
            $this->username = $username;
            $this->password = $password;
            $this->account_number = $account_number;
            $this->clientId = '';
            $this->browserId = md5($this->username);
            $this->saveData();
        }
        else
            $this->parseData();
       
    }


    public function saveData(){
        $data = [
            'username'              => $this->username,
            'password'              => $this->password,
            'account_number'        => $this->account_number,
            'sessionId'             => $this->sessionId,
            'mobileId'              => $this->mobileId,
            'clientId'              => $this->clientId,
            'cif'                   => $this->cif,
            'E'                     => $this->E,
            'res'                   => $this->res,
            'tranId'                => $this->tranId,
            'browserToken'          => $this->browserToken,
            'browserId'             => $this->browserId,
        ];
        Storage::put($this->file, json_encode($data));
    }
    public function parseData(){
        $data = Storage::get($this->file);
        $data = json_decode($data);
        $this->username = $data->username;
        $this->password = $this->password;
        $this->account_number = isset($data->account_number) ? $data->account_number : '';
        $this->sessionId = isset($data->sessionId) ? $data->sessionId : '';
        $this->mobileId = isset($data->mobileId) ? $data->mobileId : '';
        $this->clientId = isset($data->clientId) ? $data->clientId : '';
        $this->token = isset($data->token) ? $data->token : '';
        $this->accessToken = isset($data->accessToken) ? $data->accessToken : '';
        $this->authToken = isset($data->authToken) ? $data->authToken : '';
        $this->cif = isset($data->cif) ? $data->cif : '';
        $this->res = isset($data->res) ? $data->res : '';
        $this->tranId = isset($data->tranId) ? $data->tranId : '';
        $this->browserToken = isset($data->browserToken) ? $data->browserToken : '';
        $this->browserId = isset($data->browserId) ? $data->browserId : '';
        $this->E = isset($data->E) ? $data->E : '';
    }


    protected function getE(){
        $ahash = md5($this->username);
        $imei = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split($ahash, 4));
        return strtoupper($imei);
    }
    public function getCaptcha(){
        $this->captchaToken = Str::random(30);
        $url = "https://digiapp.vietcombank.com.vn/utility-service/v1/captcha/".$this->captchaToken;
        $client = new Client(['http_errors' => false]);
        $res = $client->request('GET', $url, [
            'timeout' => $this->_timeout,
            "proxy" => $this->proxy,
            'headers' => array(
                'user-agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
            ),
        ]);
        $result = $res->getBody()->getContents();
        return base64_encode($result);
    }

    private function createTask($image)
    {
      $client = new Client();
      try {
        $res = $client->request('POST', 'https://api.1stcaptcha.com/recognition', [
          'json' => array(
            'Apikey' => $this->captcha1st,
            'Type'    => 'imagetotext',
            'Image'    => $image
          )
        ]);
        return json_decode($res->getBody());
      } catch (\Throwable $th) {
      }
      return false;
    }

    private function getTaskResult($taskId, $j = 0)
    {
      if ($j >= 5) {
        return ["status" => false];
      }
      $client = new Client();
      try {
        $res = $client->request('GET', "https://api.1stcaptcha.com/getresult?apikey={$this->captcha1st}&taskid=" . $taskId);
        $result = json_decode($res->getBody());

        if ($result->Status == 'SUCCESS') {
          return ["status" => true, "captcha" => $result->Data];
        } elseif ($result->status == 'processing') {
          sleep(3);
          ++$j;
          return $this->getTaskResult($taskId, $j);
        }
      } catch (\Throwable $th) {
      }
      return ["status" => false];
    }

    public function solveCaptcha(){
        $getCaptcha = $this->getCaptcha();
        $result = $this->createTask($getCaptcha);
        if ($result !== false) {
          if ($result->Code == 0) {
            sleep(3);
            $result = $this->getTaskResult($result->TaskId);
            if ($result['status'] == true) {
              $this->captchaValue = $result['captcha'];
              return ["status" => true, "key" => $this->captchaToken, "captcha" => $result['captcha']];
            } else {
              return ["status" => false, "msg" => "Error getTaskResult"];
            }
          }
        }
    }

    public function solveCaptchaEcaptcha(){
        $getCaptcha = $this->getCaptcha();
        $curl = curl_init();
        curl_setopt_array($curl, array(
          CURLOPT_URL => 'https://ecaptcha.vn/api/captcha/vcb',
          CURLOPT_SSL_VERIFYPEER => 0,
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'POST',
          CURLOPT_POSTFIELDS =>'{
            "api_key": "'.$this->ecaptcha_vn.'",
            "img_base64": "'.$getCaptcha.'"
        }',
          CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json'
          ),
        ));

        $response = curl_exec($curl);
        curl_close($curl);
        $result = json_decode($response, true);
        $this->captchaValue = $result['captcha'];
        return $result;

    }

    public function solveCaptchaDichvudark(){
        $getCaptcha = $this->getCaptcha();
        
        $dataPost = [
            "username" => "",
            "api_key" => "",
            "img_base64" => $getCaptcha
        ];
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://dichvudark.vn/api/captcha/vcb",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $dataPost,
        ));

        $result = curl_exec($curl);

        curl_close($curl);
        $result = json_decode($result, true);
        $this->captchaValue = $result['data']['captcha'];
        $result['captcha'] = $result['data']['captcha'];
        return $result;

    }




    public function checkBrowser($type = 1){
        $param = array(
            "DT" => $this->DT,
            "OV" => $this->OV,
            "PM" => $this->PM,
            "E" => $this->getE() ?: "",
            "browserId" => $this->browserId,
            "lang" => $this->lang,
            "mid" => 3008,
            "cif" => "",
            "clientId" => "",
            "mobileId" => "",
            "sessionId" => "",
            "browserToken" => $this->browserToken,
            "user" => $this->username 
        );
        $result = $this->curlPost($this->url['authen-service']."3008",$param);
        if(isset($result->transaction->tranId)){

            return $this->chooseOtpType($result->transaction->tranId,$type);
        }else{
            return array(
                'success' => false,
                'message' => "checkBrowser failed",
                "param" => $param,
                'data' => $result ? : ""
            );
        }
    }

    public function chooseOtpType($tranID,$type = 1){
        $param = array(
            "DT" => $this->DT,
            "OV" => $this->OV,
            "PM" => $this->PM,
            "E" => $this->getE() ?: "",
            "browserId" => $this->browserId,
            "lang" => $this->lang,
            "mid" => 3010,
            "cif" => "",
            "clientId" => "",
            "mobileId" => "",
            "sessionId" => "",
            "browserToken" => $this->browserToken,
            "tranId" => $tranID,
            "type" => $type, //1 la sms,5 la smart
            "user" => $this->username
        );
        $result = $this->curlPost($this->url['authen-service']."3010",$param);
        if($result->code == 00 ){

            $this->tranId = $tranID;
            $this->saveData();
            return array(
                'success' => true,
                'message' => "ok",
                "result" => [
                    "browserToken" => $this->browserToken,
                    "tranId" => isset($result->tranId) ? $result->tranId : '',
                    "challenge" => isset($result->challenge) ? $result->challenge : ''
                ],
                "param" => $param,
                'data' => $result ? : ""
            );
        }
    }


    public function submitOtpLogin($otp){
        $param = array(
            "DT" => $this->DT,
            "OV" => $this->OV,
            "PM" => $this->PM,
            "E" => $this->getE() ?: "",
            "browserId" => $this->browserId,
            "lang" => $this->lang,
            "mid" => 3011,
            "cif" => "",
            "clientId" => "",
            "mobileId" => "",
            "sessionId" => "",
            "browserToken" => $this->browserToken,
            "tranId" => $this->tranId,
            "otp" => $otp,
            "user" => $this->username
        );
       
        $result = $this->curlPost($this->url['authen-service']."3011",$param);
        
        if($result->code == 00 ){
            $this->sessionId = $result->sessionId;
            $this->mobileId = $result->userInfo->mobileId;
            $this->clientId = $result->userInfo->clientId;
            $this->cif = $result->userInfo->cif;
            $session = ["sessionId" => $this->sessionId ,"mobileId" => $this->mobileId , "clientId" => $this->clientId,"cif" => $this->cif];
            $this->res = $result;
            $this->saveData();
            $sv = $this->saveBrowser();
			if($sv->code == 00 ){
				return array(
					'success' => true,
					'message' => "success",
					"d" => $sv,
					'session' => $session,
					'data' => $result ? : ""
				);	
			}else{
				return array(
					'success' => false,
					'message' => $sv->des,
					"param" => $param,
					'data' => $sv ? : ""
				);
			}
        }else{
            return array(
                'success' => false,
                'message' => $result->des,
                "param" => $param,
                'data' => $result ? : ""
            );
        }
    }
    public function saveBrowser(){
        $param = array(
            "DT" => $this->DT,
            "OV" => $this->OV,
            "PM" => $this->PM,
            "E" =>  "",
            "browserId" => $this->browserId,
            "browserName" => "Chrome 111.0.0.0",
            "lang" => $this->lang,
            "mid" => 3009,
            "cif" => $this->cif,
            "clientId" => $this->clientId,
            "mobileId" => $this->mobileId,
            "sessionId" => $this->sessionId,
            "user" => $this->username
        );
        $result = $this->curlPost($this->url['authen-service']."3009",$param);
        return $result;
    }
    public function doLogin(){
        $solveCaptcha = $this->solveCaptchaEcaptcha();
        if($solveCaptcha['status'] == false){
            return $solveCaptcha;
        }
        $param = array(
            "DT" => $this->DT,
            "OV" => $this->OV,
            "PM" => $this->PM,
            "E" => $this->getE() ?: "",
            "browserId" => $this->browserId,
            "captchaToken" => $this->captchaToken,
            "captchaValue" => $this->captchaValue,
            "checkAcctPkg" => $this->checkAcctPkg,
            "lang" => $this->lang,
            "mid" => 6,
            "password" => $this->password,
            "user" => $this->username
        );
        $result = $this->curlPost($this->url['login'],$param);
        if($result->code == 00 ){
            $this->sessionId = $result->sessionId;
            $this->mobileId = $result->userInfo->mobileId;
            $this->clientId = $result->userInfo->clientId;
            $this->cif = $result->userInfo->cif;
            $session = ["sessionId" => $this->sessionId ,"mobileId" => $this->mobileId , "clientId" => $this->clientId,"cif" => $this->cif];
            $this->saveData();
            return array(
                'success' => true,
                'message' => "success",
                'session' => $session,
                'data' => $result ? : ""
            );
        }elseif($result->code == 20231 && $result->mid == 6){
            $this->browserToken = $result->browserToken;
            return $this->checkBrowser(1); // 5 la smart otp
        }else{
            return array(
                'success' => false,
                'message' => $result->des,
                "param" => $param,
                'data' => $result ? : ""
            );
        }
    }
    public function setData($sessionId,$mobileId,$clientId,$cif){
        $this->sessionId = $sessionId;
        $this->mobileId = $mobileId;
        $this->clientId = $clientId;
        $this->cif = $cif;
        return $this;
    }
    public function getlistAccount(){
        $param = array(
            "DT" => $this->DT,
            "OV" => $this->OV,
            "PM" => $this->PM,
            "browserId" => $this->browserId,
            "E" => $this->getE() ?: "",
            "mid" => 8,
            "cif" => $this->cif,
            "user" => $this->username,
            "mobileId" => $this->mobileId,
            "clientId" => $this->clientId,
            "sessionId" => $this->sessionId
        );
        $result = $this->curlPost($this->url['getlistAccount'],$param);
        return $result;

    }

    public function getlistDDAccount(){
        $param = array(
            "DT" => $this->DT,
            "OV" => $this->OV,
            "PM" => $this->PM,
            "browserId" => $this->browserId,
            "E" => $this->getE() ?: "",
            "mid" => 35,
            "cif" => $this->cif,
            "serviceCode" => "0551",
            "user" => $this->username,
            "mobileId" => $this->mobileId,
            "clientId" => $this->clientId,
            "sessionId" => $this->sessionId
        );
        $result = $this->curlPost($this->url['getlistDDAccount'],$param);
        return $result;

    }

    public function getAccountDeltail(){
        $param = array(
            "DT" => $this->DT,
            "OV" => $this->OV,
            "PM" => $this->PM,
            "E" => $this->getE() ?: "",
            "browserId" => $this->browserId,
            "accountNo" => $this->account_number,
            "accountType" => "D",
            "mid" => 13,
            "cif" => $this->cif,
            "user" => $this->username,
            "mobileId" => $this->mobileId,
            "clientId" => $this->clientId,
            "sessionId" => $this->sessionId
        );
        $result = $this->curlPost($this->url['getAccountDeltail'],$param);
        return $result;

    }
    public function getHistories($fromDate = "16/06/2023",$toDate = "16/06/2023",$account_number = '',$page = 0){
        $param = array(
            "DT" => $this->DT,
            "OV" => $this->OV,
            "PM" => $this->PM,
            "E" => $this->getE() ?: "",
            "browserId" => $this->browserId,
            "accountNo" => $account_number ? $account_number : $this->account_number,
            "accountType" => "D",
            "fromDate" => $fromDate,
            "toDate" => $toDate,
            "lang" => $this->lang,
            "pageIndex" => $page,
            "lengthInPage" => 20,
            "stmtDate" => "",
            "stmtType" => "",
            "mid" => 14,
            "cif" => $this->cif,
            "user" => $this->username,
            "mobileId" => $this->mobileId,
            "clientId" => $this->clientId,
            "sessionId" => $this->sessionId
        );
        $result = $this->curlPost($this->url['getHistories'],$param);
        return $result;
    }
    public function getBanks(){
        $param = array(
            "DT" => $this->DT,
            "OV" => $this->OV,
            "PM" => $this->PM,
            "E" => $this->getE() ?: "",
            "browserId" => $this->browserId,
            "lang" => $this->lang,
            "fastTransfer" => "1",
            "mid" => 23,
            "cif" => $this->cif,
            "user" => $this->username,
            "mobileId" => $this->mobileId,
            "clientId" => $this->clientId,
            "sessionId" => $this->sessionId
        );
        $result = $this->curlPost($this->url['getBanks'],$param);
        return $result;
    }
    public function createTranferOutVietCombank($from_account, $bankCode,$account_number,$amount,$message){
        $param = array(
            "DT" => $this->DT,
            "OV" => $this->OV,
            "PM" => $this->PM,
            "E" => "",
            "browserId" => $this->browserId,
            "lang" => $this->lang,
            "debitAccountNo" => $from_account,
            "creditAccountNo" => $account_number,
            "creditBankCode" => $bankCode,
            "amount" => $amount,
            "feeType" => 1,
            "content" => $message,
            "ccyType" => "1",
            "mid" => 62,
            "cif" => $this->cif,
            "user" => $this->username,
            "mobileId" => $this->mobileId,
            "clientId" => $this->clientId,
            "sessionId" => $this->sessionId
        );
        $result = $this->curlPost($this->url['tranferOut'],$param);
        return $result;
    }
    public function createTranferInVietCombank($from_account, $account_number,$amount,$message){
        $param = array(
            "DT" => $this->DT,
            "OV" => $this->OV,
            "PM" => $this->PM,
            "E" => "",
            "browserId" => $this->browserId,
            "lang" => $this->lang,
            "debitAccountNo" => $from_account,
            "creditAccountNo" => $account_number,
            "amount" => $amount,
            "activeTouch" => 0,
            "feeType" => 1,
            "content" => $message,
            "ccyType" => "",
            "mid" => 16,
            "cif" => $this->cif,
            "user" => $this->username,
            "mobileId" => $this->mobileId,
            "clientId" => $this->clientId,
            "sessionId" => $this->sessionId
        );
        $result = $this->curlPost($this->url['tranferIn'],$param);
        return $result;
    }
    public function genOtpTranFer($tranId, $type = "OUT", $otpType = 5){
        if($otpType == 1) {
            $solveCaptcha = $this->solveCaptcha();
            if ($solveCaptcha['status'] == false) {
                return $solveCaptcha;
            }
            $param = array(
                "DT" => $this->DT,
                "OV" => $this->OV,
                "PM" => $this->PM,
                "E" => "",
                "lang" => $this->lang,
                "tranId" => $tranId,
                "type" => $otpType, // 1 là SMS,5 là smart otp
                "captchaToken" => $this->captchaToken,
                "captchaValue" => $this->captchaValue,
                "browserId" => $this->browserId,
                "mid" => 17,
                "cif" => $this->cif,
                "user" => $this->username,
                "mobileId" => $this->mobileId,
                "clientId" => $this->clientId,
                "sessionId" => $this->sessionId
            );
        }else{
            $param = array(
                "DT" => $this->DT,
                "OV" => $this->OV,

                "PM" => $this->PM,
                "E" => "",
                "lang" => $this->lang,
                "tranId" => $tranId,
                "type" => $otpType, // 1 là SMS,5 là smart otp
                "mid" => 17,
                "browserId" => $this->browserId,
                "cif" => $this->cif,
                "user" => $this->username,
                "mobileId" => $this->mobileId,
                "clientId" => $this->clientId,
                "sessionId" => $this->sessionId
            );
        }

        if($type == "IN"){
            $result = $this->curlPost($this->url['genOtpIn'],$param);
        }else{
            $result = $this->curlPost($this->url['genOtpOut'],$param);
        }
        return $result;
    }
    public function confirmTranfer($tranId, $challenge, $otp , $type = "OUT" , $otpType = 5){
        if($otpType == 5){
            $param = array(
                "DT" => $this->DT,
                "OV" => $this->OV,
                "PM" => $this->PM,
                "E" => "",
                "lang" => $this->lang,
                "tranId" => $tranId,
                "otp" => $otp,
                "challenge" => $challenge,
                "mid" => 18,
                "cif" => $this->cif,
                "user" => $this->username,
                "browserId" => $this->browserId,
                "mobileId" => $this->mobileId,
                "clientId" => $this->clientId,
                "sessionId" => $this->sessionId
            );
        }else{
            $param = array(
                "DT" => $this->DT,
                "OV" => $this->OV,
                "PM" => $this->PM,
                "E" => $this->getE() ?: "",
                "browserId" => $this->browserId,
                "lang" => $this->lang,
                "tranId" => $tranId,
                "otp" => $otp,
                "challenge" => $challenge,
                "mid" => 18,
                "cif" => $this->cif,
                "user" => $this->username,
                "mobileId" => $this->mobileId,
                "clientId" => $this->clientId,
                "sessionId" => $this->sessionId
            );
        }


        if($type == "IN"){
            $result = $this->curlPost($this->url['confirmTranferIn'],$param);
        }else{
            $result = $this->curlPost($this->url['confirmTranferOut'],$param);
        }
        return $result;
    }
    private function curlPost($url = "",$data = array()){
        try {
            $client = new Client(['http_errors' => false]);
            $res = $client->request('POST', $url, [
                'timeout' => $this->_timeout,
                "proxy" => $this->proxy,

                'headers' => $this->headerNull(),
                'body' => json_encode($this->encryptData($data)),
            ]);
            $result = json_decode($res->getBody()->getContents());
            return $this->decryptData($result);
        } catch (\Exception $e) {
            print_r($e);
            return false;
        }
    }

    private function encryptData($str){
        $str["clientPubKey"] = $this->clientPublicKey;

        $key = Str::random(32);
        $iv = Str::random(16);
        $rsa = new RSA();
        $rsa->loadKey($this->defaultPublicKey);
        $rsa->setEncryptionMode(2);
        $body = base64_encode($iv . openssl_encrypt(json_encode($str), 'AES-256-CTR', $key, OPENSSL_RAW_DATA, $iv));
        $header = base64_encode($rsa->encrypt(base64_encode($key)));
        return [
            'd'=> $body,
            'k'=> $header,
        ];
    }
    private function decryptData($cipher){
        $header = $cipher->k;
        $body = base64_decode($cipher->d);
        $rsa = new RSA();
        $rsa->loadKey($this->clientPrivateKey);
        $rsa->setEncryptionMode(2);
        $key = $rsa->decrypt(base64_decode($header));
        $iv = substr($body, 0,16);
        $cipherText = substr($body, 16);
        $text = openssl_decrypt($cipherText, 'AES-256-CTR', base64_decode($key), OPENSSL_RAW_DATA, $iv);
        return json_decode($text);
    }
    private function headerNull()
    {

        $key = $this->username . "6q93-@u9";
        $xlim = hash("sha256", $key);
        // $user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36';
        $user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36';
        return array(
            'Accept' =>  'application/json',
            'Accept-Encoding' =>   'gzip, deflate, br',
            'Accept-Language' =>    'vi',
            'Connection' =>    'keep-alive',
            'Content-Type' =>    'application/json',
            'Host' =>    'digiapp.vietcombank.com.vn',
            'Origin' =>    'https://vcbdigibank.vietcombank.com.vn',
            'Referer' =>    'https://vcbdigibank.vietcombank.com.vn/',
            'sec-ch-ua-mobile' =>    '?0',
            'Sec-Fetch-Dest' =>    'empty',
            'Sec-Fetch-Mode' =>    'cors',
            'Sec-Fetch-Site' =>    'same-site',
            'User-Agent' =>    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            'X-Channel' =>    'Web',
            'X-Lim-ID' => $xlim
        );
    }

}
