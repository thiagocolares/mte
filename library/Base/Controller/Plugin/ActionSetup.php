<?php
/**
 * A classe executa uma lista de ações que são armazenadas internamente,
 * estas ações podem ser facilmente adiciona, pois ela opera um sistema baseado
 * em pilha.
 */
class Base_Controller_Plugin_ActionSetup extends Zend_Controller_Plugin_Abstract
{
    public function dispatchLoopStartup(Zend_Controller_Request_Abstract $request)
    {
        $front = Zend_Controller_Front::getInstance();
        //Cria ActionStack se necessário
        if(!$front->hasPlugin('Zend_Controller_Plugin_ActionStack')){
            $actionStack = new Zend_Controller_Plugin_ActionStack();
            $front->registerPlugin($actionStack, 97);
        } else {
            $actionStack = $front->getPlugin('Zend_Controller_Plugin_ActionStack');
        }
        
        //Adiciona ação menu
//        $menuAction = clone($request);
//        $menuAction->setActionName('menu')
//                   ->setModuleName('default')
//                   ->setControllerName('menu');
//        $actionStack->pushStack($menuAction);
    }
}