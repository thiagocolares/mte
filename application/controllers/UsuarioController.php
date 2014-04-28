<?php

class UsuarioController extends Base_Controller_Action {

	public function indexAction() {

		$dadosUsuario = Zend_Auth::getInstance()->getIdentity();
			
		if($dadosUsuario->isAdmin) {

			$this->view->title = "Usuários do Sistema";

			$objPerfil = new Perfil();
			$arrOptions['perfil'] = $objPerfil->fetchAll()->toArray();

			$form = new UsuarioForm($arrOptions);
			$this->view->form = $form;

		} else {

			$this->_redirect('/index');
		}

	}

	public function gridAction() {

		$this->_helper->layout->disableLayout();
		$this->_helper->viewRenderer->setNoRender();

		$objUsuario = new Usuario();

		$arrDados = $objUsuario->getGrid($this->_request->getPost());

		$configGrid = array(
            "id" => "idGrid1",
            "header" => array(
                'Login' => array("charset" => 'UTF-8', "type" => "visible", "index" => "login"),
                'Nome' => array("charset" => 'UTF-8', "type" => "visible", "index" => "nome"),
                'E-mail' => array("charset" => 'UTF-8', "type" => "visible", "index" => "email"),
		),
            "hasPaginator" => true,
            "rowClickable" => true,
            "paramsClickMethod" => array('idUsuario'),
            "clickMethod" => 'onClickGrid',
            "countPerPage" => 10,
            "data" => $arrDados,
            "currentPageNumber" => $this->_request->getPost('page')
		);

		$grid = new Base_Grid($configGrid);
		echo $grid->generate();
	}

	public function ajaxSalvarAction() {

		$this->_helper->viewRenderer->setNoRender();

		$objUsuario = new Usuario();

		$msn = array();

		try {

			$msn['msn'] = $objUsuario->salvar($this->_request->getPost());
			$msn['type'] = 'success';
		} catch (Exception $e) {

			$msn['msn'] = $e->getMessage();
			$msn['type'] = 'error';
		}

		echo json_encode($msn);
		die();
	}

	public function ajaxGetUsuarioAction() {

		$this->_helper->viewRenderer->setNoRender();
		$objUsuario = new Usuario();

		$idUsuario = $this->_request->getParam('idUsuario');
		$rs = $objUsuario->fetchAll("idUsuario = '{$idUsuario}'")->toArray();
		$arrUsuario = array();

		$objPerfilUsuario = new PerfilUsuario();
		$rsPerfil = $objPerfilUsuario->fetchAll("idUsuario = '{$idUsuario}'")->toArray();

		$arrUsuario['idUsuario'] = $idUsuario;
		$arrUsuario['nome'] = $rs[0]['nome'];
		$arrUsuario['login'] = $rs[0]['login'];
		$arrUsuario['email'] = $rs[0]['email'];
		$arrUsuario['idPerfil'] = $rsPerfil[0]['idPerfil'];

		echo json_encode($arrUsuario);
		die();
	}

	public function ajaxExcluirUsuarioAction() {

	}

}

