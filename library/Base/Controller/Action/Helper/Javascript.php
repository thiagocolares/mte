<?php
/** 
 * Descrição     : Action Helper que verifica a existencia de JS para a template e os inclui quando necessario
 * @example	 : $this->getJavaScripts(); (no arquivo view)
 * @version      : 1.0
 * @author       : Adler Medrado (adler.medrado@mdic.gov.br)
 * @package 	 : base
 * @copyright    : (c) 2010, 01 de fevereiro - MDIC - Ministério do Desenvolvimento, Indústria e Comércio Exterior
 * @Sistema      : Base - Classes Utilitarias
 * @Atualização  : [Dia/Mês/Ano]  [Autor] - [Email]
 */
class  Base_Controller_Action_Helper_Javascript extends Zend_Controller_Action_Helper_Abstract {


    public function direct() {
        return $this->javascript();
    }

    public function javascript() {

    	// Obtendo objeto zend_controller_front
        $front = Zend_Controller_Front::getInstance();

        $controller = $front->getRequest()->getControllerName();
        $action     = $front->getRequest()->getActionName();

        $caminho = getcwd();
        $caminho .= DIRECTORY_SEPARATOR;
        $caminho .= 'javascript';
        $caminho .= DIRECTORY_SEPARATOR;
        $caminho .= 'scripts';
        $caminho .= DIRECTORY_SEPARATOR;
        $caminho .= $controller;
        $caminho .= DIRECTORY_SEPARATOR;
        $caminho .= $action . '.js';

        $caminhoHttp  = $front->getBaseUrl();
        $caminhoHttp .= "/javascript";
        $caminhoHttp .= "/";
        $caminhoHttp .= 'scripts';
        $caminhoHttp .= '/';
        $caminhoHttp .= $controller;
        $caminhoHttp .= "/";
        $caminhoHttp .= $action . '.js';

        $retorno = "<!-- Javascript Auto Include -->\n";

        if (file_exists($caminho)) {
            $retorno .= "<script type=\"text/JavaScript\" src=\"{$caminhoHttp}\"></script>\n";
        }
        
        return $retorno;
    }

}