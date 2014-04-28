<?php

class IndexController extends Base_Controller_Action {

	public function indexAction() {

            //Limpando qualquer posto que estiver na sessão
            $registry = Zend_Registry::getInstance();
            $registry->set('posto',array());
            
	}
        
        public function politicaPrivacidadeAction() {
            
            //Página Política de Privacidade
            
        }

	public function gridAction()
	{

		$this->_helper->layout->disableLayout();
		$this->_helper->viewRenderer->setNoRender();

		$objEstoque = new Estoque();

		$arrDados = $objEstoque->getGridAlertaEstoque();

		$configGrid = array(
                "id"            => "idGrid1",
                "header"       => array(        				
                    'Produto' => array("charset"=>'UTF-8',"type"=>"visible" ,"index"=>"descricao"),
					'Quantidade Disponível' => array("charset"=>'UTF-8',"type"=>"visible" ,"index"=>"qtd")
		),
                "hasPaginator"      => true,
				"rowClickable"		=> false,
				"clickMethod"		=> 'onClickGrid',
                "countPerPage"      => 10,
                "data"      	    => $arrDados,
                "currentPageNumber" => $this->_request->getPost('page')
		);

		$grid = new Base_Grid($configGrid);

		if($arrDados) {
			echo $grid->generate();
		}

	}

}

