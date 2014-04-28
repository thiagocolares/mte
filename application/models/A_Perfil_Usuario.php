<?php

class PerfilUsuario extends Base_Db_Table {
	
	protected $_name    = "a_perfil_usuario";
	protected $_primary = array("idUsuario","idPerfil");
		
	public function salvar($objPost) {			
	}
}