<?php
/** Base_Exception */
require_once 'Zend/Exception.php';


/**
 * Exception for Zend_Form component.
 *
 * @category   Zend
 * @package    Zend_Form
 * @copyright  Copyright (c) 2005-2008 Zend Technologies USA Inc. (http://www.zend.com)
 * @license    http://framework.zend.com/license/new-bsd     New BSD License
 */
class Base_Form_Exception extends Base_Exception
{
	protected $arrMessages;

	public function setFormMessages(array $messages){
		$this->arrMessages = $messages;
	}

	public function getFormMessages(){
		return $this->arrMessages;
	}
}
