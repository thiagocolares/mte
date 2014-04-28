<?php

/**
 * Classe que configura os requisitos iniciais, do CSS e de codificação de saída antes de renderizar o layout.
 */
class Base_Controller_Plugin_ViewSetup extends Zend_Controller_Plugin_Abstract {

    /**
     * var Base_View
     *
     */
    protected $_view;

    public function __construct() {
        $viewRenderer = Zend_Controller_Action_HelperBroker::getStaticHelper('viewRenderer');
        //Inicializa ViewRenderer
        $viewRenderer->init();
        $view = $viewRenderer->view;
        $this->_view = $view;
    }

    public function dispatchLoopStartup(Zend_Controller_Request_Abstract $request) {
        $this->_configureRequestVars($request);
        $this->_configureHelpers();
        $this->_configureMetaData();
        //TODO: Alterar depois
        //$this->_view->headTitle(SYSTEM_NAME);
        $this->_view->headTitle('MTE');
        $this->_configureCss();
        $this->_scriptDefault();
        $this->_view->headLink()->headLink(array('rel' => 'shortcut icon', 'href' => $this->_view->baseUrl() . '/public/img/favicon.ico', 'type' => 'image/x-icon'));
        $this->_configureFileScriptDefault();
        $this->_configureFileScriptAction();
    }

    protected function _configureRequestVars(Zend_Controller_Request_Abstract $request) {
        //Configura variáveis que podem ser necessárias na visão
        $this->_view->originalModule = $request->getModuleName();
        $this->_view->originalController = $request->getControllerName();
        $this->_view->originalAction = $request->getActionName();
    }

    /**
     * Metodo que carrega os Helpers
     * @return void
     */
    protected function _configureHelpers() {
        //Adiciona caminho do novo helper aos helpers de visão do Base
        $prefixView = 'Base_View_Helper';
        $prefixController = 'Base_Controller_Action_Helper';
        $dirView = dirname(__FILE__) . '/../../View/Helper';
        $dirController = dirname(__FILE__) . '/../Action/Helper';
        $this->_view->addHelperPath($dirView, $prefixView);
        Zend_Controller_Action_HelperBroker::addPath($dirController, $prefixController);
    }

    /**
     * Configura os Meta datas e o DockType utilizado pelo sistema
     * @return unknown_type
     */
    protected function _configureMetaData() {
        //Configura doctype para helpers da visão
        $this->_view->doctype('XHTML1_STRICT');
        $this->_view->headMeta('text/html; charset=utf-8', 'content=IE=edge', 'http-equiv');
        $this->_view->headMeta()->setName('keywords', '');
        $this->_view->headMeta()->setName('description', '');
        $this->_view->headMeta()->setName('cache-control', 'no-cache');
    }

    /**
     * Método que carrega o CSS do sisyema
     */
    protected function _configureCss() {
        //Incui arquivo CSS padrão
        $this->_view->headLink()->appendStylesheet($this->_view->baseUrl() . '/bootstrap/css/bootstrap.css', 'screen, projection');
        $this->_view->headLink()->appendStylesheet($this->_view->baseUrl() . '/bootstrap/css/bootstrap-responsive.css', 'screen, projection');
        $this->_view->headLink()->appendStylesheet($this->_view->baseUrl() . '/stylesheets/library/imports.css', 'screen, projection');
        $this->_view->headLink()->appendStylesheet($this->_view->baseUrl() . '/bootstrap/css/docs.min.css', 'screen, projection');
    }

    protected function _configureFileScriptDefault() {
        //Javascript
        //$this->_view->headScript()->appendFile($this->_view->baseUrl().'/javascript/library/mte/utils.form.js','text/javascript',array('language'=>'javascript'));
        $this->_view->headScript()->appendFile($this->_view->baseUrl() . '/javascript/library/jquery/jquery-1.10.2.js', 'text/javascript', array('language' => 'javascript'));
        $this->_view->headScript()->appendFile($this->_view->baseUrl() . '/javascript/library/jqueryUi/jquery-ui-1.10.4.custom.js', 'text/javascript', array('language' => 'javascript'));
        $this->_view->headScript()->appendFile($this->_view->baseUrl() . '/bootstrap/js/bootstrap.min.js', 'text/javascript', array('language' => 'javascript'));
        //$this->_view->headScript()->appendFile($this->_view->baseUrl() . '/javascript/library/base/jquery/base.jquery.js', 'text/javascript', array('language' => 'javascript'));
        $this->_view->headScript()->appendFile($this->_view->baseUrl() . '/javascript/library/base/date/base.date.js', 'text/javascript', array('language' => 'javascript'));
        $this->_view->headScript()->appendFile($this->_view->baseUrl() . '/javascript/library/base/form/base.form.js', 'text/javascript', array('language' => 'javascript'));
        $this->_view->headScript()->appendFile($this->_view->baseUrl() . '/javascript/library/base/grid/base.grid.js', 'text/javascript', array('language' => 'javascript'));
        $this->_view->headScript()->appendFile($this->_view->baseUrl() . '/javascript/library/base/global/base.global.js', 'text/javascript', array('language' => 'javascript'));
        $this->_view->headScript()->appendFile($this->_view->baseUrl() . '/javascript/library/jquery/plugins/jquery.maskedInput.js', 'text/javascript', array('language' => 'javascript'));
        $this->_view->headScript()->appendFile($this->_view->baseUrl() . '/javascript/library/jquery/plugins/jquery.populate.js', 'text/javascript', array('language' => 'javascript'));
    }

    protected function _configureFileScriptAction() {
        //Carrega o javascript da action quanto existir

        $s = DIRECTORY_SEPARATOR;
        $caminho = getcwd() . "{$s}javascript{$s}scripts{$s}modules{$s}";
        $caminho .= "{$this->_view->originalModule}{$s}";
        $caminho .= "{$this->_view->originalController}{$s}";
        $caminho .= "{$this->_view->originalAction}.js";

        //se forem utilizado modulos indica para a pasta script/modules/nomeDoModulo/actionName.js
        $caminhoHttp = ($this->_view->originalModule == "default") ?
                $this->_view->baseUrl() . "/public/javascript/scripts/modules/default/" :
                $this->_view->baseUrl() . "/public/javascript/scripts/modules/" . $this->_view->originalModule . "/";
        $caminhoHttp .= $this->_view->originalController;
        $caminhoHttp .= "/";
        $caminhoHttp .= $this->_view->originalAction . '.js';
        if (file_exists($caminho)) {
            $this->_view->headScript()->appendFile($caminhoHttp, 'text/javascript', array('language' => 'javascript'));
        }
    }

    protected function _scriptDefault() {
        $scriptInicial = " var systemName = '{$this->_view->baseUrl()}';
                            var systemNameModule = '{$this->_view->originalModule}';
                            var urlImg     = '{$this->_view->baseUrl()}/public/img';
                            var baseUrl    = '{$this->_view->baseUrl()}';
                ";
        $this->_view->headScript()->appendScript($scriptInicial);
    }

}
