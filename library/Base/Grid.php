<?php

/**
 * Classe que monta as grids do sistema
 */

class Base_Grid {
	/**
	 * Id da grid
	 *
	 * @var string
	 */

	private $_gridId = '';

	/**
	 * Array com a configuração das colunas
	 *
	 * @var array
	 */

	private $_headers = array();
	/**
	 * Array com os valores das linhas da grid
	 *
	 * @var Zend_Paginator
	 */
	private $_data = array();
	/**
	 * Texto para quando não tiver nenhuma linha na grid
	 *
	 * @var string
	 */
	private $_noRowFound = 'Nenhum item encontrado!';
	/**
	 * Inicio da grid
	 *
	 * @var string
	 */
	private $_xhtmlOpen  = '<table class="grid">';
	/**
	 * Final da grid
	 *
	 * @var string
	 */
	private $_xhtmlClose = '</table>';
	/**
	 * @var boolean
	 */
	private $_hasPaginator = false;
	/**
	 * @var boolean
	 */
	private $_rowClickable = true;
	/**
	 * @var string
	 */
	private $_clickMethod = '';
	/**
	 * @var array
	 */
	private $_paramsClickMethod = array();
	/**
	 * @var integer
	 */
	private $_countPerPage = 10;
	/**
	 * @var boolean
	 */
	private $_hasRefreshToggleButton = false;
	/**
	 * @var boolean
	 */
	private $_noRendererWithNoData = false;

	/**
	 * Construtor da classe
	 *
	 * @param array $options
	 * @return void
	 */
	public function __construct(array $options=array()) {
		if(isset($options['hasRefreshToggleButton'])) {
			$this->setHasRefreshToggleButton($options['hasRefreshToggleButton']);
		}
		if(isset($options['id'])) {
			$this->setId($options['id']);
		}
		if(isset($options['title'])) {
			$this->setTitle($options['title']);
		}
		if(isset($options['header'])) {
			$this->setHeader($options['header']);
		}
		if(isset($options['hasPaginator'])) {
			$this->setHasPaginator($options['hasPaginator']);
		}
		if(isset($options['rowClickable'])) {
			$this->setRowClickable($options['rowClickable']);
		}
		if(isset($options['clickMethod'])) {
			$this->setClickMethod($options['clickMethod']);
		}
		if(isset($options['paramsClickMethod'])) {
			$this->setParamsClickMethod($options['paramsClickMethod']);
		}
		if(isset($options['countPerPage'])) {
			$this->setCountPerPage($options['countPerPage']);
		}
		if(isset($options['data'])) {
			$this->setData($options['data']);
		}
		if(isset($options['currentPageNumber'])) {
			$this->setCurrentPageNumber($options['currentPageNumber']);
		}
		if(isset($options['noRendererWithNoData'])) {
			$this->setNoRendererWithNoData($options['noRendererWithNoData']);
		}
	}
	/**
	 * Método que gerar a grid
	 *
	 * @return string
	 */
	public function generate() {
		$header = $this->mountHeader();
		$body   = $this->mountBody();
		$footer = $this->mountFooter();

		return $this->mountXHTMLGrid($header,$body,$footer);
	}

	/**
	 * Setter se tem o botão de recarregar a grid
	 *
	 * @param $hasRefreshToggleButton
	 * @return Base_Grid
	 */
	public function setHasRefreshToggleButton($hasRefreshToggleButton) {
		$this->_hasRefreshToggleButton = $hasRefreshToggleButton;
		return $this;
	}

	/**
	 * Getter se tem o botão de recarregar a grid
	 *
	 * @return boolean
	 */
	public function getHasRefreshToggleButton() {
		return $this->_hasRefreshToggleButton;
	}

	/**
	 * Setter do title da grid
	 *
	 * @param string $title
	 * @return Base_Grid
	 */
	public function setTitle($title) {
		$refreshToggleButton = '';
		if( $this->getHasRefreshToggleButton() === true ) {
			$refreshToggleButton  = "<button title=\"Recarregar - {$title}\" ";
			$refreshToggleButton .=         'class="float-r ui-state-default ui-corner-all grid-button" ';
			$refreshToggleButton .=         "onclick=\"$(this).toggleClass('ui-state-active');refreshToggleButtonGrid($('#{$this->_gridId}').parent(),$(this),'{$this->_gridId}')\" ";
			$refreshToggleButton .=         'type="button"><span class="ui-icon ui-icon-refresh"></span></button>';
		}

		$this->_xhtmlOpen = "<h6>{$title}{$refreshToggleButton}</h6>{$this->_xhtmlOpen}";
		return $this;

	}

	/**
	 * Setter do ID da grid
	 *
	 * @param string $gridId
	 * @return Base_Grid
	 */
	public function setId($gridId) {
		$this->_xhtmlOpen = substr($this->_xhtmlOpen,0,-1) . " id=\"{$gridId}\">";
		$this->_gridId = $gridId;
		return $this;
	}

	/**
	 * Getter do ID da grid
	 *
	 * @return string
	 */

	public function getId() {
		return $this->_gridId;
	}

	/**
	 * Setter dos headers da Grid
	 *
	 * @param array $headers
	 * @return Base_Grid
	 */

	public function setHeader(array $headers) {
		$this->_headers = $headers;
		return $this;
	}
	/**
	 * Getter dos header da grid
	 *
	 * @return array
	 */
	public function getHeaders() {
		return $this->_headers;
	}
	/**
	 * Setter dos dados da grid
	 *
	 * @param mixed $data
	 * @return Base_Grid
	 */
	public function setData($data=array()) {
		if( $data instanceOf Zend_Db_Table_Rowset ) {
			$this->_data = $data->toArray();
		} else if( is_array($data) ) {
			$this->_data = $data;
		} else {
			$this->_data = array();
		}

		if( $this->getHasPaginator() === true ) {
			$this->_data = Zend_Paginator::factory($this->_data);
		}

		return $this;
	}
	/**
	 * Getter dos dados da grid
	 *
	 * @return array
	 */

	public function getData() {
		if( $this->getHasPaginator() === true ) {
			$this->_data->setItemCountPerPage($this->getCountPerPage());
			$data = $this->_data->getCurrentItems();
		} else {
			$data = $this->_data;
		}

		return $data;

	}

	/**
	 * Setter do clickable
	 *
	 * @param boolean $clickable
	 * @return Base_Grid
	 */

	public function setRowClickable($clickable) {
		$this->_rowClickable = $clickable;
		return $this;
	}

	/**
	 * Getter do clickable
	 *
	 * @return boolean
	 */
	public function getRowClickable() {
		return $this->_rowClickable;
	}
	/**
	 * Setter do método/função que o click da linha ou do botão vai chamar
	 *
	 * @param string $jsFunction
	 * @param array $jsFunctionParams
	 * @return Base_Grid
	 */
	public function setClickMethod($jsFunction,array $jsFunctionParams=array()) {
		$this->_clickMethod = $jsFunction;
		if( count($jsFunctionParams)!==0 ) {
			$this->_paramsClickMethod = $jsFunctionParams;
		}
		return $this;
	}

	/**
	 * Getter do método/função que o click da linha ou do botão vai chamar
	 *
	 * @return string
	 */
	public function getClickMethod() {
		return $this->_clickMethod;
	}

	/**
	 * Setter do(s) parametro(s) que o método/função,
	 * do click da linha ou do botão, vai receber
	 *
	 * @param array $jsFunctionParams
	 * @return Base_Grid
	 */

	public function setParamsClickMethod(array $jsFunctionParams=array()) {
		$this->_paramsClickMethod = $jsFunctionParams;
		return $this;
	}

	/**
	 * Getter do(s) parametro(s) que o método/função,
	 * do click da linha ou do botão, vai receber
	 *
	 * @return array
	 */
	public function getParamsClickMethod(array $jsFunctionParams=array()) {
		return $this->_paramsClickMethod;
	}

	/**
	 * Setter se tem paginator
	 *
	 * @param boolean $hasPaginator
	 * @return Base_Grid
	 */

	public function setHasPaginator($hasPaginator) {
		$this->_hasPaginator = $hasPaginator;
		return $this;
	}

	/**
	 * Getter se tem paginator
	 *
	 * @return boolean
	 */

	public function getHasPaginator() {
		return $this->_hasPaginator;
	}

	/**
	 * Setter da quantidade de linhas por página
	 *
	 * @param integer $countPerPage
	 * @return Base_Grid
	 */

	public function setCountPerPage($countPerPage) {
		$this->_countPerPage = $countPerPage;
		return $this;
	}

	/**
	 * Getter da quantidade de linhas por página
	 *
	 * @return integer
	 */

	public function getCountPerPage() {
		return $this->_countPerPage;
	}

	/**
	 * Método que seta a página corrente
	 * se utilizar o paginador
	 *
	 * @param integer $page
	 * @return void
	 */
	public function setCurrentPageNumber( $page ) {
		if( $this->getHasPaginator() === true ) {
			$this->_data->setCurrentPageNumber($page);
		}
	}
	/**
	 * Método que retorna a página corrente
	 * se utilizar o paginador
	 *
	 * @return integer | boolean false;
	 */
	public function getCurrentPageNumber() {
		if( $this->getHasPaginator() === true ) {
			return $this->_data->getCurrentPageNumber();
		}
		return false;
	}

	/**
	 * Método que seta que não vai renderizar o XHTML da grid se não tiver registros
	 *
	 * @param boolean noRender
	 * @return Base_Grid
	 */
	public function setNoRendererWithNoData( $noRender ) {
		$this->_noRendererWithNoData = $noRender;
		return $this;
	}

	/**
	 * Método que retorna se não vai renderizar o XHTML da grid se não tiver registros
	 *
	 * @return boolean
	 */
	public function getNoRendererWithNoData() {
		return $this->_noRendererWithNoData;
	}

	/**
	 * Método que retorna
	 * a ultima página
	 *
	 * @return integer
	 */
	private function getLastPageNumber() {
		if( $this->getHasPaginator() === true ) {
			$last = $this->_data->getPages()->last;
			return $last;
		}
	}
	/**
	 * Método que retorna
	 * a página anterior
	 *
	 * @return integer
	 */
	private function getPrevPageNumber() {
		if( $this->getHasPaginator() === true ) {
			$prev = $this->_data->getCurrentPageNumber() - 1;
			return $prev;
		}
	}
	/**
	 * Método que retorna
	 * a próxima página
	 *
	 * @return integer
	 */
	private function getNextPageNumber() {
		if( $this->getHasPaginator() === true ) {
			$next = $this->_data->getCurrentPageNumber() + 1;
			return $next;
		}
	}
	/**
	 * Método que retorna
	 * a primeira página
	 *
	 * @return integer
	 */
	private function getFirstPageNumber() {
		if( $this->getHasPaginator() === true ) {
			$first = $this->_data->getPages()->first;
			return $first;
		}
	}
	/**
	 * Método com a rotina de montar o header da grid
	 *
	 * @return string
	 */
	private function mountHeader() {
		if( count($this->_headers)===0 ) {
			throw new Base_Exception('Erro: Grid sem header.');
		}

		$xhtml  = '<thead>';
		$xhtml .=     '<tr>';
		$column = 0;
		foreach($this->_headers as $label=>$columnOption) {
			$column++;
			if( $columnOption['type'] !== 'hidden' ) {
				if( isset($columnOption['header']) ) {
					if( $columnOption['header']===false ) {//column-without-header
						$xhtml .= "<th id=\"{$this->getId()}_column-{$column}\" class=\"column-without-header\"></th>";
					} else {
						$xhtml .= "<th id=\"{$this->getId()}_column-{$column}\">{$columnOption['header']}</th>";
					}
				} else {
					$xhtml .= "<th id=\"{$this->getId()}_column-{$column}\">{$label}</th>";
				}
			} else {
				$xhtml .= "<th class=\"column-hidden\" id=\"{$this->getId()}_column-{$column}\">{$label}</th>";
			}
		}
		$xhtml .=     '</tr>';
		$xhtml .= '</thead>';

		return $xhtml;
	}

	/**
	 * Método com a rotina de montar o body da grid
	 *
	 * @return string
	 */

	private function mountBody() {
		$rows = $this->getData();

		$xhtml  = '<tbody>';
		if( count($rows) === 0 ) {
			$colspan = count($this->_headers);
			$xhtml .= "<tr class=\"row-odd not-valid\"><td colspan=\"{$colspan}\" title=\"{$this->_noRowFound}\">";
			$xhtml .= "<span class=\"ui-icon ui-icon-alert ui-icon-orange\"></span>{$this->_noRowFound}";
			$xhtml .= "</td></tr>";
		} else {
			$line = 0;

			$strParams          = '';
			$clickable          = '';
			$columnNotClickable = '';
			$rowOnClick         = '';

			foreach($rows as $row=>$values) {
				$trClass = (++$line % 2 == 0)?'row-even':'row-odd';

				if( $this->getRowClickable() ) {
					$strParams = $this->mountStrParams($this->getParamsClickMethod(),$values);
					$clickable = 'clickable';
					$columnNotClickable = 'column-not-clickable';
					$rowOnClick = "onclick=\"{$this->getClickMethod()}({$strParams})\"";
				}

				$xhtml .= "<tr id=\"{$this->_gridId}_row_{$row}\" class=\"{$trClass} {$clickable}\">";
				$column = 0;
				foreach($this->_headers as $label=>$columnOption) {
					$column++;

					$columnClass = (isset($columnOption["class"]))?"class=\"{$columnOption["class"]} column-{$column}\"":"class=\"column-{$column}\"";
					$columnWithoutHeader = '';
					if( isset($columnOption['header']) ) {
						if( $columnOption['header']===false ) {
							$columnWithoutHeader = 'column-without-header';
						}
					}
					$columnButtonClass = (isset($columnOption["class"]))?"class=\"{$columnOption["class"]} column-{$column} {$columnNotClickable} {$columnWithoutHeader}\"":"class=\"column-{$column} {$columnNotClickable} {$columnWithoutHeader}\"";
					$title = $values[$columnOption["index"]];
					$columnTitle = str_replace('"','&#34;', $title);


					if( $columnOption['type'] === 'visible' ) {

						$xhtml .= "<td {$rowOnClick} title=\"{$columnTitle}\" {$columnClass}>".($values[$columnOption["index"]])."</td>";

					} else if( $columnOption['type'] === 'button' ) {

						if( is_array($values[$columnOption["index"]]) ) {

							$configButton = $values[$columnOption["index"]];

							if( !$this->getRowClickable() ) {

								if( !isset($configButton['clickMethod']) ) {

									$configButton['clickMethod'] = $this->getClickMethod();

								}

								if( !isset($configButton['paramsClickMethod']) ) {

									$configButton['paramsClickMethod'] = $this->getParamsClickMethod();

								}

							}

							$configButton['strParamsClickMethod'] = $this->mountStrParams($configButton['paramsClickMethod'],$values);

						} else {

							$configButton = $values[$columnOption["index"]];

						}

						$button = $this->mountButton($configButton);

						$xhtml .= "<td width=\"20px\" ".(($button===$configButton)?$rowOnClick:$columnButtonClass).">".$button."</td>";

					} else {

						$xhtml .= "<td class=\"column-hidden column-{$column}\">{$values[$columnOption["index"]]}</td>";

					}

				}

				$xhtml .= '</tr>';

			}

		}



		$xhtml .= '</tbody>';



		return $xhtml;

	}



	/**

	* Método com a rotina de montar o footer da grid

	*

	* @return string

	*/

	private function mountFooter() {

		$colspan = count($this->_headers);

		$xhtml  = "<tfoot onmouseover=\"$('#{$this->_gridId}-currentPageNumberText').hide();$('#{$this->_gridId}-currentPageNumber').show().val({$this->getCurrentPageNumber()}).focus();\"><tr><td colspan=\"{$colspan}\">";



		if( $this->getHasPaginator() === true ) {

			$ultimaPagina = ceil($this->_data->getTotalItemCount() / $this->getCountPerPage());

			$qtdCharUltimaPagina = strlen($ultimaPagina);

			$paginas  = "<input id=\"{$this->_gridId}-currentPageNumber\"";

			$paginas .= "       class=\"ui-corner-all\"";

			$paginas .= "       maxlength=\"{$qtdCharUltimaPagina}\"";

			$paginas .= "       value=\"{$this->getCurrentPageNumber()}\"";

			$paginas .= "       controltype=\"paginator\"";

			$paginas .= "       lastpage=\"{$ultimaPagina}\"";

			$paginas .= "       onblur=\"$(this).hide();$(this).next().show();\"";

			$paginas .= "       onchange=\"if(this.value!=''){paginatorGrid($('#{$this->_gridId}'),this.value);}\" />";

			$paginas .= "<span id=\"{$this->_gridId}-currentPageNumberText\">{$this->getCurrentPageNumber()}</span>";

			$paginas .= "/{$ultimaPagina}";



			$total        = $this->_data->getTotalItemCount();

			$rows         = $this->_data->getCurrentItems();

			//            $show         = count($rows);



			$strPaginator  = ($ultimaPagina>0)?"Páginas: {$paginas}":'';

			$strPaginator .= ($total>0)?" Total: {$total}":'';

			//            $strPaginator .= " Mostrados: {$show}";



			$disabledFirst = ($this->getFirstPageNumber() != $this->getCurrentPageNumber())?false:true;

			$disabledPrev  = ($this->getPrevPageNumber() > 0)?false:true;

			$disabledNext  = ($this->getNextPageNumber() <= $this->getLastPageNumber())?false:true;

			$disabledLast  = ($this->getLastPageNumber() != $this->getCurrentPageNumber())?false:true;



			if( count($this->_data) > 0 ) {

				$xhtml .= '<div>';



				$configButtonFirst = array(

                        'type'             => 'first',

                        'clickMethod'      => 'paginatorGrid',

                        'paramsClickMethod' => array("#{$this->_gridId}",$this->getFirstPageNumber()),

                        'disabled'         => $disabledFirst

				);

				$xhtml .= $this->mountButton($configButtonFirst);



				$configButtonPrev = array(

                        'type'             => 'prev',

                        'clickMethod'      => 'paginatorGrid',

                        'paramsClickMethod' => array("#{$this->_gridId}",$this->getPrevPageNumber()),

                        'disabled'         => $disabledPrev

				);

				$xhtml .= $this->mountButton($configButtonPrev);



				$xhtml .= "<label class=\"paginator-label\" title=\"Ir para pagina...\" onclick=\"$('#{$this->_gridId}-currentPageNumberText').hide();$('#{$this->_gridId}-currentPageNumber').show().val({$this->getCurrentPageNumber()}).focus();\">";

				$xhtml .= $strPaginator;

				$xhtml .= '</label>';



				$configButtonNext = array(

                        'type'             => 'next',

                        'clickMethod'      => 'paginatorGrid',

                        'paramsClickMethod' => array("#{$this->_gridId}",$this->getNextPageNumber()),

                        'disabled'         => $disabledNext

				);

				$xhtml .= $this->mountButton($configButtonNext);



				$configButtonLast = array(

                        'type'             => 'last',

                        'clickMethod'      => 'paginatorGrid',

                        'paramsClickMethod' => array("#{$this->_gridId}",$this->getLastPageNumber()),

                        'disabled'         => $disabledLast

				);

				$xhtml .= $this->mountButton($configButtonLast);



				$xhtml .= '</div>';

			}

		} else {

			$total = count($this->_data);

			$strTotal = ($total>0)?"Total: {$total}":'';



			$xhtml .= '<label class="paginator-label">';

			$xhtml .= $strTotal;

			$xhtml .= '</label>';

		}

		$xhtml .= "</td></tr></tfoot>";

		return $xhtml;

	}



	/**

	* Método que monta a string com os parametros em questão.

	*

	* @param array $paramsClickMethod

	* @param mixed $values

	* @return string

	*/

	private function mountStrParams($paramsClickMethod=array(),$values=array()) {



		$arrParamsX = $paramsClickMethod;

		$arrParams  = array();

		if( count($arrParamsX)>0) {

			foreach($arrParamsX as $indice) {

				$param = (isset($values[$indice]))?$values[$indice]:$indice;

				$arrParams[] = addslashes((string)str_replace('"','&#34;',$param));

			}

		}

		$strParams  = "'";

		$strParams .= implode("','",$arrParams);

		$strParams .= "'";



		return $strParams;

	}



	/**

	* Método que monta o XHTML dos buttons da grid

	*

	* @param mixed $configButton

	* @return string

	*/

	private function mountButton( $configButton=null ) {

		if( is_null($configButton)) {
			throw new Base_Exception('Erro: Configuração, do botão da grid, inválida.');
		}
		if( is_array($configButton) ) {
			if( isset($configButton['type']) ) {
				$label = '';
				$style = '';
				$disabled = '';

				if( isset($configButton['disabled']) ) {
					$disabled = ($configButton['disabled']===true)?'disabled="disabled"':'';
				}
				if( isset($configButton['clickMethod']) ) {
					$paramsClickMethod = isset($configButton['paramsClickMethod'])?$configButton['paramsClickMethod']:array();
					$strParams = isset($configButton['strParamsClickMethod'])?$configButton['strParamsClickMethod']:$this->mountStrParams($paramsClickMethod);
					$buttonOnClick = "onclick=\"{$configButton['clickMethod']}({$strParams})\"";
				}

				switch ($configButton['type']) {
					case 'add':
						$iconType = 'plus';
						$label    = 'Adicionar';
						$style    = 'style="width:100px"';
						$class    = 'row-button';
						break;
					case 'inactivate':
						$iconType = 'circle-minus';
						$label    = 'Inativar';
						$style    = 'style="width:85px"';
						$class    = 'row-button';
						break;
					case 'activate':
						$iconType = 'circle-check';
						$label    = 'Ativar';
						$style    = 'style="width:85px"';
						$class    = 'row-button';
						break;
					case 'renew':
						$iconType = 'arrowrefresh-1-e';
						$label    = 'Renovar';
						$style    = 'style="width:93px"';
						$class    = 'row-button';
						break;
					case 'delete':
						$iconType = 'trash';
						$label    = 'Excluir';
						$style    = 'style="width:80px"';
						$class    = 'row-button';
						break;
					case 'first':
						$iconType = 'seek-first';
						$class    = 'paginator-button grid-button';
						break;
					case 'prev':
						$iconType = 'seek-prev';
						$class    = 'paginator-button grid-button';
						break;
					case 'next':
						$iconType = 'seek-next';
						$class    = 'paginator-button grid-button';
						break;

					case 'last':
						$iconType = 'seek-end';
						$class    = 'paginator-button grid-button';
						break;

					case 'delete-icon':
						$iconType = 'trash';
						break;

					case 'edit-icon':
						$iconType = 'pencil';
						break;
					
						default:
						throw new Base_Exception("Erro: Tipo '{$configButton['type']}' de botão inválido para a grid.");
						break;
				}

				if( isset($configButton['label']) ) {
					if( ($configButton['label']===false) ) {
						$label = '';
						$style = '';
						$class = 'grid-button';
					}
				}

				if($configButton['type']=='delete-icon' OR  $configButton['type']=='edit-icon') {
					$xhtml = "<span name=\"delete-icon\"  class=\"ui-icon ui-icon-{$iconType} \" {$buttonOnClick}></span>";
				} else {
					$xhtml = "<button type=\"button\" {$disabled} {$style} class=\"{$class} ui-state-default ui-corner-all\" {$buttonOnClick}><span class=\"ui-icon ui-icon-{$iconType}\"></span>{$label}</button>";
				}

			}

		} else {
			$xhtml = $configButton;
		}

		return $xhtml;

	}


	/**
	* Métoto que monta todo o conteudo da grid
	*
	* @param string $header
	* @param string $body
	* @param string $footer
	* @return string
	*/
	private function mountXHTMLGrid($header='',$body='',$footer='') {
		if( empty($this->_gridId) ) {
			throw new Base_Exception('Erro: Grid não contém ID.');
		}

		$xhtml = $this->_xhtmlOpen.$header.$body.$footer.$this->_xhtmlClose;

		if( $this->getNoRendererWithNoData() === true ) {
			if( count($this->getData()) === 0 ) {
				$xhtml = '';
			}
		}

		return $xhtml;
	}

}