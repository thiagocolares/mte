<?php
/**
 * A classe executa uma lista de ações que são armazenadas internamente,
 * estas ações podem ser facilmente adiciona, pois ela opera um sistema baseado
 * em pilha.
 */
class Base_Controller_Plugin_Permission extends Zend_Controller_Plugin_Abstract
{
    private $_objSession;
    private $_objAuth;

    public function dispatchLoopStartup(Zend_Controller_Request_Abstract $request)
    {
        $this->_objSession = new Zend_Session_Namespace(Base_Constants::K_NAMESPACE_DEFAULT);
        $this->_objAuth    = Base_Auth::getInstance();

        if(is_null($this->_objSession->permission)) {

            $arrPermission[0]['controller'] = "index";
            $arrPermission[0]['action']     = "index";

            $arrPermission[1]['controller'] = "contato";
            $arrPermission[1]['action']     = "index";
            
            //Gravando o menu na sessão
            $this->_objAuth->setStorage(new Zend_Auth_Storage_Session(Base_Constants::K_NAMESPACE_DEFAULT,'permission'));
            $this->_objAuth->getStorage()->write($arrPermission);
        }
    }
}