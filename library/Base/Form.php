<?php
class Base_Form extends Zend_Form
{

	public function __construct($options=null)
	{
		parent::__construct($options);
		$this->addPrefixPath('Base_Form_Decorator',
							 	    'Base/Form/Decorator/',
							 		'decorator');
		$this->addElementPrefixPath('Base_Form_Decorator',
							 	    'Base/Form/Decorator/',
							 		'decorator');
		$this->addDisplayGroupPrefixPath('Base_Form_Decorator',
							 	    'Base/Form/Decorator/',
							 		'decorator');
		//$this->setTranslator(Zend_Registry::get('i18n'));


//		$validatorChain = new Zend_Validate();
//        $validatorChain->addValidator(new Base_Validate_IsCPF());
	}

    /**
     * Process submitted AJAX data
     *
     * Checks if provided $data is valid, via {@link isValid()}. If so,
     * it returns boolean true. If not, it returns array
     * error messages (as returned by {@link getMessages()}).
     *
     * @param  array $data
     * @return boolean true or array error messages
     */
    public function processAjax(array $data)
    {
        if ($this->isValidPartial($data) && count($data)>0) {
            return true;
        }
        $baseException = new Base_Form_Exception();
        $baseException->setFormMessages($this->getMessages());
        throw $baseException;
    }

    /**
     * Método para adicionar uma classe a um elemento
     *
     * @param Zend_Form_Element $element
     * @param string $class
     * @return Base_Form
     */
    public function addElementClass( Zend_Form_Element $element,$class)
    {
        $this->removeElementClass($element,$class);
        $classOld = ( !is_null($element->getAttrib('class')) )? $element->getAttrib('class').' ' : '';
        $element->setAttrib("class", "{$classOld}$class");
        return $this;
    }

    /**
     * Método para remover uma classe de um elemento
     *
     * @param Zend_Form_Element $element
     * @param string $class
     * @return Base_Form
     */
    public function removeElementClass( Zend_Form_Element $element,$class)
    {
        if( !is_null($element->getAttrib('class')) ){
            $classNew = '';
            $classOld = $element->getAttrib('class');
            $classExplode = explode( ' ', $classOld );
            foreach( $classExplode as $key=>$value ){
                if( $value === $class ){ unset($classExplode[$key]); }
            }
            $classNew = implode(' ',$classExplode);
            $element->setAttrib("class", $classNew);
        }
        return $this;
    }
}