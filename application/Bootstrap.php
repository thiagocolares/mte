<?php
class Bootstrap extends Zend_Application_Bootstrap_Bootstrap {

	public function run() {
		try {
			parent::run();
		}catch(Exception $e) {
			$this->_exception($e);
		}
	}

	protected function _initSession() {
		Zend_Session::start();
	}

	/**
	 * Configura os headers
	 *
	 * @return void
	 */
	protected function _initHeaders() {
		// Configura o TimeZone
		date_default_timezone_set('Etc/GMT+3');

		// Evita que os dados sejam recuperados do cache do browser.
		header("Expires:Mon, 26 Jul 1997 05:00:00 GMT"); //colocamos uma data passada para que expire
		header("Last-Modified:" . gmdate("D, dM Y H:i:s") . "GMT"); //Última modificação, justo agora.
		header("Cache-Control: no-cache, must-revalidate"); //evita que se guarde em cache, HTTP 1.1
		header("Cache-Control: post-check=0, pre-check=0", false);
		header("Pragma: no-cache"); //evita que se guarde em cache HTTP 1.0
	}

	/**
	 * Opções de Configuração
	 * @return void
	 */
	protected function _initIniSet() {
		ini_set('default_charset','UTF-8');
		ini_set('display_errors', 1);
		ini_set('max_execotion_time','0');
		ini_set('memory_limit','1000M');
	}


	/**
	 * Define constantes com o endereço do sistema
	 *
	 * @return void
	 */
	protected function _initConstants() {
		//Definindo a constante com endereço do sistema...
		$systemName = str_ireplace('/public/index.php', '', $_SERVER['PHP_SELF']);
		$rootDir = dirname(dirname(__FILE__));
		define('ROOT_DIR',$rootDir);
		define('SYSTEM_PATH', "http://{$_SERVER['HTTP_HOST']}{$systemName}");
		define('SYSTEM_NAME','MTE');

		$registry        = Zend_Registry::getInstance();
		$configLanguages = new Zend_Config_Ini(ROOT_DIR . '/application/configs/languages.ini');
		$registry->set( 'languages', $configLanguages );

	}

	/**
	 * Configura o autoload e name spaces
	 *
	 * @return Zend_Loader_Autoloader_Resource
	 */
	protected function _initAutoload() {

		/**
		 * Registra o Zend_Loader como padrão para o carregamento da SPL autoload
		 */
		require_once 'Zend/Loader/Autoloader.php';
		$autoloader = Zend_Loader_Autoloader::getInstance();
		$autoloader->setFallbackAutoloader(true);
		$autoloader->registerNameSpace("_Mte");
		
		$moduleLoader = new Zend_Loader_Autoloader_Resource(array(
                        'basePath'  => '',
                        'namespace' => APPLICATION_PATH,
		));

		return $moduleLoader;
	}

	/**
	 * Inicializa os plugins e Helpers
	 *
	 * @return void
	 */
	protected function _initActionPlugins() {
			
			
		//registrando os helpers
		Zend_Controller_Action_HelperBroker::addPrefix('Base_Controller_Action_Helper_');

		//helper baseUrl
		$baseUrl = new Base_Controller_Action_Helper_BaseUrl();
		Zend_Controller_Action_HelperBroker::addHelper($baseUrl);

		// javascript action helper
		$js = new Base_Controller_Action_Helper_Javascript();
		Zend_Controller_Action_HelperBroker::addHelper($js);


		$front = Zend_Controller_Front::getInstance();
		$front->registerPlugin(new Base_Controller_Plugin_ActionSetup(),98);
		$front->registerPlugin(new Base_Controller_Plugin_ViewSetup());

		$directory = ROOT_DIR."/application/configs/i18n";
		$configLanguage = Zend_Registry::get('languages')->languages;

		$languages = $configLanguage->languages->toArray();

		$front->registerPlugin(new Base_Controller_Plugin_LanguageSetup($directory, $languages));

	}



	/**
	 * Configura as conexões de Banco de dados
	 *
	 * @return void
	 */
	protected function _initDbs() {

		$registry = Zend_Registry::getInstance();

		$configDb = new Zend_Config_Ini(ROOT_DIR."/application/configs/db.ini", 'mte') ;

		$db = Zend_Db::factory ( $configDb->db->adapter, $configDb->db->config->toArray() );
		$registry->set( 'db', $db );
		Zend_Db_Table::setDefaultAdapter ( $db );
		
	}
	
	protected function _initAuth() {
		
		$db = Zend_Registry::getInstance()->get('db');
				
		// Autenticação do sistema
		$authAdapter = new Zend_Auth_Adapter_DbTable($db);
		Zend_Registry::getInstance()->set( 'authAdapter', $authAdapter );
		
	}

	protected function _initAcl()
	{
//		$acl = App_Model_Acl::getInstance();
//		Zend_View_Helper_Navigation_HelperAbstract::setDefaultAcl($acl);
//		Zend_View_Helper_Navigation_HelperAbstract::setDefaultRole(Smapp::getCurrentUser()->role);
//		Zend_Registry::set('Zend_Acl', $acl);
//		return $acl;
	}


	/**
	 * Exibe a mensagem da exception capturada
	 *
	 * @param $exception
	 * @return String
	 */
	private function _exception($exception) {
		echo "<pre>";
		var_dump($exception->__toString());
		echo "</pre>";
		die("<br />LINE: ".__LINE__."<br />FILE: ".__FILE__);
	}
}