<?php
abstract class Base_Db_Table extends Zend_Db_Table {

	protected $_unique = array();

	/**
	 * Recebe o array que vem do Post e verifica se é uma inserção ou alteração
	 * e executa.
	 * @author Laísa Castiglioni
	 * @since 31/03/2010
	 * @param <array> $data array que vem do post para inserção no banco
	 * @return <type>
	 */

	public function save($data,$validarUnique = true) {

		$primary = $this->getPrimary();
		$flag = true;
		$where = "";

		if(count($primary)) {
			foreach($primary as $key=>$value) {
				if(!array_key_exists($value, $data) || $data[$value] == 0) {
					$flag = false;
					break;
				}else {
					if($where == "") {
						$where = "$value = $data[$value]";
					}else {
						$where .= " AND $value = $data[$value]";
					}
				}
			}

			if($flag == false) {
				foreach($primary as $key=>$value) {
					if (array_key_exists($value, $data)) {
						unset($data[$value]);
					}
				}

				if($validarUnique){
					$this->validarUnique($data);
				}
				try {
					return $this->insert($data);
				} catch (Exception $e) {
					throw new Exception("Erro ao inserir registro");
				}
			}else {
				if($validarUnique){
					$this->validarUnique($data,$where);
				}
				try {
					return $this->update($data,$where);
				} catch (Exception $e) {
					throw new Exception("Erro ao alterar registro");
				}
			}
		}
	}

	/**
	 *
	 * Retorna as chaves primárias de uma tabela
	 */

	public function getPrimary() {

		$primary = $this->_primary;

		if(is_array($primary)) {
			if(!isset($primary[0])) {
				$arrPrimary[0] = $primary[1];
			}
		}else {
			$arrPrimary[0] = $primary;
		}

		return $arrPrimary;
	}


	/**
	 * Função para busca do grid, para consultas sem join
	 *
	 * Verifica se o índice do array passado pertence à alguma coluna da tabela
	 * Verifica se é um campo de texto, e utiliza LIKE '%%' e retira os acentos e capitalizações
	 *
	 * @author Laísa Castiglioni
	 * @since 06/04/2010
	 * @param <array> $objPost
	 * @return <string> $where
	 *
	 */
	public function getWhereGrid(array $objPost) {

		$select = $this->getAdapter()
		->select()->from("INFORMATION_SCHEMA.COLUMNS", 'COLUMN_NAME, DATA_TYPE')
		->where("TABLE_NAME = '{$this->_name}'");

		$data = $this->getAdapter()->fetchAll($select);
		$where = null;

		foreach($data as $key=>$value) {
			if(array_key_exists($value['COLUMN_NAME'], $objPost)) {
				if($objPost[$value['COLUMN_NAME']] != '') {
					if($value['DATA_TYPE'] == 'VARCHAR2' || $value['DATA_TYPE'] == 'CHAR' || $value['DATA_TYPE'] == 'CLOB') {
						if($where) {
							$where .= ' AND ';
						}
						$where .=
                         "LOWER(translate({$value['COLUMN_NAME']}, 'áéíóúàèìòùãõâêîôôäëïöüçÁÉÍÓÚÀÈÌÒÙÃÕÂÊÎÔÛÄËÏÖÜÇ', 'aeiouaeiouaoaeiooaeioucAEIOUAEIOUAOAEIOOAEIOUC'))
                         LIKE
                         LOWER(translate('%{$objPost[$value['COLUMN_NAME']]}%', 'áéíóúàèìòùãõâêîôôäëïöüçÁÉÍÓÚÀÈÌÒÙÃÕÂÊÎÔÛÄËÏÖÜÇ', 'aeiouaeiouaoaeiooaeioucAEIOUAEIOUAOAEIOOAEIOUC'))";
					}else {
						if($where) {
							$where .= ' AND ';
						}
						$where .= $value['COLUMN_NAME'] . " LIKE '%{$objPost[$value['COLUMN_NAME']]}%'";
					}
				}
			}
		}

		return $where;
	}

	/**
	 * prepara a string para pesquisa no banco
	 *
	 * @author Laísa Castiglioni
	 * @since 07/04/2010
	 * @param <string> $key - nome do campo no banco
	 * @param <string> $value - valor a ser pesquisado
	 * @return <string> $where
	 */
	public function retirarAcentosWhere($key,$value) {
		$where =
                "LOWER(translate($key, 'áéíóúàèìòùãõâêîôôäëïöüçÁÉÍÓÚÀÈÌÒÙÃÕÂÊÎÔÛÄËÏÖÜÇ', 'aeiouaeiouaoaeiooaeioucAEIOUAEIOUAOAEIOOAEIOUC'))
         LIKE
         LOWER(translate('%$value%', 'áéíóúàèìòùãõâêîôôäëïöüçÁÉÍÓÚÀÈÌÒÙÃÕÂÊÎÔÛÄËÏÖÜÇ', 'aeiouaeiouaoaeiooaeioucAEIOUAEIOUAOAEIOOAEIOUC'))";

		return $where;
	}

	/**
	 * Valida campos que não podem se repetir no banco
	 * os nomes dos campos devem ser setados na variável $_unique dentro de cada model
	 * através de um array
	 *
	 * @author Laísa Castiglioni
	 * @since 07/04/2010
	 * @param <array> $data array que vai ser inserido no banco
	 * @param <string> $where string de where para alteração
	 */
	private function validarUnique($data, $where = null) {
		$db = Base_Db_Table::getDefaultAdapter();
		$whereData = null;

		if(count($this->_unique)) {

			foreach ($this->_unique as $key=>$value) {
				if($whereData) {
					$whereData .= ' AND ';
				}
				$whereData .= "$value = '$data[$value]'";
			}

			//update
			if($where) {
				$where = 'AND (' . str_replace('=', '<>', $where) . ')';
			}

			$sql = "SELECT * FROM $this->_name WHERE $whereData $where";
			$res = $db->fetchAll($sql);

			if(count($res)) {
				$message = "Campo(s) com valor(es) já registrado(s)";
				throw new Exception($message);
			}
		}
	}

	/**
	 * Função de verificação de duplicidade de registros
	 *
	 * @param array $objPost
	 * @param array $fields Campos a serem validados
	 * @param string $idField Campo de identificação da tabela
	 * @return bool
	 */

	public function verificaDuplicidadeRegistro(array $objPost, array $fields = null, $idField = null) {

		$select = $this->select();
		$select->setIntegrityCheck(false);

		//Variável utilizada para verificar se os campos a serem validados foram preenchidos
		$controlValidacao = false;

		//Caso exista o parâmetro $fields, a validação será realizada apenas nos campos definidos

		if($fields) {

			$select->from($this->_name, $fields);
			foreach($fields as $value) {

				if(isset($objPost[$value]) && $objPost[$value]) {
					$coluna = $this->retiraAcentosColuna($value, true);
					$valor = $this->retiraAcentos($objPost[$value], true);
					$select->where("$coluna = '$valor'");

					$controlValidacao = true;
				}

			}
			//Caso exista o campo $idField, ele exclui os próprio registro da verificação
			if($idField && array_key_exists($idField, $objPost) && $controlValidacao) {
				$select->where("{$idField} <> '{$objPost[$idField]}'");
			}

		} else {

			//Caso não exista o parâmetro $fields, todos os registros serão verificados

			$select->from($this->_name);
			foreach($objPost as $key=>$value) {
				if(isset($objPost[$value]) && $objPost[$value]) {
					$coluna = $this->retiraAcentosColuna($value, true);
					$valor = $this->retiraAcentos($objPost[$value], true);
					$select->where("$coluna = '$valor'");

					$controlValidacao = true;
				}
			}
			//Caso exista o campo $idField, ele exclui os próprio registro da verificaçã
			if($idField && array_key_exists($idField, $objPost) && $controlValidacao) {
				$select->where("{$idField} <> '{$objPost[$idField]}'");
			}

		}

		if($controlValidacao) {
			$result = $this->fetchAll($select)->toArray();
		} else {
			$result = array();
		}

		if(empty($result)) {
			return true;
		} else {
			return false;
		}

	}

	/**
	 * Método que retira acentos de variáveis POST/GET recuparadass
	 *
	 * @param string $texto
	 * @param boolean $strtoupper
	 * @return string
	 */

	public function retiraAcentos($texto,$strtoupper=false) {

		/**
		 * TRAMENTO DE ACENTOS - RETIRO ACENTOS OBJPOST
		 */
		$enc = "UTF-8";
		$acentos = array(
                'A' => '/&Agrave;|&Aacute;|&Acirc;|&Atilde;|&Auml;|&Aring;/',
                'a' => '/&agrave;|&aacute;|&acirc;|&atilde;|&auml;|&aring;/',
                'C' => '/&Ccedil;/',
                'c' => '/&ccedil;/',
                'E' => '/&Egrave;|&Eacute;|&Ecirc;|&Euml;/',
                'e' => '/&egrave;|&eacute;|&ecirc;|&euml;/',
                'I' => '/&Igrave;|&Iacute;|&Icirc;|&Iuml;/',
                'i' => '/&igrave;|&iacute;|&icirc;|&iuml;/',
                'N' => '/&Ntilde;/',
                'n' => '/&ntilde;/',
                'O' => '/&Ograve;|&Oacute;|&Ocirc;|&Otilde;|&Ouml;/',
                'o' => '/&ograve;|&oacute;|&ocirc;|&otilde;|&ouml;/',
                'U' => '/&Ugrave;|&Uacute;|&Ucirc;|&Uuml;/',
                'u' => '/&ugrave;|&uacute;|&ucirc;|&uuml;/',
                'Y' => '/&Yacute;/',
                'y' => '/&yacute;|&yuml;/',
                'a.' => '/&ordf;/',
                'o.' => '/&ordm;/');

		$semAcento = preg_replace($acentos,
		array_keys($acentos),
		htmlentities($texto,ENT_NOQUOTES, $enc));

		if($strtoupper) {
			$semAcento = strtoupper($semAcento);
		}

		return  $semAcento;

	}

	/**
	 * Método que retira acentos de dados recuperados de uma coluna de uma tabela do banco de dados
	 *
	 * @param string $texto
	 * @param boolean $strtoupper
	 * @return string
	 */
	public function retiraAcentosColuna($texto,$strtoupper=false) {

		if($strtoupper) {
			$coluna = "upper(translate(".$texto.",'ÁÇÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕËÜáçéíóúàèìòùâêîôûãõëü','ACEIOUAEIOUAEIOUAOEUaceiouaeiouaeiouaoeu'))";
		}else {
			$coluna = "translate(".$texto.",'ÁÇÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕËÜáçéíóúàèìòùâêîôûãõëü','ACEIOUAEIOUAEIOUAOEUaceiouaeiouaeiouaoeu')";
		}

		return  $coluna;

	}


	/**
	 * Método de limpeza do post
	 * Exclui os índices do array que estiverem vazios.
	 *
	 * @param array $objPost
	 * @return array $objPost
	 */
	public function clearPost($objPost) {

		foreach($objPost as $key=>$value) {

			if(!$value) {
				unset($objPost[$key]);
			} else if ($value=='NULL' OR $value=='NULL;') {
				$objPost[$key] = "";
			}
		}

		return $objPost;
	}

	public function formatValor($val) {

		if($val <> '0,00') {
			$val = str_replace('.','', $val);
			$val = str_replace(',', '.', $val);
		} else {
			$val = '';
		}

		return trim($val);
	}

	public function formatDate($date) {

		if($date) {
			$dtAux = explode('-',$date);
			$date = $dtAux[2].'/'.$dtAux[1].'/'.$dtAux[0];
		}

		return $date;
	}

	public function formatPhone($tel) {

		if($tel) {
			$telefone = preg_replace("[^0-9]",'',$tel);
			$codigo = substr($telefone,0,2);
			$telef1 = substr($telefone,2,4);
			$telef2 = substr($telefone,6,6);
			$resultado = "($codigo) $telef1-$telef2";
		} else {
			$resultado = '';
		}
		return $resultado;

	}

	public function formatCep($cep) {
		if($cep) {
			$pattern = '/(\d{2})(\d{3})(\d*)/';
			$cep = preg_replace($pattern, '$1.$2-$3', $cep);
		}
		return $cep;
	}

	public function formatCpf($cpf) {
		if($cpf) {
			$pattern = '/(\d{3})(\d{3})(\d{3})(\d{2})/';
			$cp = preg_replace($pattern, '$1.$2.$3-$4', $cpf);
		}
		return $cp;
	}

	public function formatCnpj($cnpj) {
		if($cnpj) {
			$pattern = '/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/';
			$cnpj = preg_replace($pattern, '$1.$2.$3/$4-$5', $cnpj);
		}
		return $cnpj;
	}



}

