<?php

class Base_Controller_Action extends Zend_Controller_Action {

    protected $_flashMessenger;

    public function init() {

        $this->verifyIdentity();

        $this->_flashMessenger = $this->_helper->getHelper('FlashMessenger');
        $this->verifyMessage();

        //Iniciando automaticamente o autoJs
        $this->view->autoJs = $this->_helper->javascript();
    }

    /**
     * Adiciona uma mensagem na sessão para ser consumida em outra action
     *
     * @param $msg	Texto da mensagem.
     * @param $type Tipo da mensagem.
     * @param $url 	Url de retorno da mensagem.
     * @return unknown_type
     */
    protected function addMessage($msg, $type = 'error') {
        $this->_flashMessenger->setNamespace('msg');

        $objMsn['msn'] = $msg;
        $objMsn['type'] = $type;

        $this->_flashMessenger->addMessage($objMsn);
    }

    /**
     * Verifica se existe alguma mensagem
     *
     * @return unknown_type
     */
    protected function verifyMessage() {
        $this->_flashMessenger->setNamespace('msg');

        if ($this->_flashMessenger->hasMessages()) {
            $objMsn = $this->_flashMessenger->getMessages();
            $objMsn = $objMsn[0];

            $this->view->msg = $objMsn['msn'];
            $this->view->msgType = $objMsn['type'];

            $this->_flashMessenger->clearMessages();
        } elseif ($this->_flashMessenger->hasCurrentMessages()) {
            $objMsn = $this->_flashMessenger->getCurrentMessages();
            $objMsn = $objMsn[0];

            $this->view->msg = $objMsn['msn'];
            $this->view->msgType = $objMsn['type'];

            $this->_flashMessenger->clearCurrentMessages();
        }
    }

    public function getDefaultAdapter() {
        return Zend_Registry::get('db');
    }

    /**
     * Executa depois do dispacho
     *
     * @return void
     */
    public function postDispatch() {
        parent::postDispatch();
        if (isset($this->view->viewData) && $this->view->viewData) {
            $this->view->headScript()->appendScript(" var viewData = " . Zend_Json_Encoder::encode($this->view->viewData) . "; ");
        }
        Base_Debug::send($_SESSION, '$_SESSION', Base_Debug::DUMP);
    }

    public function verifyIdentity() {
        if (!Zend_Auth::getInstance()->getStorage()->read()) {

            if ($this->_request->getControllerName() != 'auth' AND
                    $this->_request->getControllerName() != 'login' AND
                    $this->_request->getActionName() != 'politica-privacidade') {
                $this->_redirect('/login');
            }
        }
    }

}

?>
