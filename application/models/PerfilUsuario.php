<?php

class PerfilUsuario extends Base_Db_Table {
	
	protected $_name    = "perfil_usuario";
	protected $_primary = array("idUsuario","idPerfil");
		
	public function salvar($objPost) {			
	}
}