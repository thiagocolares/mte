<?php

class Usuario extends Base_Db_Table {
	
	protected $_name    = "usuario";
	protected $_primary = "idUsuario";
	
	function login($objPost = array()) {
		// recuperando o $authAdapter
		$authAdapter = Zend_Registry::get('authAdapter');
		
		// setando tabela e campos de acesso
		$authAdapter
		  ->setTableName('usuario')
		  ->setIdentityColum('login')
		  ->setCredentialColum('senha');
		  
		// Recebendo os dados a serem validados
		$authAdapter
		  ->setIdentity(strtolower($objPost['login']))
		  ->setCredential(md5($objPost['senha']));
		  
		$autenticacao = $authAdapter->authenticate();
		
		// Verificando a autenticação
		if($autenticacao->isValid()) {
			return true;
		}
		else {
			return false;
		}
	}
	
	public function getGrid($objPost = array()) {

		if($objPost['nome']) {
			$where = " WHERE u.nome LIKE '%{$objPost['nome']}%'";
		} else {
			$where = '';
		}

		$db = $this->getAdapter();

		$sql = "SELECT * FROM usuario u $where";
		
		$rs = $db->fetchAll($sql);

		return $rs;

	}	
	
	public function salvar($objPost = array()) 
	{

		$arrUsuario = array();
		$arrUsuario['nome'] = $objPost['nome'];
		$arrUsuario['login'] = $objPost['login'];
		$arrUsuario['senha'] = md5($objPost['senha']);
		$arrUsuario['email'] = $objPost['email'];
		
		$arrPerfil = array();
		$arrPerfil['idPerfil'] = $objPost['idPerfil'];

		if(!$objPost['idUsuario']) {
			//Usuário novo
			$arrPerfil['idUsuario'] = $this->insert($arrUsuario);
			
			$objPerfilUsuario = new PerfilUsuario();
			$objPerfilUsuario->insert($arrPerfil);
			
			$strReturn = "Usuário cadastrado com sucesso!";
			
			
		} else {
			//Usuário já existente
			$this->update($arrUsuario, "idUsuario = {$objPost['idUsuario']}");

			$arrPerfil['idUsuario'] = $objPost['idUsuario'];
			
			$objPerfilUsuario = new PerfilUsuario();
			$objPerfilUsuario->update($arrPerfil, "idUsuario = {$objPost['idUsuario']}");			
			
			$strReturn = "Usuário alterado com sucesso!";
			
		}
		
		return $strReturn;
		
	}

}